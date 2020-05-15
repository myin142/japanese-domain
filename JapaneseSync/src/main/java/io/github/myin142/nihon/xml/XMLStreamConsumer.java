package io.github.myin142.nihon.xml;

import javax.xml.stream.XMLStreamException;

@FunctionalInterface
public interface XMLStreamConsumer<T> {
    void accept(T t) throws XMLStreamException;
}
