import { load } from "cheerio";

// Generic selector map keyed by the raw record keys
export type SelectorMap<TRaw extends Record<string, string>> = Partial<
  Record<keyof TRaw, string>
>;

export type ParseRssOptions<TRaw extends Record<string, string>> = {
  itemSelector?: string;
  selectors?: SelectorMap<TRaw>;
  fallback?: TRaw[];
};

/**
 * Generic RSS → array of flat string records.
 */
export function parseRssItems<TRaw extends Record<string, string>>(
  xml: string,
  {
    itemSelector = "channel > item",
    selectors = {} as SelectorMap<TRaw>,
    fallback = [],
  }: ParseRssOptions<TRaw> = {},
): TRaw[] {
  try {
    const $ = load(xml, { xmlMode: true });

    const items: TRaw[] = [];

    $(itemSelector).each((_, el) => {
      const result: Record<string, string> = {};

      (Object.keys(selectors) as (keyof TRaw)[]).forEach((key) => {
        const selector = selectors[key];
        if (!selector) return;

        result[key as string] = $(el).find(selector).first().text().trim();
      });

      items.push(result as TRaw);
    });

    return items;
  } catch (error) {
    console.error("[parseRssItems] Failed to parse RSS feed", {
      error,
      itemSelector,
      selectors,
    });

    return fallback;
  }
}
