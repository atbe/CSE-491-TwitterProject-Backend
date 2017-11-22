import { TweetSentiment } from './models/sentiment';
import * as db from './db';
import { Hashtag, Tweet } from "./models/twitter/tweet";
import * as sentiment from "./sentiment";

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
		const path = `${tweet.in_reply_to_status_id_str}`;
		await db.fieldTransaction('hashtags', path, hashtag.text, (count: number): Promise<number> => {
			if (count) {
				count += 1;
			} else {
				count = 1;
			}
			return Promise.resolve(count);
		});
	}
	return Promise.resolve();
}
