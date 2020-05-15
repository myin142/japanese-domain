package io.github.myin142.nihon;

import java.util.ArrayList;
import java.util.List;

public class Vocabulary {
    private long sequence;
    private List<String> words = new ArrayList<>();
    private List<String> readings = new ArrayList<>();
    private List<String> meanings = new ArrayList<>();

    public long getSequence() {
        return sequence;
    }

    public void setSequence(long sequence) {
        this.sequence = sequence;
    }

    public void addWord(String word) {
        this.words.add(word);
    }

    public void addReading(String reading) {
        this.readings.add(reading);
    }

    public void addMeaning(String meaning) {
        this.meanings.add(meaning);
    }

    public List<String> getWords() {
        return words;
    }

    public List<String> getReadings() {
        return readings;
    }

    public List<String> getMeanings() {
        return meanings;
    }

    @Override
    public String toString() {
        return "Vocabulary{" +
                "sequence=" + sequence +
                ", words=" + words +
                ", readings=" + readings +
                ", meanings=" + meanings +
                '}';
    }
}
