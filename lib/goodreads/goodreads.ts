// TODO: to be moved to a separate package
import * as parser from "xml2js";
import {
  isRawGoodreadsFeed,
  isRawGoodreadsFeedChannel,
  isRawGoodreadsFeedRSS,
  isRawGoodreadsItem,
  isValidClientSideFeed,
} from "./typeguards";
import { GoodreadsItem, RawGoodreadsItem } from "./types";

const CORS_PROXY = "https://api.allorigins.win/get?url=";
const isBrowser = typeof document !== "undefined";

// Utils
const transformRawGoodreadsItem = (item: RawGoodreadsItem): GoodreadsItem => {
  return {
    title: item.title[0],
    link: item.link[0],
    book_image_url: item["book_image_url"][0],
    author_name: item["author_name"][0],
    book_description: item["book_description"][0],
  };
};

const parseXML = async (
  xml = "",
  /* eslint-disable @typescript-eslint/no-explicit-any */
  callback?: (err: Error | null, result: any) => void,
) => {
  if (!callback) return parser.parseStringPromise(xml);
  parser.parseString(xml, callback);
};

// Internal API

const getRawXMLGoodreadsFeed = async (feedUrl: string) => {
  try {
    const path = isBrowser
      ? `${CORS_PROXY}${encodeURIComponent(feedUrl)}`
      : feedUrl;
    const promise = await fetch(path);
    if (promise.ok) return isBrowser ? promise.json() : promise.text();
  } catch (e) {
    throw new Error("Error occurred fetching Feed from Goodreads");
  }
};

// Goodreads Public API
export const getGoodreadsFeed = async (
  feedUrl: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  callback?: (err: Error | null, result: unknown) => void,
): Promise<unknown> => {
  const rawXML = await getRawXMLGoodreadsFeed(feedUrl);
  // NOTE: server side call
  if (!isBrowser) {
    return parseXML(rawXML, callback);
  }
  // NOTE: client side call
  if (!isValidClientSideFeed(rawXML))
    throw new Error("Error occurred fetching Feed from Substack");
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
