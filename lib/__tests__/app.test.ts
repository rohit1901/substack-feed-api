import { getFeedByLink, getPosts, getSubstackFeed } from "../main";
import { RawFeedChannel } from "../types";

describe("getSubstackFeed", () => {
  it("should throw an error for invalid Substack feed", async () => {
    const invalidFeedUrl = "https://example.com/invalid-feed";
    await expect(getSubstackFeed(invalidFeedUrl)).rejects.toThrow(
      "Error occurred fetching Feed from Substack",
    );
  });
});

describe("getFeedByLink", () => {
  it("should throw an error for incorrect feed format", () => {
    const invalidFeed = { invalid: "format" };
    expect(() => getFeedByLink(invalidFeed, "https://example.com")).toThrow(
      "Feed is not in the correct format",
    );
  });
});

describe("getPosts", () => {
  const mockChannels: RawFeedChannel[] = [
    {
      title: ["Post 1"],
      description: ["Description 1"],
      link: ["https://example.com/post1"],
      image: [
        {
          url: ["https://example.com/image1"],
          title: ["Image 1"],
          link: ["https://example.com/image1"],
        },
      ],
      generator: ["Substack"],
      lastBuildDate: ["2023-01-01"],
      "atom:link": [
        {
          $: {
            href: "https://example.com/feed",
            rel: "self",
            type: "application/rss+xml",
          },
        },
      ],
      copyright: ["© 2023"],
      language: ["en"],
      webMaster: ["some"],
      "itunes:owner": [
        { "itunes:email": ["some@some.com"], "itunes:name": ["Some Name"] },
      ],
      "itunes:author": ["Some Author"],
      "googleplay:owner": ["Some Owner"],
      "googleplay:email": ["some@some.com"],
      "googleplay:author": ["Some Author"],
      item: [
        {
          title: ["Post 1"],
          description: ["Description 1"],
          link: ["https://example.com/post1"],
          guid: [
            { _: "https://example.com/post1", $: { isPermaLink: "true" } },
          ],
          "dc:creator": ["Some Author"],
          pubDate: ["2023-01-01"],
          enclosure: [
            {
              $: {
                url: "https://example.com/image1",
                length: "123",
                type: "image/jpeg",
              },
            },
          ],
          "content:encoded": ["<p>Content 1</p>"],
        },
      ],
    },
    {
      title: ["Post 2"],
      description: ["Description 2"],
      link: ["https://example.com/post1"],
      image: [
        {
          url: ["https://example.com/image1"],
          title: ["Image 1"],
          link: ["https://example.com/image1"],
        },
      ],
      generator: ["Substack"],
      lastBuildDate: ["2023-01-01"],
      "atom:link": [
        {
          $: {
            href: "https://example.com/feed",
            rel: "self",
            type: "application/rss+xml",
          },
        },
      ],
      copyright: ["© 2023"],
      language: ["en"],
      webMaster: ["some"],
      "itunes:owner": [
        { "itunes:email": ["some@some.com"], "itunes:name": ["Some Name"] },
      ],
      "itunes:author": ["Some Author"],
      "googleplay:owner": ["Some Owner"],
      "googleplay:email": ["some@some.com"],
      "googleplay:author": ["Some Author"],
      item: [
        {
          title: ["Post 1"],
          description: ["Description 1"],
          link: ["https://example.com/post1"],
          guid: [
            { _: "https://example.com/post1", $: { isPermaLink: "true" } },
          ],
          "dc:creator": ["Some Author"],
          pubDate: ["2023-01-01"],
          enclosure: [
            {
              $: {
                url: "https://example.com/image1",
                length: "123",
                type: "image/jpeg",
              },
            },
          ],
          "content:encoded": ["<p>Content 1</p>"],
        },
      ],
    },
  ];

  it("should transform raw items to SubstackItems", () => {
    const result = getPosts(mockChannels);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      title: "Post 1",
      description: "Description 1",
      link: "https://example.com/post1",
      pubDate: "2023-01-01",
      content: "<p>Content 1</p>",
    });
  });

  it("should handle empty channels array", () => {
    expect(() => getPosts([])).toThrow();
  });
});
