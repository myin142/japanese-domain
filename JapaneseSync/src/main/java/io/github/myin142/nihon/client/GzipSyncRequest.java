package io.github.myin142.nihon.client;

import java.io.IOException;
import java.io.InputStream;

public abstract class GzipSyncRequest {

    private GzipHttpClient client = new GzipHttpClient();

    public InputStream get(String url) throws IOException {
        return client.download(url).openStream();
    }

}
