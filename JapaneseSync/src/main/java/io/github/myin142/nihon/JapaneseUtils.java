package io.github.myin142.nihon;

import lombok.experimental.UtilityClass;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class JapaneseUtils {

    public List<String> extractKanjis(String kanjis) {
        return Arrays.stream(kanjis.split(""))
            .filter(JapaneseUtils::isKanji)
            .collect(Collectors.toList());
    }

    public boolean containsJapanese(String text) {
        if (text == null) {
            return false;
        }

        return Arrays.stream(text.split("")).anyMatch(JapaneseUtils::isJapaneseCharacter);
    }

    private boolean isKanji(String str) {
        return Character.UnicodeBlock.of(str.charAt(0)) == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS;
    }

    private boolean isJapaneseCharacter(String str) {
        Character.UnicodeBlock unicodeBlock = Character.UnicodeBlock.of(str.charAt(0));
        return unicodeBlock == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS ||
                unicodeBlock == Character.UnicodeBlock.HIRAGANA ||
                unicodeBlock == Character.UnicodeBlock.KATAKANA;
    }

}
