import { User } from './user';

export interface Hashtag {
	text: string;
	indices: number[];
}

export interface Url {
	url: string;
	expanded_url: string;
	display_url: string;
	indices: number[];
}

export interface Entities {
	hashtags: Hashtag[];
	symbols: any[];
	user_mentions: any[];
	urls: Url[];
}

export interface BoundingBox {
	type: string;
	coordinates: number[][][];
}

export interface Place {
	id: string;
	url: string;
	place_type: string;
	name: string;
	full_name: string;
	country_code: string;
	country: string;
	contained_within: any[];
	bounding_box: BoundingBox;
	attributes: any;
}

export interface Tweet {
	created_at?: string;
	id: number;
	id_str: string;
	text?: string;
	truncated?: boolean;
	entities?: Entities;
	source?: string;
	in_reply_to_status_id?: any;
	in_reply_to_status_id_str?: any;
	in_reply_to_user_id?: any;
	in_reply_to_user_id_str?: any;
	in_reply_to_screen_name?: any;
	user?: User;
	geo?: any;
	coordinates?: any;
	place?: Place;
	contributors?: any;
	is_quote_status?: boolean;
	retweet_count?: number;
	favorite_count?: number;
	favorited?: boolean;
	retweeted?: boolean;
	lang?: string;
}

