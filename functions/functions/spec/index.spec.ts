import * as sinon from 'sinon';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import * as nock from 'nock';
nock.disableNetConnect();

// Use a fake database.
import * as fakeDb from './fake-db';
fakeDb.init('../src/db');

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
import * as tweetAnalyzer from '../src/tweet-analyzer';
import { Entities, Hashtag, Tweet } from "../src/models/twitter/tweet";
import { getSentiment } from '../src/sentiment';

// Some test input data that we'll use in multiple tests.
const tweet: Tweet = {
    id: 1,
    id_str: '1',
    text: 'I miss you so much #love @trump.',
    in_reply_to_status_id_str: 'original_tweet',
	entities: {
    	hashtags: [
		    { text: 'TEST1' },
		    { text: 'TEST2' }
	    ]
	} as Entities
};
const secondTweet: Tweet = {
    id: 2,
    id_str: '2',
    text: 'Miss you 22.',
    in_reply_to_status_id_str: 'original_tweet',
	entities: {
		hashtags: [
			{ text: 'TEST1' },
		]
	} as Entities
};
const thirdTweet: Tweet = {
	"created_at": "Tue Nov 14 05:26:45 +0000 2017",
	"id": 930305984077156400,
	"id_str": "930305984077156352",
	"text": "Just arrived at #ASEAN50 in the Philippines for my final stop with World Leader's. Will lead to FAIR TRADE DEALS, un… https://t.co/ExRBdQnJru",
	"truncated": true,
	"entities": {
		"hashtags": [
			{
				"text": "ASEAN50",
				"indices": [
					16,
					24
				]
			}
		],
		"symbols": [],
		"user_mentions": [],
		"urls": [
			{
				"url": "https://t.co/ExRBdQnJru",
				"expanded_url": "https://twitter.com/i/web/status/930305984077156352",
				"display_url": "twitter.com/i/web/status/9…",
				"indices": [
					118,
					141
				]
			}
		]
	},
	"source": "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
	"in_reply_to_status_id": null,
	"in_reply_to_status_id_str": 'trump_replying_to_someone',
	"in_reply_to_user_id": null,
	"in_reply_to_user_id_str": null,
	"in_reply_to_screen_name": null,
	"user": {
		"id": 25073877,
		"id_str": "25073877",
		"name": "Donald J. Trump",
		"screen_name": "realDonaldTrump",
		"location": "Washington, DC",
		"description": "45th President of the United States of America🇺🇸",
		"url": "https://t.co/OMxB0x7xC5",
		"entities": {
			"urls": [
				{
					"url": "https://t.co/OMxB0x7xC5",
					"expanded_url": "http://www.Instagram.com/realDonaldTrump",
					"display_url": "Instagram.com/realDonaldTrump",
					"indices": [
						0,
						23
					]
				}
			],
			"description": {
				"urls": []
			}
		},
		"protected": false,
		"followers_count": 42647170,
		"friends_count": 45,
		"listed_count": 79605,
		"created_at": "Wed Mar 18 13:46:38 +0000 2009",
		"favourites_count": 23,
		"utc_offset": -18000,
		"time_zone": "Eastern Time (US & Canada)",
		"geo_enabled": true,
		"verified": true,
		"statuses_count": 36377,
		"lang": "en",
		"contributors_enabled": false,
		"is_translator": false,
		"is_translation_enabled": true,
		"profile_background_color": "6D5C18",
		"profile_background_image_url": "http://pbs.twimg.com/profile_background_images/530021613/trump_scotland__43_of_70_cc.jpg",
		"profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/530021613/trump_scotland__43_of_70_cc.jpg",
		"profile_background_tile": true,
		"profile_image_url": "http://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_normal.jpg",
		"profile_image_url_https": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_normal.jpg",
		"profile_banner_url": "https://pbs.twimg.com/profile_banners/25073877/1510650006",
		"profile_link_color": "1B95E0",
		"profile_sidebar_border_color": "BDDCAD",
		"profile_sidebar_fill_color": "C5CEC0",
		"profile_text_color": "333333",
		"profile_use_background_image": true,
		"has_extended_profile": false,
		"default_profile": false,
		"default_profile_image": false,
		"following": false,
		"follow_request_sent": false,
		"notifications": false,
		"translator_type": "regular"
	},
	"geo": null,
	"coordinates": null,
	"place": {
		"id": "18810aa5b43e76c7",
		"url": "https://api.twitter.com/1.1/geo/id/18810aa5b43e76c7.json",
		"place_type": "city",
		"name": "Dallas",
		"full_name": "Dallas, TX",
		"country_code": "US",
		"country": "United States",
		"contained_within": [],
		"bounding_box": {
			"type": "Polygon",
			"coordinates": [
				[
					[
						-96.977527,
						32.620678
					],
					[
						-96.54598,
						32.620678
					],
					[
						-96.54598,
						33.019039
					],
					[
						-96.977527,
						33.019039
					]
				]
			]
		},
		"attributes": {}
	},
	"contributors": null,
	"is_quote_status": false,
	"retweet_count": 6026,
	"favorite_count": 30354,
	"favorited": false,
	"retweeted": false,
	"lang": "en"
};

