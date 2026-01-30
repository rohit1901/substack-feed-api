`rss-feed-parser` is a small TypeScript utility for turning RSS XML into typed objects using Cheerio, with first-class support for Substack and Goodreads feeds. 

## Features

- **Type-safe** mapping from RSS XML to your own TypeScript types via generic selector maps. 
- Built-in helpers for Substack posts and Goodreads bookshelf RSS feeds (including shelves / reading status). 
- Uses Cheerio in XML mode, works well with namespaced tags like `content:encoded`. 
- Graceful error handling with configurable fallbacks and silent logging.  

***

## Installation

```bash
npm install rss-feed-parser cheerio
# or
yarn add rss-feed-parser cheerio
# or
pnpm add rss-feed-parser cheerio
```

Cheerio is a peer dependency because the library uses it under the hood to traverse RSS XML. 

***

## Quick start

### Parsing Substack RSS

Substack exposes a standard RSS 2.0 feed with a `<channel>` and multiple `<item>` entries; each item contains fields like `<title>`, `<description>`, `<link>`, `<pubDate>`, and `<content:encoded>` for the HTML body. 

```ts
import { parseSubstackRss, SubstackItem } from 'rss-feed-parser';

const xml = await fetch('https://example.substack.com/feed').then(r => r.text());

const posts: SubstackItem[] = parseSubstackRss(xml);

// Example item
// {
//   title: 'Both Not Half by Jassa Ahluwalia',
//   description: 'A Humorous Journey Through Identity, Yet Lacking Cohesion',
//   link: 'https://…',
//   pubDate: 'Sun, 06 Oct 2024 15:35:17 GMT',
//   content: '<p>Jassa Ahluwalia\'s <strong>Both Not Half</strong>…'
// }
```

You can override any selector if your feed schema differs:

```ts
const postsCustom = parseSubstackRss(xml, {
  selectors: {
    // use <description> as content
    content: 'description',
  },
});
```

***

### Parsing Goodreads bookshelf RSS

Goodreads’ “bookshelf” RSS feed exposes many book-related tags per `<item>` (e.g. `<title>`, `<book_description>`, `<book_large_image_url>`, `<author_name>`, `<user_shelves>`). 

The library exposes a Goodreads-specific helper that returns a higher-level `GoodreadsReadingState`:

```ts
import {
  parseGoodreadsRss,
  GoodreadsReadingState,
} from 'rss-feed-parser';

const xml = await fetch('<goodreads-list-rss-url>').then(r => r.text());

const states: GoodreadsReadingState[] = parseGoodreadsRss(xml);

// Example shape:
// {
//   status: 'WANTS_TO_READ' | 'IS_READING' | 'FINISHED',
//   book: {
//     title: 'Malice (Detective Kaga, #1)',
//     description: 'Acclaimed bestselling novelist Kunihiko Hidaka is found brutally murdered…',
//     cover: 'https://i.gr-assets.com/.../20613611._SY475_.jpg',
//     authors: [{ name: 'Keigo Higashino' }]
//   }
// }
```

By default, the Goodreads parser derives status from `user_shelves` (e.g. `to-read`, `currently-reading`, `read`). 

You can still adjust selectors if Goodreads ever changes tag names:

```ts
const customStates = parseGoodreadsRss(xml, {
  selectors: {
    // Example: use medium image instead of large
    cover: 'book_medium_image_url',
  },
});
```

***

## API

### `parseRssItems` – generic core

```ts
function parseRssItems<TRaw extends Record<string, string>>(
  xml: string,
  options?: {
    itemSelector?: string;
    selectors?: Partial<Record<keyof TRaw, string>>;
    fallback?: TRaw[];
  }
): TRaw[];
```

- `xml`: full RSS XML string.  
- `itemSelector`: CSS selector for each RSS item node, default `'channel > item'`.  
- `selectors`: map from property name → CSS selector **relative to each item node**.  
- `fallback`: array to return if parsing fails (e.g. malformed XML); error is logged to `console.error` but not thrown.  

Example: minimal generic usage:

```ts
type MinimalItem = {
  title: string;
  link: string;
};

const items = parseRssItems<MinimalItem>(xml, {
  selectors: {
    title: 'title',
    link: 'link',
  },
});
```

### `parseSubstackRss`

```ts
type SubstackItem = {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  content: string;
};

function parseSubstackRss(
  xml: string,
  options?: {
    itemSelector?: string;
    selectors?: Partial<Record<keyof SubstackItem, string>>;
    fallback?: SubstackItem[];
  }
): SubstackItem[];
```

Default selectors (overridable):

```ts
{
  title: 'title',
  description: 'description',
  link: 'link',
  pubDate: 'pubDate',
  content: 'content\\:encoded',
}
```

This matches typical Substack feeds which use `content:encoded` for the full HTML article body. 

### `parseGoodreadsRss`

```ts
type BookAuthor = { name: string };

type GoodreadsBook = {
  title: string;
  description: string;
  cover: string;
  authors?: BookAuthor[];
};

type GoodreadsReadingStatus = 'IS_READING' | 'FINISHED' | 'WANTS_TO_READ';

type GoodreadsReadingState = {
  book: GoodreadsBook;
  status: GoodreadsReadingStatus;
};

function parseGoodreadsRss(
  xml: string,
  options?: {
    itemSelector?: string;
    selectors?: Partial<{
      title: string;
      description: string;
      cover: string;
      author: string;
      shelves: string;
    }>;
    fallback?: GoodreadsReadingState[]; // via raw fallback mapping
  }
): GoodreadsReadingState[];
```

Default Goodreads selectors map RSS tags to an internal flat type:

```ts
{
  title: 'title',
  description: 'book_description',
  cover: 'book_large_image_url',
  author: 'author_name',
  shelves: 'user_shelves',
}
```

The parser then:

- Builds a flat raw record from each `<item>`.  
- Maps `shelves` to a `GoodreadsReadingStatus` (e.g. `currently-reading` → `IS_READING`, `read` → `FINISHED`, otherwise `WANTS_TO_READ`). 
- Wraps book information into `GoodreadsBook` and `BookAuthor`.  

***

## Error handling

All parsing functions follow the same pattern:

- Wrap parsing and traversal in a `try/catch`.  
- On error, log a concise entry to `console.error` with context (selectors, item selector).  
- Return the provided `fallback` (default `[]`) instead of throwing.  

Example:

```ts
const items = parseSubstackRss('<invalid-xml>', {
  fallback: [],
}); // returns [], logs an error, does not crash your app
```

This makes the library safe to use in background jobs, CLI tools, or edge handlers where a single bad feed should not bring down the entire process. 

***

## Extending for other feeds

To support another RSS feed type, you generally:

1. Define a flat `TRaw` type that contains only string fields.  
2. Call `parseRssItems<TRaw>` with a selector map that matches the feed’s tags.  
3. Map `TRaw` to your domain model in a small wrapper, similar to `parseGoodreadsRss`.  

Example skeleton:

```ts
type MyFeedRaw = {
  title: string;
  summary: string;
  link: string;
};

type MyFeedItem = {
  title: string;
  summary: string;
  url: string;
};

function parseMyFeed(xml: string): MyFeedItem[] {
  const raw = parseRssItems<MyFeedRaw>(xml, {
    selectors: {
      title: 'title',
      summary: 'summary',
      link: 'link',
    },
  });

  return raw.map(r => ({
    title: r.title,
    summary: r.summary,
    url: r.link,
  }));
}
