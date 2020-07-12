package io.github.myin142.nihon.kanji;

import lombok.Data;

@Data
public class Kanji {
    private String kanji;
    private Integer grade;
    private Integer frequency;
    private Integer jlpt;
}
