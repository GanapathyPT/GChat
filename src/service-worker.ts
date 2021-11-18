/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
// eslint-disable-next-line no-restricted-globals, no-underscore-dangle, no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const ignored = (self as any).__WB_MANIFEST;

self.addEventListener("fetch", (event) => {
  event.waitUntil(Promise.resolve());
});
