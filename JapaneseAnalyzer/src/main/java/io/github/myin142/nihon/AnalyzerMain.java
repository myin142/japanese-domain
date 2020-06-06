package io.github.myin142.nihon;

import java.util.LinkedHashMap;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.atilika.kuromoji.ipadic.Tokenizer;

/**
 * Handler for requests to Lambda function.
 */
public class AnalyzerMain implements RequestHandler<LinkedHashMap<String, String>, Object> {

    public Object handleRequest(final LinkedHashMap<String, String> input, final Context context) {
        String word = input.get("q");
        Tokenizer tokenizer = new Tokenizer();
        return tokenizer.tokenize(word);
    }

}
