import { TweetSentiment } from './models/tweet-sentiment';
import * as db from './db';
import {Tweet} from "./models/tweet";
import * as sentiment from "./sentiment";
import * as firebase from "firebase";
import DocumentReference = firebase.firestore.DocumentReference;
import Transaction = firebase.firestore.Transaction;

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
        } else {
            tweetSentiment = {
                count: 1,
                score: replySentiment.score
            };
        }
        return Promise.resolve(tweetSentiment);
    });
}
