import * as db from './db';
import { Hashtag, Tweet } from "./models/twitter/tweet";
import * as sentiment from "./sentiment";
import { StringCounter } from "./models/stringCounter";
import { TweetSentiment } from "./models/sentiment";
const Stopword = require('stopword');

export async function updateSentiment(tweet: Tweet): Promise<void> {
	const replySentiment = await sentiment.getSentiment(tweet.text as string);
    const path = `sentiment/${tweet.in_reply_to_status_id_str}`;
    return db.transaction(path,async (tweetSentiment: TweetSentiment | null): Promise<TweetSentiment> => {
        if (tweetSentiment) {
            tweetSentiment.score += replySentiment.comparative;
            tweetSentiment.count += 1;
            if (replySentiment.score < 0) {
            	tweetSentiment.negativeCount +=1;
            } else if (replySentiment.score > 0) {
            	tweetSentiment.positiveCount += 1;
            } else {
            	tweetSentiment.neutralCount += 1;
            }
        } else {
            tweetSentiment = {
            	negativeCount: replySentiment.score < 0 ? 1 : 0,
	            positiveCount: replySentiment.score > 0 ? 1 : 0,
	            neutralCount: replySentiment.score === 0 ? 1 : 0,
                count: 1,
                score: replySentiment.comparative
            };
        }
        return Promise.resolve(tweetSentiment);
    });
}

export async function countHashtags(tweet: Tweet): Promise<void> {
	for (const hashtag of tweet.entities.hashtags) {
		const path = `hashtags/${tweet.in_reply_to_status_id_str}/${tweet.in_reply_to_status_id_str}/${hashtag.text.toLowerCase()}`;
		await db.transaction(path, (count: StringCounter): Promise<StringCounter> => {
			if (count) {
				count.count += 1
			} else {
				count = { count: 1 , text: hashtag.text.toLowerCase() };
			}
			return Promise.resolve(count);
		});
	}
	return Promise.resolve();
}

export async function countWords(tweet: Tweet): Promise<void> {
	const words = tweet.text.replace(/@\S+/, '').replace(/#\S+/, '');
	for (const word of Stopword.removeStopwords(words.match(/[A-Za-z0-9_]+/g))) {
		const path = `words/${tweet.in_reply_to_status_id_str}/${tweet.in_reply_to_status_id_str}/${word.toLowerCase()}`;
		await db.transaction(path, (count: StringCounter): Promise<StringCounter> => {
			console.log(word);
			if (count) {
				count.count += 1
			} else {
				count = { count: 1 , text: word.toLowerCase() };
			}
			return Promise.resolve(count);
		});
	}
	return Promise.resolve();
}
