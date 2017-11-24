import { TweetSentiment } from './models/sentiment';
import * as db from './db';
import { Hashtag, Tweet } from "./models/twitter/tweet";
import * as sentiment from "./sentiment";
import { HashtagCounter } from './models/hashtagCounter';

export async function updateSentiment(tweet: Tweet): Promise<void> {
    const replySentiment = await sentiment.getSentiment({
        content: tweet.text as string,
        type: 'PLAIN_TEXT'
    });

    const path = `sentiment/${tweet.in_reply_to_status_id_str}`;
    return db.transaction(path,async (tweetSentiment: TweetSentiment | null): Promise<TweetSentiment> => {
        if (tweetSentiment) {
            tweetSentiment.score += replySentiment.score;
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
                score: replySentiment.score
            };
        }
        return Promise.resolve(tweetSentiment);
    });
}

export async function countHashtags(tweet: Tweet): Promise<void> {
	for (const hashtag of tweet.entities.hashtags) {
		const path = `hashtags/${tweet.in_reply_to_status_id_str}/${tweet.in_reply_to_status_id_str}/${hashtag.text.toLowerCase()}`;
		await db.transaction(path, (count: HashtagCounter): Promise<HashtagCounter> => {
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
