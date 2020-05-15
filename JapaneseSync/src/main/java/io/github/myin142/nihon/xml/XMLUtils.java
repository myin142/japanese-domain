package io.github.myin142.nihon.xml;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.StartElement;
import javax.xml.stream.events.XMLEvent;

public class XMLUtils {

    public static Integer nextInt(XMLEventReader reader) throws XMLStreamException {
        return Integer.parseInt(nextText(reader));
    }

    public static Long nextLong(XMLEventReader reader) throws XMLStreamException {
        return Long.parseLong(nextText(reader));
    }

    public static String nextText(XMLEventReader reader) throws XMLStreamException {
        return reader.nextEvent().asCharacters().getData();
    }

    public static void eachElementBetween(XMLEventReader reader, String tag, XMLStreamConsumer<StartElement> consumer) {
        try {
            StartElement startElement = getNextStartTag(reader, tag);
            if (startElement != null) {
                XMLEvent ev = null;
                while (reader.hasNext()) {
                    ev = reader.nextEvent();

                    if (ev.isStartElement()) {
                        consumer.accept(ev.asStartElement());
                    }

                    if (ev.isEndElement() && ev.asEndElement().getName().getLocalPart().equals(tag)) {
                        break;
                    }
                }
            }
        } catch (XMLStreamException e) {
            throw new RuntimeException(e);
        }
    }

    private static StartElement getNextStartTag(XMLEventReader reader, String tag) throws XMLStreamException {
        XMLEvent ev = null;
        while(reader.hasNext()) {
            ev = reader.nextEvent();

            if (ev.isStartElement()) {
                StartElement element = ev.asStartElement();
                if (element.getName().getLocalPart().equals(tag)) {
                    return element;
                }
            }
        }

        return null;
    }
}
