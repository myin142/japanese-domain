package io.github.myin142.nihon;

import io.github.myin142.nihon.client.GzipHttpClient;
import io.github.myin142.nihon.xml.XMLReaderClient;
import io.github.myin142.nihon.xml.XMLUtils;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.TransactWriteItem;
import software.amazon.awssdk.services.dynamodb.model.TransactWriteItemsRequest;
import software.amazon.awssdk.services.dynamodb.model.Update;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class VocabularySync implements SyncCommand {
    private static String vocabUrl = "http://ftp.monash.edu/pub/nihongo/JMdict_e.gz";
    private static long limit = 1000;
    private static long listLimit = 25;

    private GzipHttpClient gzipHttpClient;

    public VocabularySync(GzipHttpClient gzipHttpClient) {
        this.gzipHttpClient = gzipHttpClient;
    }

    @Override
    public void sync(List<String> args) {
        DynamoDbClient dbClient = DynamoDbClient.builder()
                .region(Region.EU_CENTRAL_1)
                .build();

        try (InputStream in = gzipHttpClient.download(vocabUrl);
             XMLReaderClient xmlReader = new XMLReaderClient(in)) {

            long count = 0;

            XMLEventReader reader = xmlReader.getReader();

            log.info("Start Processing");
            List<Vocabulary> batchVocab = new ArrayList<>();
            while (count < limit && reader.hasNext()) {
                Vocabulary vocab = new Vocabulary();
                XMLUtils.eachElementBetween(xmlReader.getReader(), "entry", elem -> {
                    String tag = elem.getName().getLocalPart();
                    switch (tag) {
                        case "ent_seq":
                            vocab.setSequence(XMLUtils.nextLong(reader));
                            break;
                        case "keb":
                            if (vocab.getWord() == null) {
                                String word = XMLUtils.nextText(reader);

                                if (JapaneseUtils.containsJapanese(word)) {
                                    vocab.setWord(word);
                                }
                            }
                            break;
                        case "reb":
                            if (vocab.getReading() == null)
                                vocab.setReading(XMLUtils.nextText(reader));
                            break;
                        case "gloss":
                            vocab.addMeaning(XMLUtils.nextText(reader));
                            break;
                    }
                });

                if (vocab.getWord() != null && vocab.getReading() != null) {
                    count++;
                    batchVocab.add(vocab);
                }

                if (batchVocab.size() >= listLimit) {
                    transactUpdate(batchVocab, dbClient);
                    batchVocab.clear();
                }
            }

            if (batchVocab.size() > 0) {
                transactUpdate(batchVocab, dbClient);
            }

            log.info("Finish Processing of " + count + " items");
        } catch (IOException | XMLStreamException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    private void transactUpdate(List<Vocabulary> vocabularies, DynamoDbClient dbClient) {
        List<TransactWriteItem> transactions = vocabularies.stream()
                .map(v -> {
                    return Update.builder()
                            .tableName("japanese-vocabulary")
                            .key(Map.of(
                                    "vocabulary", AttributeValue.builder().s(v.getWord()).build(),
                                    "reading", AttributeValue.builder().s(v.getReading()).build()
                            ))
                            .updateExpression("set meanings = :meanings")
                            .expressionAttributeValues(Map.of(
                                    ":meanings", AttributeValue.builder().ss(v.getMeanings()).build()
                            ))
                            .build();
                })
                .map(u -> TransactWriteItem.builder().update(u).build())
                .collect(Collectors.toList());

        dbClient.transactWriteItems(TransactWriteItemsRequest.builder()
                .transactItems(transactions)
                .build());
    }

}
