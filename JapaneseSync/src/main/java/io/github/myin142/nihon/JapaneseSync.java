package io.github.myin142.nihon;

import io.github.myin142.nihon.client.GzipHttpClient;
import io.github.myin142.nihon.radical.RadicalSync;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public class JapaneseSync {

    private static Map<String, Function<GzipHttpClient, SyncCommand>> syncCommands = Map.of(
            "vocabulary", VocabularySync::new,
            "radical", RadicalSync::new
    );

    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("No Command specified");
            return;
        }

        List<String> commandArgs = new ArrayList<>(Arrays.asList(args));
        commandArgs.remove(0);

        String command = args[0];
        System.out.println("Command: " + command);

        GzipHttpClient gzipHttpClient = new GzipHttpClient();
        SyncCommand syncCommand = syncCommands.get(command).apply(gzipHttpClient);
        syncCommand.sync(commandArgs);
    }

}