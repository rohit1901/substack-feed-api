export type RawFeed = {
  rss: {
    channel: RawFeedChannel[];
    [key: string]: unknown;
  };
};

export interface RawFeedChannel {
  title: string[];
  description: string[];
  link: string[];
  image: RawImage[];
  generator: string[];
  lastBuildDate: string[];
  "atom:link": AtomLink[];
  copyright: string[];
  language: string[];
  webMaster: string[];
  "itunes:owner": ItunesOwner[];
  "itunes:author": string[];
  "googleplay:owner": string[];
  "googleplay:email": string[];
  "googleplay:author": string[];
  item: RawItem[];
}

export interface RawImage {
  url: string[];
  title: string[];
  link: string[];
}

export interface AtomLink {
  $: GeneratedType;
}

export interface GeneratedType {
  href: string;
  rel: string;
  type: string;
}

export interface ItunesOwner {
  "itunes:email": string[];
  "itunes:name": string[];
}

export interface RawItem {
  title: string[];
  description: string[];
  link: string[];
  guid: Guid[];
  "dc:creator": string[];
  pubDate: string[];
  enclosure: Enclosure[];
  "content:encoded": string[];
}

export interface Guid {
  _: string;
  $: GeneratedType2;
}

export interface GeneratedType2 {
  isPermaLink: string;
}

export interface Enclosure {
  $: GeneratedType3;
}

export interface GeneratedType3 {
  url: string;
  length: string;
  type: string;
}

export type SubstackItem = {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  content: string;
};

export function getSubstackFeed(
  feedUrl: string,
  proxy?: boolean,
  callback?: (err: Error | null, result: unknown) => void,
): Promise<string | undefined>;
export function getFeedByLink(rawFeed: unknown, link: string): RawFeedChannel[];
export function getPosts(channels: RawFeedChannel[]): SubstackItem[];

// Goodreads RSS Feed Parser

// Goodreads Public Types
export interface GoodreadsItem {
  title: string[];
  link: string[];
  book_image_url: string[];
  author_name: string[];
  book_description: string[];
  [key: string]: unknown;
}

// Goodreads Public API
export const getGoodreadsFeed: (
  feedUrl: string,
  callback?: (err: Error | null, result: unknown) => void,
) => Promise<unknown>;
export const getGoodreadsFeedItems: (rawFeed: unknown) => GoodreadsItem[];
