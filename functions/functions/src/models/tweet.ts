import { User } from './user';

export interface Entities {
  hashtags: any[];
  symbols: any[];
  urls: any[];
  user_mentions: any[];
}

export interface Tweet {
    contributors?: any;
    coordinates?: any;
    created_at?: string;
    entities?: Entities;
    favorite_count?: number;
    favorited?: boolean;
    filter_level?: string;
    geo?: any;
    id: number;
    id_str: string;
    in_reply_to_screen_name?: any;
    in_reply_to_status_id?: any;
    in_reply_to_status_id_str?: string;
    in_reply_to_user_id?: any;
    in_reply_to_user_id_str?: string;
    is_quote_status?: boolean;
    lang?: string;
    place?: any;
    quote_count?: number;
    reply_count?: number;
    retweet_count?: number;
    retweeted?: boolean;
    source?: string;
    text?: string;
    timestamp_ms?: string;
    truncated?: boolean;
    user?: User;
}
