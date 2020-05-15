package io.github.myin142.nihon;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import io.github.myin142.nihon.client.GzipSyncRequest;
import io.github.myin142.nihon.xml.XMLReaderClient;
import io.github.myin142.nihon.xml.XMLUtils;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;

public class JapaneseVocabularySync extends GzipSyncRequest implements RequestHandler<Void, Void> {

    private String vocabUrl = "http://ftp.monash.edu/pub/nihongo/JMdict_e.gz";
    private long limit = 100;

    @Override
    public Void handleRequest(Void input, Context context) {
        try (InputStream in = get(vocabUrl);
             XMLReaderClient xmlReader = new XMLReaderClient(in)) {

            long count = 0;

            XMLEventReader reader = xmlReader.getReader();

            while (count <= limit) {
                Vocabulary vocab = new Vocabulary();
                XMLUtils.eachElementBetween(xmlReader.getReader(), "entry", elem -> {
                    String tag = elem.getName().getLocalPart();
                    switch (tag) {
                        case "ent_seq":
                            vocab.setSequence(XMLUtils.nextLong(reader));
                            break;
                        case "keb":
                            vocab.addWord(XMLUtils.nextText(reader));
                            break;
                        case "reb":
                            vocab.addReading(XMLUtils.nextText(reader));
                            break;
                        case "gloss":
                            vocab.addMeaning(XMLUtils.nextText(reader));
                            break;
                    }
                });
                count++;
                System.out.println(vocab);
            }

        } catch (IOException | XMLStreamException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        return null;
    }

    private void applyVocabulary(Vocabulary vocabulary, String tag, XMLReaderClient xmlReader) {
        try {
            switch (tag) {
                case "ent_seq":
                    vocabulary.setSequence(xmlReader.nextLong());
                    break;
                case "keb":
                    vocabulary.addWord(xmlReader.nextText());
                    break;
                case "reb":
                    vocabulary.addReading(xmlReader.nextText());
                    break;
                case "gloss":
                    vocabulary.addMeaning(xmlReader.nextText());
                    break;
            }
        } catch (XMLStreamException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

}