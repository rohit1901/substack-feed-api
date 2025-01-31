import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "../public/vite.svg";
import { getSubstackFeed, getFeedByLink, getPosts } from "../lib/main.ts";

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
