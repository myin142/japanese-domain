package io.github.myin142.nihon;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.atilika.kuromoji.ipadic.Tokenizer;

/**
 * Handler for requests to Lambda function.
 */
public class AnalyzerMain implements RequestHandler<LinkedHashMap<String, String>, List<SimpleToken>> {

    public List<SimpleToken> handleRequest(final LinkedHashMap<String, String> input, final Context context) {
        String word = input.get("q");
        Tokenizer tokenizer = new Tokenizer();
        return tokenizer.tokenize(word).stream()
                .map(SimpleToken::new)
                .collect(Collectors.toList());
    }

}
