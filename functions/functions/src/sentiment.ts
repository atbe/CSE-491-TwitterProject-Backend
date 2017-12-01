const sentiment = require('sentiment');

export async function getSentiment(text: string): Promise<any> {
    return sentiment(text);
}
