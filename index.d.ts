export type SelectorMap<TRaw extends Record<string, string>> = Partial<
  Record<keyof TRaw, string>
>;

export type ParseRssOptions<TRaw extends Record<string, string>> = {
  itemSelector?: string;
  selectors?: SelectorMap<TRaw>;
  fallback?: TRaw[];
};

export function parseRssItems<TRaw extends Record<string, string>>(
  xml: string,
  options?: ParseRssOptions<TRaw>,
): TRaw[];

export type SubstackItem = {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  content: string;
};

export function parseSubstackRss(
  xml: string,
  options?: Omit<ParseRssOptions<SubstackItem>, "selectors"> & {
    selectors?: SelectorMap<SubstackItem>;
  },
): SubstackItem[];

export type BookAuthor = {
  name: string;
};

export type GoodreadsBook = {
  title: string;
  description: string;
  cover: string;
  authors?: BookAuthor[];
};

export type GoodreadsReadingStatus =
  | "IS_READING"
  | "FINISHED"
  | "WANTS_TO_READ";

export const READING_STATES: readonly [
  "IS_READING",
  "FINISHED",
  "WANTS_TO_READ",
];

export type GoodreadsReadingState = {
  book: GoodreadsBook;
  status: GoodreadsReadingStatus;
};

export type GoodreadsRaw = {
  title: string;
  description: string;
  cover: string;
  author: string;
  shelves: string;
};

export function parseGoodreadsRss(
  xml: string,
  options?: Omit<ParseRssOptions<GoodreadsRaw>, "selectors"> & {
    selectors?: SelectorMap<GoodreadsRaw>;
  },
): GoodreadsReadingState[];
