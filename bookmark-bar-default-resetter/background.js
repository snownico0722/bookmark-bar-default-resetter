const BOOKMARKS_BAR_ID = "1";
const TEMP_TOKEN = "9b8c2d5f4a7e41c3b6d9f0a1e2c7b5d8";
const TEMP_TITLE = `__bookmark_bar_default_reset_marker_${TEMP_TOKEN}_${chrome.runtime.id}__`;
const TEMP_URL = `https://example.invalid/bookmark-bar-default-reset-marker/${TEMP_TOKEN}/${chrome.runtime.id}`;
const TOUCH_DELAY_MS = 300;
const MIN_TOUCH_INTERVAL_MS = 1000;

let touchTimer = null;
let touching = false;

async function getSessionState() {
  return chrome.storage.session.get({
    importInProgress: false,
    lastTouchAt: 0,
  });
}

async function setSessionState(state) {
  await chrome.storage.session.set(state);
}

function scheduleTouch(reason) {
  clearTimeout(touchTimer);
  touchTimer = setTimeout(() => {
    touchBookmarkBar(reason).catch((error) => {
      console.warn("Failed to reset Chrome bookmark default folder:", error);
    });
  }, TOUCH_DELAY_MS);
}

async function cleanLeftoverMarkers() {
  const markers = await chrome.bookmarks.search({
    title: TEMP_TITLE,
    url: TEMP_URL,
  });

  await Promise.all(
    markers
      .filter((node) => node.url === TEMP_URL && node.parentId === BOOKMARKS_BAR_ID)
      .map((node) => chrome.bookmarks.remove(node.id).catch(() => undefined))
  );
}

async function touchBookmarkBar(reason) {
  if (touching) return;
  touching = true;

  try {
    const { importInProgress, lastTouchAt } = await getSessionState();
    if (importInProgress) return;

    const now = Date.now();
    if (now - lastTouchAt < MIN_TOUCH_INTERVAL_MS) return;

    await setSessionState({ lastTouchAt: now });
    await cleanLeftoverMarkers();

    const marker = await chrome.bookmarks.create({
      parentId: BOOKMARKS_BAR_ID,
      title: TEMP_TITLE,
      url: TEMP_URL,
    });

    await chrome.bookmarks.remove(marker.id);
    await chrome.storage.local.set({
      lastTouchAt: new Date(now).toISOString(),
      lastTouchReason: reason,
    });
  } finally {
    touching = false;
  }
}

function isMarker(node) {
  return node?.title === TEMP_TITLE && node?.url === TEMP_URL;
}

chrome.runtime.onInstalled.addListener(() => {
  setSessionState({ importInProgress: false, lastTouchAt: 0 }).finally(() => {
    scheduleTouch("installed");
  });
});

chrome.runtime.onStartup.addListener(() => {
  setSessionState({ importInProgress: false }).finally(() => {
    scheduleTouch("startup");
  });
});

chrome.bookmarks.onCreated.addListener((_id, node) => {
  if (touching || isMarker(node)) return;

  scheduleTouch(node.url ? "bookmark-created" : "folder-created");
});

chrome.bookmarks.onMoved.addListener(() => {
  if (touching) return;

  scheduleTouch("bookmark-moved");
});

chrome.bookmarks.onImportBegan.addListener(() => {
  clearTimeout(touchTimer);
  setSessionState({ importInProgress: true }).catch((error) => {
    console.warn("Failed to store bookmark import state:", error);
  });
});

chrome.bookmarks.onImportEnded.addListener(() => {
  setSessionState({ importInProgress: false }).finally(() => {
    scheduleTouch("import-ended");
  });
});
