package io.github.myin142.nihon;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class Vocabulary {
    private long sequence;
    private String word;
    private String reading;
    private Set<String> meanings = new HashSet<>();

    public void addMeaning(String meaning) {
        this.meanings.add(meaning);
    }
}
