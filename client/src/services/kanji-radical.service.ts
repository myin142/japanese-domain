import * as AWS from 'aws-sdk';
import { AttributeValue, AttributeMap } from 'aws-sdk/clients/dynamodb';

export class KanjiRadicalService {

    async getKanjisForRadical(radical: string): Promise<KanjiRadical> {
        const dbClient = new AWS.DynamoDB({ region: 'eu-central-1' });

        const response = await dbClient.query({
            TableName: 'kanji-radicals',
            KeyConditionExpression: 'radical = :radical',
            ExpressionAttributeValues: {
                ':radical': { S: radical },
            },
            ProjectionExpression: 'kanji, otherRadicals',
        }).promise();

        const kanjis = response.Items.map(i => this.resolveAttributeMap(i)) as KanjiRadicalResponse[];
        return { radical, kanjis };
    }

    private resolveAttributeMap<T>(attrMap: AttributeMap): T {
        const result = {};
        Object.keys(attrMap).forEach(key => {
            result[key] = this.flatAttributeValue(attrMap[key]);
        });

        return result as T;
    }

    private flatAttributeValue<T>(attrValue: AttributeValue): T {
        const values = Object.keys(attrValue || {})
            .map(k => attrValue[k])
            .filter(x => x != null);

        return (values.length > 0) ? values[0] : null;
    }
}

export interface KanjiRadicalResponse {
    radical: string;
    kanji: string;
    otherRadicals: string[];
}

export interface KanjiRadical {
    radical: string;
    kanjis: KanjiRadicalResponse[];
}

export const kanjiRadicalService = new KanjiRadicalService();