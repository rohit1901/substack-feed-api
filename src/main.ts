import {
  getFeedByLink,
  getGoodreadsFeed,
  getGoodreadsFeedItems,
  getPosts,
  getSubstackFeed,
} from "../lib/main.ts";
import viteLogo from "../public/vite.svg";
import "./style.css";
import typescriptLogo from "./typescript.svg";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h2>An API which fetches articles from Substack</h2>
    <div>
    <p>Built with
        <img src="${typescriptLogo}" alt="Typescript Logo" width="20" height="20" />
        <img src="${viteLogo}" alt="Vite Logo" width="20" height="20" />
    </p>

</div>
    <p> This page displays a list of articles from <code>https://rohitkhanduri.substack.com</code> </p>
  </div>
`;
const SUBSTACK_FEED_URL = "https://rohitkhanduri.substack.com";
getSubstackFeed(`${SUBSTACK_FEED_URL}/feed`, (err, rawRes) => {
  if (err) throw err;
  const feedChannel = getFeedByLink(rawRes, SUBSTACK_FEED_URL);
  const posts = getPosts(feedChannel);
  const postsHTML = posts.map((item) => {
    const post = document.createElement("div");
    post.innerHTML = `
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <a href="${item.link}">Read article</a>
            `;
    return post;
  });
  postsHTML.forEach((post) => {
    document.querySelector<HTMLDivElement>("#app")!.appendChild(post);
  });
}).catch((err) => console.error(err));
getGoodreadsFeed(
  "https://www.goodreads.com/review/list_rss/161866901?key=i4wH3ZD_K1LIZ7duOLVsiUWcyhW-fGCsox5koyQTJIUuwzwO&shelf=read",
  (err, data) => {
    if (err) throw err;
    return getGoodreadsFeedItems(data);
  },
);
