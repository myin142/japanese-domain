package io.github.myin142.nihon;

import com.atilika.kuromoji.ipadic.Token;

public class SimpleToken {

    private String surface;
    private String allFeatures;

    public SimpleToken(Token token) {
        this.surface = token.getSurface();
        this.allFeatures = token.getAllFeatures();
    }

    public String getSurface() {
        return surface;
    }

    public String getAllFeatures() {
        return allFeatures;
    }
}
