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

// Goodreads Feed Types
// TODO: to be moved to a separate package

export type RawGoodreadsFeed = {
  rss: RawGoodreadsFeedRSS;
};

export type RawGoodreadsFeedRSS = {
  channel: RawGoodreadsFeedChannel[];
  [key: string]: unknown;
};

export type RawGoodreadsFeedChannel = {
  title: string[];
  item: RawGoodreadsItem[];
  [key: string]: unknown;
};

export type RawGoodreadsItem = {
  title: string[];
  link: string[];
  book_image_url: string[];
  book_large_image_url: string[];
  author_name: string[];
  book_description: string[];
  [key: string]: unknown;
};

export type GoodreadsFeedChannel = {
  title: string;
  item: GoodreadsItem[];
  [key: string]: unknown;
};

export type GoodreadsItem = {
  title: string;
  link: string;
  book_image_url: string;
  author_name: string;
  book_description: string;
  [key: string]: unknown;
};
