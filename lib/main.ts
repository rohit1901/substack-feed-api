import * as parser from "xml2js";
import { isRawFeed, isRawFeedChannel, isValidSubstackFeed } from "./typeguards";
import { RawFeedChannel, RawItem, SubstackItem } from "./types";

const CORS_PROXY = "https://api.allorigins.win/get?url=";
const isBrowser = typeof document !== "undefined";

// Internal API

const getRawXMLSubstackFeed = async (feedUrl: string) => {
  try {
    const path = isBrowser
      ? `${CORS_PROXY}${encodeURIComponent(feedUrl)}`
      : feedUrl;
    const promise = await fetch(path);
    console.log(`isBrowser - ${isBrowser}, path - ${path}`);
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

// Public API

export const getSubstackFeed = async (
  feedUrl: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  callback?: (err: Error | null, result: unknown) => void,
): Promise<unknown> => {
  const rawXML = await getRawXMLSubstackFeed(feedUrl);
  console.log(`rawXML - ${rawXML}`);
  // NOTE: server side call
  if (!isBrowser) {
    return parseXML(rawXML, callback);
  }
  // NOTE: client side call
  if (!isValidSubstackFeed(rawXML))
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