describe('twitter-analyzer', () => {
    beforeEach(async () => {
        fakeDb.reset();
    });

    describe('insertTweetSentiment', () => {
        beforeEach(async () => {
            fakeDb.reset();
        });

        it('should initialize the score and count on a new tweet', async () => {
            await tweetAnalyzer.updateSentiment(tweet);
            await expect(fakeDb.get(`sentiment/${tweet.in_reply_to_status_id_str}`)).to.eventually.deep.equal({
                score: 1,
                count: 1,
	            negativeCount: 0,
	            positiveCount: 1,
	            neutralCount: 0
            });
        });
        it('should increment the score and count for existing tweets', async () => {
            await tweetAnalyzer.updateSentiment(tweet);
            await tweetAnalyzer.updateSentiment(secondTweet);
            await expect(fakeDb.get(`sentiment/${tweet.in_reply_to_status_id_str}`)).to.eventually.deep.equal({
                score: 2,
                count: 2,
	            negativeCount: 0,
	            positiveCount: 2,
	            neutralCount: 0
            });
        });
    });

	describe('insertTweetHashtags', () => {
		beforeEach(async () => {
			fakeDb.reset();
		});

		it('should initialize the count on a new tweet for each hashtag', async () => {
			await tweetAnalyzer.countHashtags(tweet);
			await expect(fakeDb.get(`hashtags/${tweet.in_reply_to_status_id_str}/${tweet.in_reply_to_status_id_str}/test1`))
				.to.eventually.deep.equal({count: 1, text: 'test1'});
			await expect(fakeDb.get(`hashtags/${tweet.in_reply_to_status_id_str}/${tweet.in_reply_to_status_id_str}/test2`))
				.to.eventually.deep.equal({count: 1, text: 'test2'});
		});

		it('should update counts on hashtags that already exist', async () => {
			await tweetAnalyzer.countHashtags(tweet);
			await tweetAnalyzer.countHashtags(secondTweet);
			await expect(fakeDb.get(`hashtags/${tweet.in_reply_to_status_id_str}/${tweet.in_reply_to_status_id_str}/test1`))
				.to.eventually.deep.equal({count: 2, text: 'test1'});
			await expect(fakeDb.get(`hashtags/${tweet.in_reply_to_status_id_str}/${tweet.in_reply_to_status_id_str}/test2`))
				.to.eventually.deep.equal({count: 1, text: 'test2'});
		});
	});

	describe('countWords', () => {
		beforeEach(async () => {
			fakeDb.reset();
		});

		it('should count all of the words', async () => {
			await tweetAnalyzer.countWords(thirdTweet);
			const expected = ['arrived', 'philippines', 'final', 'stop', 'world', 'lead', 'fair', 'trade', 'deals'];
			for (const expectedValue of expected) {
				const path = `words/${thirdTweet.in_reply_to_status_id_str}/${thirdTweet.in_reply_to_status_id_str}/${expectedValue}`;
				await expect(fakeDb.get(path))
					.to.eventually.deep.equal({count: 1, text: expectedValue});
			}
		});
	});

	describe('extractWords', () => {
		beforeEach(async () => {
			fakeDb.reset();
		});

		it('should extract only words', async () => {
			const result = tweetAnalyzer.extractWords(thirdTweet).sort();
			await expect(result).to.deep.equal([
				'arrived',
				'philippines',
				'final',
				'stop',
				'world',
				'lead',
				'fair',
				'trade',
				'deals'].sort());
		});
	});
});