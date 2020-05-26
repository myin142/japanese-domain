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
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class VocabularySync implements SyncCommand {
    private static String vocabUrl = "http://ftp.monash.edu/pub/nihongo/JMdict_e.gz";
    private static long limit = -1;

    private GzipHttpClient gzipHttpClient;
    private Path output = Paths.get("vocabulary.csv");

    public VocabularySync(GzipHttpClient gzipHttpClient) {
        this.gzipHttpClient = gzipHttpClient;
    }

    @Override
    public void sync(List<String> args) {
        try (InputStream in = gzipHttpClient.download(vocabUrl);
             XMLReaderClient xmlReader = new XMLReaderClient(in)) {

            long count = 0;

            XMLEventReader reader = xmlReader.getReader();

            log.info("Start Processing");
            List<Vocabulary> batchVocab = new ArrayList<>();
            while ((limit == -1 || count < limit) && reader.hasNext()) {
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
            }

            if (Files.notExists(output)) {
                Files.createFile(output);
            }

            try (BufferedWriter writer = Files.newBufferedWriter(output, StandardOpenOption.TRUNCATE_EXISTING)) {
                for (Vocabulary vocabulary : batchVocab) {
                    writer.write(vocabulary.toCsv() + "\n");
                }
            }

            log.info("Finish Processing of " + count + " items");
        } catch (IOException | XMLStreamException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

}
