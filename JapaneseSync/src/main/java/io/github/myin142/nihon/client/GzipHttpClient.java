package io.github.myin142.nihon.client;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class GzipHttpClient {

    public InputStream download(String httpUrl) throws IOException {
        URL url = new URL(httpUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        return new GzipByteSource(conn.getInputStream()).openStream();
    }

}
