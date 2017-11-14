import * as sinon from 'sinon';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import * as nock from 'nock';
nock.disableNetConnect();

// Use a fake database.
import * as fakeDb from './fake-db';
fakeDb.init('../db');

// Use a fake Language API.
import * as fakeLanguage from './fake-language';
fakeLanguage.init();

// Use a fake Firebase configuration.
import * as fakeconfig from './fake-config';
fakeconfig.init();

// Use a fake Firebase configuration.
import * as fakeSentiment from './fake-sentiment';
fakeSentiment.init();

// Use a fake Firebase Admin.
import * as fakeadmin from './fake-admin';
fakeadmin.init();

// Ready to go!
import * as tweetAnalyzer from '../tweet-analyzer';
import {Tweet} from "../models/tweet";

// Some test input data that we'll use in multiple tests.
const tweet: Tweet = {
    id: 1,
    id_str: '1',
    text: 'I miss you so much.',
    in_reply_to_status_id_str: 'original_tweet'
};
const secondTweet: Tweet = {
    id: 2,
    id_str: '2',
    text: 'Miss you 22.',
    in_reply_to_status_id_str: 'original_tweet'
};

describe('twitter-analyzer', () => {
    beforeEach(async () => {
        fakeDb.reset();
    });

    describe('insertTweet', () => {
        beforeEach(async () => {
            fakeDb.reset();
        });

        it('should initialize the score and count on a new tweet', async () => {
            await tweetAnalyzer.updateSentiment(tweet);
            await expect(fakeDb.get(`sentiment/${tweet.in_reply_to_status_id_str}`)).to.eventually.deep.equal({
                score: 1,
                count: 1
            });
        });
        it('should increment the score and count for existing tweets', async () => {
            await tweetAnalyzer.updateSentiment(tweet);
            await tweetAnalyzer.updateSentiment(secondTweet);
            await expect(fakeDb.get(`sentiment/${tweet.in_reply_to_status_id_str}`)).to.eventually.deep.equal({
                score: 2,
                count: 2
            });
        });
    });
});