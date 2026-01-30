// TODO: add better and more comprehensive tests for parseRssItems
import { parseRssItems } from "../";

describe("parseRssItems", () => {
  it("should parse a simple RSS feed", () => {
    const xml = `
      <rss>
        <channel>
          <item>
            <title>Test Title</title>
            <description>Test Description</description>
            <link>https://example.com</link>
          </item>
        </channel>
      </rss>
    `;

    const result = parseRssItems(xml, {
      itemSelector: "channel > item",
      selectors: {
        title: "title",
        description: "description",
        link: "link",
      },
    });

    expect(result).toEqual([
      {
        title: "Test Title",
        description: "Test Description",
        link: "https://example.com",
      },
    ]);
  });
});
