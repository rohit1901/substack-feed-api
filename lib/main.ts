import * as parser from "xml2js";
import {
  isRawFeed,
  isRawFeedChannel,
  isRawGoodreadsFeed,
  isRawGoodreadsFeedChannel,
  isRawGoodreadsFeedRSS,
  isRawGoodreadsItem,
  isValidClientSideFeed,
  isValidGoodreadsClientSideFeed,
} from "./typeguards";
import {
  GoodreadsItem,
  RawFeedChannel,
  RawGoodreadsItem,
  RawItem,
  SubstackItem,
} from "./types";

const CORS_PROXY = "https://www.whateverorigin.org/get?url=";
const isBrowser = typeof document !== "undefined";

// Internal API

const getRawXMLSubstackFeed = async (feedUrl: string) => {
  try {
    const path = isBrowser
      ? `${CORS_PROXY}${encodeURIComponent(feedUrl)}`
      : feedUrl;
    const promise = await fetch(path);
    if (promise.ok) return isBrowser ? promise.json() : promise.text();
  } catch (e) {
    throw new Error("Error occurred fetching Feed from Substack");
  }
};
const parseXML = async (
  xml = "",
  /* eslint-disable @typescript-eslint/no-explicit-any */
  callback?: (err: Error | null, result: any) => void,
) => {
  if (!callback) return parser.parseStringPromise(xml);
  parser.parseString(xml, callback);
};
// Utils
const transformRawItem = (item: RawItem): SubstackItem => {
  return {
    title: item.title[0],
    description: item.description[0],
    link: item.link[0],
    pubDate: item.pubDate[0],
    content: item["content:encoded"][0],
  };
};

// Substack Public API

export const getSubstackFeed = async (
  feedUrl: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  callback?: (err: Error | null, result: unknown) => void,
): Promise<unknown> => {
  const rawXML = await getRawXMLSubstackFeed(feedUrl);
  // NOTE: server side call
  if (!isBrowser) {
    return parseXML(rawXML, callback);
  }
  // NOTE: client side call
  if (!isValidClientSideFeed(rawXML))
    throw new Error("Error occurred fetching Feed from Substack");
  await parseXML(rawXML.contents, callback);
};
export const getFeedByLink = (
  rawFeed: unknown,
  link: string,
): RawFeedChannel[] => {
  if (!isRawFeed(rawFeed)) throw new Error("Feed is not in the correct format");
  try {
    return rawFeed.rss.channel
      .filter(isRawFeedChannel)
      .filter((channel) => channel.link[0] === link);
  } catch (e) {
    throw new Error(`Error occurred fetching Feed by Link: ${link}`);
  }
};
export const getPosts = (channels: RawFeedChannel[]) => {
  const channel = channels[0];
  return channel.item.map(transformRawItem);
};

// Goodreads Feed Parser
// Utils
const transformRawGoodreadsItem = (item: RawGoodreadsItem): GoodreadsItem => {
  if (!isRawGoodreadsItem(item))
    throw new Error("Goodreads item is not in the correct format");
  return {
    title: item.title[0],
    link: item.link[0],
    book_image_url: item["book_large_image_url"][0],
    author_name: item["author_name"][0],
    book_description: item["book_description"][0],
  };
};
// Internal API
const getRawXMLGoodreadsFeed = async (feedUrl: string, proxy?: string) => {
  try {
    const path = isBrowser
      ? `${proxy ?? CORS_PROXY}${encodeURIComponent(feedUrl)}`
      : feedUrl;
    const promise = await fetch(path);
    if (promise.ok) return isBrowser ? promise.json() : promise.text();
  } catch (e) {
    throw new Error("Error occurred fetching Feed from Goodreads");
  }
};

// Public API
export const getGoodreadsFeed = async (
  feedUrl: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  callback?: (err: Error | null, result: unknown) => void,
  proxy?: string,
): Promise<unknown> => {
  const rawXML = await getRawXMLGoodreadsFeed(feedUrl, proxy);
  // NOTE: server side call
  if (!isBrowser) {
    return parseXML(rawXML, callback);
  }
  // NOTE: client side call
  if (!isValidGoodreadsClientSideFeed(rawXML))
    throw new Error("Error occurred fetching Feed from Goodreads");
  await parseXML(rawXML.contents, callback);
};
export const getGoodreadsFeedItems = (rawFeed: unknown): GoodreadsItem[] => {
  if (!isRawGoodreadsFeed(rawFeed))
    throw new Error("Goodreads feed is not in the correct format");
  if (!isRawGoodreadsFeedRSS(rawFeed.rss))
    throw new Error("Goodreads RSS feed is not in the correct format");
  const channels = rawFeed.rss.channel.filter(isRawGoodreadsFeedChannel);
  if (channels.length === 0)
    throw new Error("Goodreads feed does not contain any channels");
  const channel = channels[0];
  if (!Array.isArray(channel.item)) return [];
  return channel.item.filter(isRawGoodreadsItem).map(transformRawGoodreadsItem);
};
