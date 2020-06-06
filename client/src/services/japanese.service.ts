import * as AWS from 'aws-sdk';

export class JapaneseService {

    private static ANALYZER_LAMBDA = 'JapaneseAnalyzer';

    async analyze(text: string): Promise<Token[]> {
        const lambda = new AWS.Lambda({ region: 'eu-central-1' });
        const response = await lambda.invoke({
            FunctionName: JapaneseService.ANALYZER_LAMBDA,
            Payload: JSON.stringify({ q: text }),
        }).promise();

        return JSON.parse(response.Payload as string);
    }

}

export const japaneseService = new JapaneseService();

export interface Token {
    surface: string;
    // position: number;
    // partOfSpeechLevel1: string;
    // partOfSpeechLevel2: string;
    // partOfSpeechLevel3: string;
    // partOfSpeechLevel4: string;
    // conjugationType: string;
    // conjugationForm: string;
    // baseForm: string;
    // reading: string;
    // pronunciation: string;
    // known: boolean;
    // user: boolean;
    allFeatures: string;
    // allFeaturesArray: string[];
}