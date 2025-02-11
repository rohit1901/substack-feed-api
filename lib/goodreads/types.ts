// Goodreads Feed Types
// TODO: to be moved to a separate package
//
export type RawGoodreadsFeed = {
  rss: RawGoodreadsFeedRSS;
};

export type RawGoodreadsFeedRSS = {
  channel: RawGoodreadsFeedChannel[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: unknown;
};

export type RawGoodreadsFeedChannel = {
  title: string[];
  item: RawGoodreadsItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: unknown;
};

export type RawGoodreadsItem = {
  title: string[];
  link: string[];
  book_image_url: string[];
  author_name: string[];
  book_description: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: unknown;
};

export type GoodreadsFeedChannel = {
  title: string;
  item: GoodreadsItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: unknown;
};

export type GoodreadsItem = {
  title: string;
  link: string;
  book_image_url: string;
  author_name: string;
  book_description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: unknown;
};
