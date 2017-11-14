// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a client
const client = new language.LanguageServiceClient({
    keyFilename: '../../../TwitterTweetTracker-93ade215aff3.json'
});
// const client = new language.LanguageServiceClient();

export async function getSentiment(document) {
    return client.analyzeSentiment({document: document}).then(
        (results) => {
            return results[0].documentSentiment;
        },
        (err) => {
            console.error(`Error while analyzing sentiment for reply: ${err}`);
        }
    );
}
