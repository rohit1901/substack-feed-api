/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROXY_SUBSTACK_ORIGIN: string;
  readonly VITE_PROXY_SUBSTACK_PATH: string;
  readonly VITE_PROXY_GOODREADS_ORIGIN: string;
  readonly VITE_PROXY_GOODREADS_PATH: string;
  // Add all your VITE_ variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
