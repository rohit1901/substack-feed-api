import * as parser from "xml2js";
import { RawFeedChannel, RawItem, SubstackItem } from "./types";
import { isRawFeed, isRawFeedChannel } from "./typeguards";

const CORS_PROXY = "https://corsproxy.io/?";
const isBrowser = typeof document !== 'undefined';

// Internal API
const getRawXMLSubstackFeed = async (feedUrl: string) => {
  try {
    const uri = isBrowser ? `${CORS_PROXY}${encodeURIComponent(feedUrl)}` : feedUrl;
    const promise = await fetch(uri);
    if (promise.ok) return promise.text();
  } catch (e) {
    throw new Error("Error occurred fetching Feed from Substack");
  }
};
const parseXML = async (
  xml = "",
  /* eslint-disable @typescript-eslint/no-explicit-any */
  callback: (err: Error | null, result: any) => void,
) => {
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
  callback: (err: Error | null, result: any) => void,
): Promise<void> => {
  const rawXML = await getRawXMLSubstackFeed(feedUrl);
  await parseXML(rawXML, callback);
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
