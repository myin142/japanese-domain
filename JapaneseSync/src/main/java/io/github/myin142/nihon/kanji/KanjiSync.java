package io.github.myin142.nihon.kanji;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.myin142.nihon.JapaneseUtils;
import io.github.myin142.nihon.SyncCommand;
import io.github.myin142.nihon.client.GzipHttpClient;
import io.github.myin142.nihon.xml.XMLReaderClient;
import io.github.myin142.nihon.xml.XMLUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@AllArgsConstructor
public class KanjiSync implements SyncCommand {
    private static final String url = "http://ftp.monash.edu.au/pub/nihongo/kanjidic2.xml.gz";
    private static long limit = 10;

    private final GzipHttpClient gzipHttpClient;
    private final Path output = Paths.get("kanji.csv");

    @Override
    public void sync(List<String> args) {
        try (InputStream in = gzipHttpClient.download(url);
             XMLReaderClient xmlReader = new XMLReaderClient(in)) {

            long count = 0;

            XMLEventReader reader = xmlReader.getReader();

            log.info("Start Processing");
            List<Kanji> items = new ArrayList<>();
            while ((limit == -1 || count < limit) && reader.hasNext()) {
                Kanji kanji = new Kanji();
                XMLUtils.eachElementBetween(xmlReader.getReader(), "character", elem -> {
                    String tag = elem.getName().getLocalPart();
                    switch (tag) {
                        case "literal":
                            kanji.setKanji(XMLUtils.nextText(reader));
                            break;
                    }
                });

                if (kanji.getKanji() != null) {
                    count++;
                    items.add(kanji);
                }
            }

            if (Files.notExists(output)) {
                Files.createFile(output);
            }

            ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(output.toFile(), items);

            log.info("Finish Processing of " + count + " items");
        } catch (IOException | XMLStreamException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

}
