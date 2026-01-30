import { parseGoodreadsRss } from "../lib/goodreads.ts";
import { parseSubstackRss } from "../lib/substack.ts";
import viteLogo from "../public/vite.svg";
import "./style.css";
import typescriptLogo from "./typescript.svg";

type SubstackItem = ReturnType<typeof parseSubstackRss>[number];
type GoodreadsReadingState = ReturnType<typeof parseGoodreadsRss>[number];

const appRoot = document.querySelector<HTMLDivElement>("#app");
if (!appRoot) {
  throw new Error("Unable to find root element with selector #app");
}

appRoot.innerHTML = `
  <div class="hero">
    <h2>An API which fetches articles from Substack</h2>
    <p>
      Built with
      <img src="${typescriptLogo}" alt="Typescript Logo" width="20" height="20" />
      <img src="${viteLogo}" alt="Vite Logo" width="20" height="20" />
    </p>
    <p>
      This page displays a list of articles from
      <code>https://rohitkhanduri.substack.com</code>
      and recent Goodreads activity.
    </p>
  </div>
`;

const feedsContainer = document.createElement("div");
feedsContainer.classList.add("feeds");
appRoot.appendChild(feedsContainer);

const substackSection = createFeedSection("Latest Substack Posts");
feedsContainer.appendChild(substackSection.section);

const goodreadsSection = createFeedSection("Recent Goodreads Activity");
feedsContainer.appendChild(goodreadsSection.section);

const SUBSTACK_FEED_URL = "/api/substack";
const GOODREADS_FEED_URL = "/api/goodreads";

void (async function init() {
  await Promise.all([
    renderSubstack(substackSection),
    renderGoodreads(goodreadsSection),
  ]);
})();

async function renderSubstack(section: FeedSection) {
  section.setStatus("Loading Substack posts…");
  try {
    const xml = await fetchXml(SUBSTACK_FEED_URL);
    const posts = parseSubstackRss(xml, { fallback: [] });

    if (!posts.length) {
      section.setStatus("No posts found.");
      return;
    }

    section.setStatus();
    posts
      .slice(0, 10)
      .forEach((post) => section.content.appendChild(createSubstackCard(post)));
  } catch (error) {
    console.error("[main] Failed to render Substack feed", error);
    section.setStatus("Failed to load Substack posts.");
  }
}

async function renderGoodreads(section: FeedSection) {
  section.setStatus("Loading Goodreads activity…");
  try {
    const xml = await fetchXml(GOODREADS_FEED_URL);
    const items = parseGoodreadsRss(xml, { fallback: [] });

    if (!items.length) {
      section.setStatus("No recent Goodreads activity.");
      return;
    }

    section.setStatus();
    items
      .slice(0, 10)
      .forEach((item) =>
        section.content.appendChild(createGoodreadsCard(item)),
      );
  } catch (error) {
    console.error("[main] Failed to render Goodreads feed", error);
    section.setStatus("Failed to load Goodreads activity.");
  }
}

type FeedSection = {
  section: HTMLElement;
  content: HTMLElement;
  setStatus: (message?: string) => void;
};

function createFeedSection(heading: string): FeedSection {
  const section = document.createElement("section");
  section.classList.add("feed-section");

  const title = document.createElement("h3");
  title.textContent = heading;
  section.appendChild(title);

  const status = document.createElement("p");
  status.classList.add("feed-status");
  section.appendChild(status);

  const content = document.createElement("div");
  content.classList.add("feed-content");
  section.appendChild(content);

  const setStatus = (message?: string) => {
    if (message && message.trim().length > 0) {
      status.textContent = message;
      status.hidden = false;
    } else {
      status.textContent = "";
      status.hidden = true;
    }
  };

  return { section, content, setStatus };
}

async function fetchXml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function createSubstackCard(item: SubstackItem): HTMLElement {
  const article = document.createElement("article");
  article.classList.add("feed-card", "substack-card");

  const title = document.createElement("h4");
  title.textContent = item.title;
  article.appendChild(title);

  const meta = document.createElement("time");
  meta.dateTime = item.pubDate;
  meta.textContent = formatDate(item.pubDate);
  article.appendChild(meta);

  const description = document.createElement("p");
  description.textContent = stripHtml(item.description).slice(0, 280).trim();
  article.appendChild(description);

  const link = document.createElement("a");
  link.href = item.link;
  link.textContent = "Read article";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  article.appendChild(link);

  return article;
}

function createGoodreadsCard(state: GoodreadsReadingState): HTMLElement {
  const article = document.createElement("article");
  article.classList.add("feed-card", "goodreads-card");

  const title = document.createElement("h4");
  title.textContent = state.book.title;
  article.appendChild(title);

  const status = document.createElement("p");
  status.classList.add("goodreads-status");
  status.textContent = statusLabel(state.status);
  article.appendChild(status);

  if (state.book.authors?.length) {
    const authors = document.createElement("p");
    authors.classList.add("goodreads-authors");
    authors.textContent = `by ${state.book.authors
      .map((author) => author.name)
      .join(", ")}`;
    article.appendChild(authors);
  }

  if (state.book.description) {
    const description = document.createElement("p");
    description.textContent = stripHtml(state.book.description)
      .slice(0, 280)
      .trim();
    article.appendChild(description);
  }

  if (state.book.cover) {
    const cover = document.createElement("img");
    cover.src = state.book.cover;
    cover.alt = `${state.book.title} cover`;
    cover.loading = "lazy";
    cover.classList.add("goodreads-cover");
    article.appendChild(cover);
  }

  return article;
}

function stripHtml(value: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = value;
  return tmp.textContent ?? tmp.innerText ?? "";
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusLabel(status: GoodreadsReadingState["status"]): string {
  switch (status) {
    case "FINISHED":
      return "Finished reading";
    case "IS_READING":
      return "Currently reading";
    case "WANTS_TO_READ":
      return "Wants to read";
    default:
      return status;
  }
}
