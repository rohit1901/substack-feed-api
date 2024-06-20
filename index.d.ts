export type RawFeed = {
  rss: {
    channel: RawFeedChannel[];
    [key: string]: any;
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

export function isRawFeed(
  feed: any,
): feed is { rss: { channel: RawFeedChannel[] } };
export function isRawFeedChannel(channel: any): channel is RawFeedChannel;

export const CORS_PROXY: string;

export function getRawXMLSubstackFeed(feedUrl: string): Promise<string>;
export function parseXML(
  xml?: string,
  callback?: (err: Error | null, result: any) => void,
): Promise<void>;
export function transformRawItem(item: RawItem): SubstackItem;

export function getSubstackFeed(
  feedUrl: string,
  callback: (err: Error | null, result: any) => void,
): Promise<void>;
export function getFeedByLink(rawFeed: any, link: string): RawFeedChannel[];
export function getPosts(channels: RawFeedChannel[]): SubstackItem[];
