import * as db from './db';
import { Hashtag, Tweet } from "./models/twitter/tweet";
import * as sentiment from "./sentiment";
import { StringCounter } from "./models/stringCounter";
import { TweetSentiment } from "./models/sentiment";
const Stopword = require('stopword');
const KeywordExtractor = require('keyword-extractor');

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
	for (const word of extractWords(tweet)) {
		const path = `words/${tweet.in_reply_to_status_id_str}/${tweet.in_reply_to_status_id_str}/${word.toLowerCase()}`;
		await db.transaction(path, (count: StringCounter): Promise<StringCounter> => {
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

export function extractWords(tweet: Tweet): string[] {
	const toRemoveIndices = [];
	if (tweet.entities.hashtags) {
		tweet.entities.hashtags.map(hashtag => toRemoveIndices.push(hashtag['indices']));
	}
	if (tweet.entities.user_mentions) {
		tweet.entities.user_mentions.map(userMention => toRemoveIndices.push(userMention['indices']));
	}
	if (tweet.entities.urls) {
		tweet.entities.urls.map(url => toRemoveIndices.push(url['indices']));
	}
	toRemoveIndices.sort((a: number[], b: number[]) => {
		return b[0] - a[0];
	});
	let text = tweet.text;
	for (const indices of toRemoveIndices) {
		text = text.substring(0, indices[0]) + text.substring(indices[1]);
	}
	return KeywordExtractor.extract(text).filter((word: string) => /^[a-zA-Z]*$/.test(word));
}
