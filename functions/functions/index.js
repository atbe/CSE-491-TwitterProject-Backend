const functions = require('firebase-functions');
const language = require('@google-cloud/language');

const languageClient = new language.LanguageServiceClient();

exports.processReplySentiment = functions.firestore
  .document('replies/{replyId}')
  .onCreate((event) => {
    let reply = event.data.data();

    let replyText = reply.text;

    let document = {
      content: replyText,
      type: 'PLAIN_TEXT'
    };

      languageClient.analyzeSentiment({document: document}).then(
          (results) => {
              const sentiment = results[0].documentSentiment;

              const sentimentRef = functions.firestore.document(`sentiment/${reply.id}`);
              sentimentRef.get().then(
                  (docSnapshot) => {
                      if (docSnapshot.exists) {
                          count = docSnapshot.child('count');
                          totalScore = docSnapshot.child('score') * count;
                          count++;
                          score = (score + sentiment.score) / count;
                          sentimentRef.set({
                              count: count,
                              score: score
                          });
                      } else {
                          sentimentRef.set({
                              count: 1,
                              score: sentiment.score
                          });
                      }
                  }
              )
          },
          (err) => {
              console.error('Unhandled error occurred while querying for sentiment');
              console.error(err);
          }
      );
  });
