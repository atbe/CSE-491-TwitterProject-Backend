import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import Sentiment = gapi.client.language.Sentiment
import * as sentiment from './sentiment';

admin.initializeApp(functions.config().firebase);

const db: admin.firestore.Firestore = new admin.firestore.Firestore();

export const analyzeSentiment = functions.firestore
	.document('replies/{replyId}')
	.onCreate(async (event) => {
		const reply = event.data.data();

		updateSentiment(reply.in_reply_to_status_id_str, await sentiment.getSentiment({
			content: reply.text as string,
			type: 'PLAIN_TEXT'
		}));
	});

function updateSentiment(tweetId: string, sentiment: Sentiment): void {
	const sentimentRef = db.doc(`sentiment/${tweetId}`);
	sentimentRef.get().then(
		(docSnapshot: any) => {
			if (docSnapshot.exists) {
				sentimentRef.set({
					count: docSnapshot.get('count') + 1,
					score: docSnapshot.get('score') + sentiment.score
				});
			} else {
				sentimentRef.set({
					count: 1,
					score: sentiment.score
				});
			}
		}
	)
}
