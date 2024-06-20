/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AtomLink,
  Enclosure,
  Guid,
  ItunesOwner,
  RawFeed,
  RawFeedChannel,
  RawImage,
  RawItem,
} from "./types";

export const isRawFeed = (data: any): data is RawFeed => {
  return (
    data !== null &&
    typeof data === "object" &&
    data.hasOwnProperty("rss") &&
    typeof data.rss === "object" &&
    data.rss !== null &&
    data.rss.hasOwnProperty("channel") &&
    Array.isArray(data.rss.channel)
  );
};

export const isRawFeedChannel = (data: any): data is RawFeedChannel => {
  return (
    typeof data === "object" &&
    data !== null &&
    data.hasOwnProperty("title") &&
    Array.isArray(data.title) &&
    data.hasOwnProperty("description") &&
    Array.isArray(data.description) &&
    data.hasOwnProperty("link") &&
    Array.isArray(data.link) &&
    data.hasOwnProperty("image") &&
    Array.isArray(data.image) &&
    data.image.every(isRawImage) &&
    data.hasOwnProperty("generator") &&
    Array.isArray(data.generator) &&
    data.hasOwnProperty("lastBuildDate") &&
    Array.isArray(data.lastBuildDate) &&
    data.hasOwnProperty("atom:link") &&
    Array.isArray(data["atom:link"]) &&
    data["atom:link"].every(isAtomLink) &&
    data.hasOwnProperty("copyright") &&
    Array.isArray(data.copyright) &&
    data.hasOwnProperty("language") &&
    Array.isArray(data.language) &&
    data.hasOwnProperty("webMaster") &&
    Array.isArray(data.webMaster) &&
    data.hasOwnProperty("itunes:owner") &&
    Array.isArray(data["itunes:owner"]) &&
    data["itunes:owner"].every(isItunesOwner) &&
    data.hasOwnProperty("itunes:author") &&
    Array.isArray(data["itunes:author"]) &&
    data.hasOwnProperty("googleplay:owner") &&
    Array.isArray(data["googleplay:owner"]) &&
    data.hasOwnProperty("googleplay:email") &&
    Array.isArray(data["googleplay:email"]) &&
    data.hasOwnProperty("googleplay:author") &&
    Array.isArray(data["googleplay:author"]) &&
    data.hasOwnProperty("item") &&
    Array.isArray(data.item) &&
    data.item.every(isRawItem)
  );
};

export const isRawImage = (data: any): data is RawImage => {
  return (
    typeof data === "object" &&
    data !== null &&
    data.hasOwnProperty("url") &&
    Array.isArray(data.url) &&
    data.hasOwnProperty("title") &&
    Array.isArray(data.title) &&
    data.hasOwnProperty("link") &&
    Array.isArray(data.link)
  );
};

export const isAtomLink = (data: any): data is AtomLink => {
  return (
    typeof data === "object" &&
    data !== null &&
    data.hasOwnProperty("$") &&
    typeof data.$ === "object" &&
    data.$ !== null &&
    data.$.hasOwnProperty("href") &&
    typeof data.$.href === "string" &&
    data.$.hasOwnProperty("rel") &&
    typeof data.$.rel === "string" &&
    data.$.hasOwnProperty("type") &&
    typeof data.$.type === "string"
  );
};

export const isItunesOwner = (data: any): data is ItunesOwner => {
  return (
    typeof data === "object" &&
    data !== null &&
    data.hasOwnProperty("itunes:email") &&
    Array.isArray(data["itunes:email"]) &&
    data.hasOwnProperty("itunes:name") &&
    Array.isArray(data["itunes:name"])
  );
};

export const isRawItem = (data: any): data is RawItem => {
  return (
    typeof data === "object" &&
    data !== null &&
    data.hasOwnProperty("title") &&
    Array.isArray(data.title) &&
    data.hasOwnProperty("description") &&
    Array.isArray(data.description) &&
    data.hasOwnProperty("link") &&
    Array.isArray(data.link) &&
    data.hasOwnProperty("guid") &&
    Array.isArray(data.guid) &&
    data.guid.every(isGuid) &&
    data.hasOwnProperty("dc:creator") &&
    Array.isArray(data["dc:creator"]) &&
    data.hasOwnProperty("pubDate") &&
    Array.isArray(data.pubDate) &&
    data.hasOwnProperty("enclosure") &&
    Array.isArray(data.enclosure) &&
    data.enclosure.every(isEnclosure) &&
    data.hasOwnProperty("content:encoded") &&
    Array.isArray(data["content:encoded"])
  );
};

export const isGuid = (data: any): data is Guid => {
  return (
    typeof data === "object" &&
    data !== null &&
    data.hasOwnProperty("_") &&
    typeof data._ === "string" &&
    data.hasOwnProperty("$") &&
    typeof data.$ === "object" &&
    data.$ !== null &&
    data.$.hasOwnProperty("isPermaLink") &&
    typeof data.$.isPermaLink === "string"
  );
};

export const isEnclosure = (data: any): data is Enclosure => {
  return (
    typeof data === "object" &&
    data !== null &&
    data.hasOwnProperty("$") &&
    typeof data.$ === "object" &&
    data.$ !== null &&
    data.$.hasOwnProperty("url") &&
    typeof data.$.url === "string" &&
    data.$.hasOwnProperty("length") &&
    typeof data.$.length === "string" &&
    data.$.hasOwnProperty("type") &&
    typeof data.$.type === "string"
  );
};
