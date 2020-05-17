package io.github.myin142.nihon.radical;

import io.github.myin142.nihon.SyncCommand;
import io.github.myin142.nihon.client.GzipHttpClient;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.io.*;
import java.nio.charset.Charset;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class RadicalSync implements SyncCommand {

    private static final String radicalUrl = "http://ftp.monash.edu/pub/nihongo/kradfile.gz";
    private static long listLimit = 25;

    private GzipHttpClient gzipHttpClient;
    private DynamoDbClient dbClient;

    public RadicalSync(GzipHttpClient gzipHttpClient) {
        this.gzipHttpClient = gzipHttpClient;
        this.dbClient = DynamoDbClient.builder()
                .region(Region.EU_CENTRAL_1)
                .build();
    }

    @Override
    public void sync(List<String> args) {
        try {
            setWriteThroughput(20L); // Max free tier throughput is 25 but 5 is already used somewhere else
        } catch (Exception e) {
            log.info("Exception on Throughput Increase: " + e.getMessage());
            restoreThroughput();
            throw e;
        }

        log.info("Start Radical Sync. Args: " + args);

        String startKanji = null;
        if (args.size() > 0) {
            startKanji = args.get(0);
            log.info("Starting at Kanji " + startKanji);
        }

        try (InputStream in = gzipHttpClient.download(radicalUrl);
             BufferedReader reader = new BufferedReader(new InputStreamReader(in, Charset.forName("EUC-JP")))) {

            List<KanjiRadical> kanjiRadicals = new ArrayList<>();

            boolean foundStart = false;
            String line;
            while ((line = reader.readLine()) != null) {
                String[] columns = line.split(" : ");

                if (columns.length == 2) {
                    String kanji = columns[0];
                    Set<String> radicals = new HashSet<>(Arrays.asList(columns[1].split(" ")));

                    if ((kanji.equals(startKanji) || startKanji == null) && !foundStart) {
                        foundStart = true;
                    } else if (!foundStart) {
                        continue;
                    }

                    for (String radical : radicals) {
                        KanjiRadical kanjiRadical = new KanjiRadical();
                        kanjiRadical.setKanji(kanji);
                        kanjiRadical.setRadical(radical);
                        kanjiRadical.setOtherRadicals(radicals.stream()
                                .filter(r -> !r.equals(radical))
                                .collect(Collectors.toSet()));

                        kanjiRadicals.add(kanjiRadical);

                        if (kanjiRadicals.size() >= listLimit) {
                            updateKanjiRadicals(kanjiRadicals);
                            kanjiRadicals.clear();
                        }
                    }
                }
            }

            if (kanjiRadicals.size() > 0) {
                updateKanjiRadicals(kanjiRadicals);
            }

        } catch (IOException e) {
            e.printStackTrace();
            log.info("Error on radical sync: " + e.getMessage());
        }

        restoreThroughput();
        log.info("Finished Radical Sync");
    }

    private void restoreThroughput() {
        log.info("Restoring Throughput");
        try {
            setWriteThroughput(5);
        } catch (Exception e) {
            log.info("Exception on Throughput Restore: " + e.getMessage());
            throw e;
        }
    }

    private void setWriteThroughput(long throughput) {
        dbClient.updateTable(UpdateTableRequest.builder()
                .tableName("kanji-radicals")
                .provisionedThroughput(ProvisionedThroughput.builder()
                        .readCapacityUnits(5L)
                        .writeCapacityUnits(throughput)
                        .build())
                .build());
    }

    private void updateKanjiRadicals(List<KanjiRadical> kanjiRadicals) {
        List<TransactWriteItem> transactions = kanjiRadicals.stream()
                .map(kanjiRad -> {
                    System.out.println(kanjiRad);
                    Update.Builder builder = Update.builder()
                            .tableName("kanji-radicals")
                            .key(Map.of(
                                    "radical", AttributeValue.builder().s(kanjiRad.getRadical()).build(),
                                    "kanji", AttributeValue.builder().s(kanjiRad.getKanji()).build()
                            ));

                    if (kanjiRad.getOtherRadicals().size() > 0) {
                        builder.updateExpression("set otherRadicals = :otherRadicals")
                                .expressionAttributeValues(Map.of(
                                        ":otherRadicals", AttributeValue.builder().ss(kanjiRad.getOtherRadicals()).build()
                                ));
                    } else {
                        builder.updateExpression("remove otherRadicals");
                    }

                    return builder.build();
                })
                .map(u -> TransactWriteItem.builder().update(u).build())
                .collect(Collectors.toList());

        dbClient.transactWriteItems(TransactWriteItemsRequest.builder()
                .transactItems(transactions)
                .build());
    }

}
