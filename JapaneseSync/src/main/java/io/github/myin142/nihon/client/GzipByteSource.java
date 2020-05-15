package io.github.myin142.nihon.client;

import com.google.common.io.ByteSource;

import java.io.IOException;
import java.io.InputStream;
import java.util.zip.GZIPInputStream;

public class GzipByteSource extends ByteSource {

    private InputStream source;

    public GzipByteSource(InputStream source) {
        this.source = source;
    }

    @Override
    public InputStream openStream() throws IOException {
        return new GZIPInputStream(source);
    }

}
