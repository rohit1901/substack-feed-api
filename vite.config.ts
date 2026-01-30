import { defineConfig, loadEnv } from "vite";

const DEFAULT_SUBSTACK_ORIGIN = "https://xxxx.substack.com";
const DEFAULT_SUBSTACK_PATH = "/feed";
const DEFAULT_GOODREADS_ORIGIN = "https://www.goodreads.com";
const DEFAULT_GOODREADS_PATH = "/xxxx";

function normalisePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export default defineConfig(({ mode }) => {
  // Load env variables based on current mode
  const env = loadEnv(mode, process.cwd(), "");

  const SUBSTACK_ORIGIN =
    env.VITE_PROXY_SUBSTACK_ORIGIN ?? DEFAULT_SUBSTACK_ORIGIN;
  const SUBSTACK_PATH = normalisePath(
    env.VITE_PROXY_SUBSTACK_PATH ?? DEFAULT_SUBSTACK_PATH,
  );

  const GOODREADS_ORIGIN =
    env.VITE_PROXY_GOODREADS_ORIGIN ?? DEFAULT_GOODREADS_ORIGIN;
  const GOODREADS_PATH = normalisePath(
    env.VITE_PROXY_GOODREADS_PATH ?? DEFAULT_GOODREADS_PATH,
  );

  const proxyConfig = {
    "/api/substack": {
      target: SUBSTACK_ORIGIN,
      changeOrigin: true,
      secure: true,
      followRedirects: true,
      rewrite: () => SUBSTACK_PATH,
    },
    "/api/goodreads": {
      target: GOODREADS_ORIGIN,
      changeOrigin: true,
      secure: true,
      followRedirects: true,
      rewrite: () => GOODREADS_PATH,
    },
  };

  return {
    server: {
      proxy: proxyConfig,
    },
    preview: {
      proxy: proxyConfig,
    },
    build: {
      lib: {
        entry: "./lib/index.ts",
        name: "SubstackFeedAPI",
        fileName: "substackFeedApi",
      },
    },
  };
});
