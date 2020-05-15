package io.github.myin142.nihon.xml;

import javax.xml.namespace.QName;
import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.StartElement;
import javax.xml.stream.events.XMLEvent;
import java.io.InputStream;
import java.util.Objects;
import java.util.stream.Stream;

public class XMLReaderClient implements AutoCloseable {

    public XMLEventReader getReader() {
        return reader;
    }

    private final XMLEventReader reader;
    private XMLEvent currentEvent;

    public XMLReaderClient(InputStream in) throws XMLStreamException {
        XMLInputFactory factory = XMLInputFactory.newInstance();
//        factory.setProperty(XMLInputFactory.IS_REPLACING_ENTITY_REFERENCES, false);
        reader = factory.createXMLEventReader(in);
    }

    public Stream<String> streamTagsBetween(String tag) {
        try {
            StartElement startElement = getNextStartTag(reader, tag);
            if (startElement != null && reader.hasNext()) {
                return Stream.generate(this::processEvent)
                        .filter(Objects::nonNull)
                        .filter(XMLEvent::isStartElement)
                        .map(XMLEvent::asStartElement)
                        .map(StartElement::getName)
                        .map(QName::getLocalPart)
                        .takeWhile(elem -> hasNextAndNotEndTagOf(tag));
            }
        } catch (XMLStreamException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        return Stream.empty();
    }

    private XMLEvent processEvent() {
        try {
            currentEvent = reader.nextEvent();
            return currentEvent;
        } catch (XMLStreamException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    private boolean hasNextAndNotEndTagOf(String tag) {
        return reader.hasNext() &&
                !(currentEvent.isEndElement() && currentEvent.asEndElement().getName().getLocalPart().equals(tag));
    }

    private StartElement getNextStartTag(XMLEventReader reader, String tag) throws XMLStreamException {
        XMLEvent ev = null;
        while (reader.hasNext()) {
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

    public String nextText() throws XMLStreamException {
        return XMLUtils.nextText(reader);
    }

    public long nextLong() throws XMLStreamException {
        return XMLUtils.nextLong(reader);
    }

    @Override
    public void close() throws XMLStreamException {
        reader.close();
    }
}
