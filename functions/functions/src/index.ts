import * as functions from 'firebase-functions';
import { Tweet } from './models/twitter/tweet';
import * as tweetAnalyzer from './tweet-analyzer';

export const analyzeSentiment = functions.firestore
	.document('replies/{replyId}')
	.onCreate(async (event) => {
		const reply: Tweet = event.data.data();

		tweetAnalyzer.updateSentiment(reply);
	});

export const countHashtags = functions.firestore
	.document('replies/{replyId}')
	.onCreate(async (event) => {
		const reply: Tweet = event.data.data();

		tweetAnalyzer.countHashtags(reply);
	});
