import { ParseRssOptions, SelectorMap, parseRssItems } from ".";

export type BookAuthor = {
  name: string;
};
export type GoodreadsBook = {
  title: string;
  description: string;
  cover: string;
  authors?: BookAuthor[];
};
export const READING_STATES: GoodreadsReadingStatus[] = [
  "IS_READING",
  "FINISHED",
  "WANTS_TO_READ",
] as const;
export type GoodreadsReadingStatus =
  | "IS_READING"
  | "FINISHED"
  | "WANTS_TO_READ";

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

const goodreadsDefaultSelectors: Record<keyof GoodreadsRaw, string> = {
  title: "title",
  description: "book_description",
  cover: "book_large_image_url",
  author: "author_name",
  shelves: "user_shelves",
};

function mapShelfToStatus(shelves: string): GoodreadsReadingStatus {
  if (shelves.includes("currently-reading")) return "IS_READING";
  if (shelves.includes("read")) return "FINISHED";
  return "WANTS_TO_READ"; // "to-read" and everything else
}

export function parseGoodreadsRss(
  xml: string,
  options: Omit<ParseRssOptions<GoodreadsRaw>, "selectors"> & {
    selectors?: SelectorMap<GoodreadsRaw>;
  } = {},
): GoodreadsReadingState[] {
  const mergedSelectors: SelectorMap<GoodreadsRaw> = {
    ...goodreadsDefaultSelectors,
    ...(options.selectors ?? {}),
  };

  const rawItems = parseRssItems<GoodreadsRaw>(xml, {
    ...options,
    selectors: mergedSelectors,
  });

  return rawItems.map(
    (raw): GoodreadsReadingState => ({
      status: mapShelfToStatus(raw.shelves),
      book: {
        title: raw.title,
        description: raw.description,
        cover: raw.cover,
        authors: raw.author ? [{ name: raw.author }] : [],
      },
    }),
  );
}
