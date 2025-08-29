/* 簡易離線快取：HTML + 靜態資產 */
const CACHE_NAME = "cat-meals-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  // 若你的檔名不是 index.html，請改這裡
  // 若有額外 CSS/JS/圖檔，請一併列出，例如：
  // "/icons/icon-192.png",
  // "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

/* Network-first for HTML, Cache-first for others（簡潔實用） */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const isHTML = req.headers.get("accept")?.includes("text/html");

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match("/index.html")))
    );
  } else {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
  }
});
