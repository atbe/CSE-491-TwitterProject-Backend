const functions = require('firebase-functions');
const language = require('@google-cloud/language');

const languageClient = new language.LanguageServiceClient();

exports.processReplySentiment = functions.firestore
  .document('replies/{replyId}')
  .onCreate((event) => {
    var reply = event.data.data();

    var replyText = reply.text;
    console.log(replyText)

    var document = {
      content: replyText,
      type: 'PLAIN_TEXT'
    };

    var sentiment = languageClient.analyzeSentiment({document: document}).then(
      (results) => {
        const sentiment = results[0].documentSentiment;
        console.log(`Text: ${replyText}`);
        console.log(`Sentiment score: ${sentiment.score}`);
        console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
      }
    );
});
