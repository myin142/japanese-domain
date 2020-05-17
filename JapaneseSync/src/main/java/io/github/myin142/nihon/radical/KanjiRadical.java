package io.github.myin142.nihon.radical;

import lombok.Data;

import java.util.Set;

@Data
public class KanjiRadical {
    private String radical;
    private String kanji;
    private Set<String> otherRadicals;
}
