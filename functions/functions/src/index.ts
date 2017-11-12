import * as functions from 'firebase-functions';
import * as sentiment from './sentiment';
import { Tweet } from './models/tweet';
import * as tweetAnalyzer from './tweet-analyzer';

export const analyzeSentiment = functions.firestore
	.document('replies/{replyId}')
	.onCreate(async (event) => {
		const reply: Tweet = event.data.data();

		tweetAnalyzer.updateSentiment(reply);
	});
