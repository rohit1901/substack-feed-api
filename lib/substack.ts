import { SubstackItem } from "substack-feed-api";
import { ParseRssOptions, SelectorMap, parseRssItems } from ".";

const substackDefaultSelectors: Record<keyof SubstackItem, string> = {
  title: "title",
  description: "description",
  link: "link",
  pubDate: "pubDate",
  content: "content\\:encoded",
};

export function parseSubstackRss(
  xml: string,
  options: Omit<ParseRssOptions<SubstackItem>, "selectors"> & {
    selectors?: SelectorMap<SubstackItem>;
  } = {},
): SubstackItem[] {
  const mergedSelectors: SelectorMap<SubstackItem> = {
    ...substackDefaultSelectors,
    ...(options.selectors ?? {}),
  };

  return parseRssItems<SubstackItem>(xml, {
    ...options,
    selectors: mergedSelectors,
  });
}
