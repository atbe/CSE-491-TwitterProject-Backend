// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a client
const client = new language.LanguageServiceClient();

exports.getSentiment = async function (document) {
    return client.analyzeSentiment({document: document}).then(
        (results) => {
            return results[0].documentSentiment;
        },
        (err) => {
            console.error(`Error while analyzing sentiment for reply: ${err}`);
        }
    );
}
