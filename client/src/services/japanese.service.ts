import * as AWS from 'aws-sdk';

export class JapaneseService {

    private static ANALYZER_LAMBDA = 'JapaneseAnalyzer';
    private static SEARCH_LAMDBA = 'JapaneseSearch';

    async analyze(text: string): Promise<Token[]> {
        return this.invokeLambda(JapaneseService.ANALYZER_LAMBDA, { q: text });
    }

    async search(text: string): Promise<SearchResult[]> {
        return this.invokeLambda(JapaneseService.SEARCH_LAMDBA, { q: text });
    }

    private async invokeLambda(name: string, payload: object): Promise<any> {
        const lambda = new AWS.Lambda({ region: 'eu-central-1' });
        const response = await lambda.invoke({
            FunctionName: JapaneseService.ANALYZER_LAMBDA,
            Payload: JSON.stringify(payload),
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

export interface SearchResult {
    slug: string;
    is_common: boolean;
    japanese: SearchJapanese[];
    senses: SearchSense[];
}

export interface SearchJapanese {
    word: string;
    reading: string;
}

export interface SearchSense {
    english_definition: string[];
}