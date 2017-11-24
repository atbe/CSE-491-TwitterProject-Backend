import * as functions from 'firebase-functions';
import { Tweet } from './models/twitter/tweet';
import * as tweetAnalyzer from './tweet-analyzer';

export const analyzeSentiment = functions.firestore
	.document('replies/{replyId}')
	.onCreate(async (event) => {
		const reply: Tweet = event.data.data();

		await tweetAnalyzer.updateSentiment(reply);
	});

export const countHashtags = functions.firestore
	.document('replies/{replyId}')
	.onCreate(async (event) => {
		const reply: Tweet = event.data.data();

		await tweetAnalyzer.countHashtags(reply);
	});

// export const countHashtagsTEST = functions.https.onRequest(async (req, res) => { // 	const tweet: Tweet = req.body;
// 	const tweet = req.body;
// 	try {
// 		await tweetAnalyzer.countHashtags(tweet);
// 	} catch (err) {
// 		console.error(err);
// 		res.sendStatus(500);
// 		return;
// 	}
// 	res.sendStatus(200);
// });