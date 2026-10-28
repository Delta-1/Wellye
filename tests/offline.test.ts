import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { serviceWorkerSource } from "../scripts/offline-worker.mjs";
function worker() {
  const shell = "https://delta-1.github.io/Wellye/";
  const stores = new Map<string, Map<string, string>>([
    ["another-app", new Map()],
    ["wellye-ancient", new Map()],
    ["wellye-previous-two", new Map()],
    [
      "wellye-previous",
      new Map([
        [shell, "old document"],
        [shell + "assets/old-chunk.js", "old chunk"],
      ]),
    ],
    ["wellye-current", new Map([[shell, "current document"]])],
  ]);
  const handlers: Record<string, (event: any) => void> = {};
  const key = (r: any) => (typeof r === "string" ? r : r.url);
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async (name: string) => stores.delete(name),
    open: async (name: string) => {
      const s = stores.get(name) ?? new Map();
      stores.set(name, s);
      return {
        match: async (r: any) => s.get(key(r)),
        put: async (r: any, v: any) => s.set(key(r), v),
        addAll: async () => {},
      };
    },
    match: async (r: any) => {
      for (const s of stores.values()) if (s.has(key(r))) return s.get(key(r));
    },
  };
  runInNewContext(
    serviceWorkerSource({
      cacheName: "wellye-current",
      assets: [],
      shellHtml: "current document",
    }),
    {
      URL,
      Response,
      caches,
      fetch: async () => {
        throw new Error("offline");
      },
      self: {
        registration: { scope: shell },
        location: { origin: "https://delta-1.github.io" },
        clients: { claim: async () => {} },
        skipWaiting: () => {},
        addEventListener: (name: string, fn: any) => (handlers[name] = fn),
      },
    },
  );
  async function activate() {
    let pending: Promise<unknown> | undefined;
    handlers.activate({ waitUntil: (p: Promise<unknown>) => (pending = p) });
    await pending;
  }
  async function get(path: string, mode = "cors") {
    let response: Promise<unknown> | undefined;
    handlers.fetch({
      request: { url: shell + path, method: "GET", mode },
      respondWith: (p: Promise<unknown>) => (response = p),
    });
    return response ? await response : undefined;
  }
  return { stores, activate, get };
}
test("an update serves the current document even when an older cache contains the same URL", async () => {
  const w = worker();
  await w.activate();
  assert.equal(await w.get("", "navigate"), "current document");
});
test("tabs from the preceding build can still load their assets after activation while offline", async () => {
  const w = worker();
  await w.activate();
  assert.equal(await w.get("assets/old-chunk.js"), "old chunk");
});
test("activation bounds retained versions without deleting another application cache", async () => {
  const w = worker();
  await w.activate();
  assert.equal(w.stores.has("wellye-ancient"), false);
  assert.equal(w.stores.has("another-app"), true);
  assert.equal(w.stores.has("wellye-previous"), true);
  assert.equal(w.stores.has("wellye-previous-two"), true);
  assert.equal(w.stores.has("wellye-current"), true);
});
