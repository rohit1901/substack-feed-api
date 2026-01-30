// Goodreads Feed Typeguards
// TODO: to be moved to a separate package
import {
  RawGoodreadsFeed,
  RawGoodreadsFeedChannel,
  RawGoodreadsFeedRSS,
  RawGoodreadsItem,
} from "./types";

export const isRawGoodreadsFeed = (data: unknown): data is RawGoodreadsFeed => {
  return (
    data !== null && typeof data === "object" && data.hasOwnProperty("rss")
  );
};

export const isRawGoodreadsFeedRSS = (
  data: unknown,
): data is RawGoodreadsFeedRSS => {
  return (
    typeof data === "object" && data !== null && data.hasOwnProperty("channel")
  );
};

export const isRawGoodreadsFeedChannel = (
  channel: unknown,
): channel is RawGoodreadsFeedChannel => {
  return (
    typeof channel === "object" &&
    channel !== null &&
    channel.hasOwnProperty("title") &&
    channel.hasOwnProperty("item")
  );
};
export const isRawGoodreadsItem = (item: unknown): item is RawGoodreadsItem => {
  return (
    typeof item === "object" &&
    item !== null &&
    item.hasOwnProperty("title") &&
    item.hasOwnProperty("link") &&
    item.hasOwnProperty("book_image_url") &&
    item.hasOwnProperty("author_name") &&
    item.hasOwnProperty("book_description")
  );
};

export const isValidClientSideFeed = (data: unknown): boolean => {
  return (
    typeof data === "object" &&
    data !== null &&
    data.hasOwnProperty("rss") &&
    data.hasOwnProperty("status")
  );
};
