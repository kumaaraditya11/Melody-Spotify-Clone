/* =====================================================
   Melody 2.0 - script.js
   Sections:
   1  Starter songs and moods (edit these!)
   2  Icons and small helper functions
   3  Saved data (localStorage) and app state
   4  Toasts, modal and playlist dropdown
   5  Local music upload (with ID3 tag reading)
   6  Playback (play, pause, next, previous, shuffle, repeat)
   7  Player bar (progress, volume, buttons)
   8  Likes, recently played and playlists
   9  Drawing the pages (Home, Search, Library, ...)
   10 Click handling, keyboard shortcuts and start-up
   ===================================================== */
"use strict";

/* =====================================================
   1. STARTER SONGS AND MOODS
   -----------------------------------------------------
   To add your own song, copy one line and change it:
     src: "music/my-song.mp3"   (put the MP3 in a folder called "music")
   - id must be unique and contain only letters, numbers and "-"
   - moods must match names in the MOODS list below
   - cover is optional: cover: "images/my-cover.jpg"
     (if you leave it out, a cover is drawn automatically)
   - featured / popular decide which Home section shows the song
   The demo audio comes from SoundHelix (royalty-free demo music).
   The titles, artists and albums are made-up placeholders.
   ===================================================== */
const DEMO_BASE = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-";

const starterSongs = [
  { id: "s1",  title: "Midnight Drive",    artist: "Neon Harbor",       album: "Night Signals",    color: "#1f6f5c", moods: ["Chill", "English Hits"],       featured: true,  popular: true,  src: DEMO_BASE + "1.mp3" },
  { id: "s2",  title: "Golden Hour",       artist: "Aria Vale",         album: "Sunday Light",     color: "#c2410c", moods: ["Romantic", "English Hits"],    featured: true,  popular: false, src: DEMO_BASE + "2.mp3" },
  { id: "s3",  title: "Run The Block",     artist: "Kinetic",           album: "Adrenaline",       color: "#b91c1c", moods: ["Workout", "Party"],            featured: true,  popular: true,  src: DEMO_BASE + "3.mp3" },
  { id: "s4",  title: "Paper Lanterns",    artist: "Mira and the Moths", album: "Soft Fires",      color: "#7c3aed", moods: ["Romantic", "Bollywood"],       featured: true,  popular: false, src: DEMO_BASE + "4.mp3" },
  { id: "s5",  title: "Deep Work",         artist: "Lo-Fi Lagoon",      album: "Study Tide",       color: "#0f766e", moods: ["Focus", "Chill"],              featured: false, popular: true,  src: DEMO_BASE + "5.mp3" },
  { id: "s6",  title: "Raincoat",          artist: "Ocean Static",      album: "Grey Windows",     color: "#475569", moods: ["Sad", "Chill"],                featured: false, popular: false, src: DEMO_BASE + "6.mp3" },
  { id: "s7",  title: "Dance Floor Fever", artist: "DJ Marigold",       album: "Bass and Blossom", color: "#db2777", moods: ["Party", "Bollywood"],          featured: true,  popular: true,  src: DEMO_BASE + "7.mp3" },
  { id: "s8",  title: "Last Train Home",   artist: "Hollow Pines",      album: "Empty Platforms",  color: "#334155", moods: ["Sad", "English Hits"],         featured: false, popular: true,  src: DEMO_BASE + "8.mp3" },
  { id: "s9",  title: "Sprint Finish",     artist: "Kinetic",           album: "Adrenaline",       color: "#ca8a04", moods: ["Workout"],                     featured: false, popular: false, src: DEMO_BASE + "9.mp3" },
  { id: "s10", title: "Chai and Monsoon",  artist: "Rohan Sen",         album: "Barsaat Diaries",  color: "#0369a1", moods: ["Bollywood", "Romantic", "Chill"], featured: true, popular: true, src: DEMO_BASE + "10.mp3" },
  { id: "s11", title: "Focus Mode",        artist: "Lo-Fi Lagoon",      album: "Study Tide",       color: "#15803d", moods: ["Focus"],                       featured: false, popular: false, src: DEMO_BASE + "11.mp3" },
  { id: "s12", title: "Sparkler Night",    artist: "DJ Marigold",       album: "Bass and Blossom", color: "#be185d", moods: ["Party", "Bollywood", "Workout"], featured: false, popular: true, src: DEMO_BASE + "12.mp3" },
  { id: "s13", title: "Hello Skyline",     artist: "Aria Vale",         album: "Sunday Light",     color: "#2563eb", moods: ["English Hits", "Party"],       featured: false, popular: true,  src: DEMO_BASE + "13.mp3" },
  { id: "s14", title: "Fading Polaroids",  artist: "Hollow Pines",      album: "Empty Platforms",  color: "#6b21a8", moods: ["Sad", "Romantic"],             featured: false, popular: false, src: DEMO_BASE + "14.mp3" },
  { id: "s15", title: "Quiet Library",     artist: "Lo-Fi Lagoon",      album: "Study Tide",       color: "#4d7c0f", moods: ["Focus", "Chill"],              featured: false, popular: false, src: DEMO_BASE + "15.mp3" },
  { id: "s16", title: "Iron Lungs",        artist: "Kinetic",           album: "Adrenaline",       color: "#9a3412", moods: ["Workout", "English Hits"],     featured: false, popular: false, src: DEMO_BASE + "16.mp3" }
];

const MOODS = [
  { name: "Chill",        color: "#2a7f78" },
  { name: "Workout",      color: "#c0392b" },
  { name: "Romantic",     color: "#c2185b" },
  { name: "Focus",        color: "#2f6fb3" },
  { name: "Party",        color: "#8e44ad" },
  { name: "Sad",          color: "#475569" },
  { name: "Bollywood",    color: "#d97706" },
  { name: "English Hits", color: "#16803c" }
];

// Colours used for playlist tiles and uploaded songs
const TILE_COLORS = ["#1f6f5c", "#7c3aed", "#c2410c", "#0369a1", "#be185d", "#4d7c0f", "#b91c1c", "#334155"];

/* =====================================================
   2. ICONS AND SMALL HELPERS
   ===================================================== */
const ICON_PATHS = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  library: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>',
  prev: '<polygon points="19 20 9 12 19 4 19 20" fill="currentColor"/><line x1="5" y1="19" x2="5" y2="5"/>',
  next: '<polygon points="5 4 15 12 5 20 5 4" fill="currentColor"/><line x1="19" y1="5" x2="19" y2="19"/>',
  shuffle: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
  repeat: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  repeatOne: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/><path d="M11 10l1-1v6"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  volumeMute: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'
};

function icon(name) {
  return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + ICON_PATHS[name] + "</svg>";
}

// Makes text safe to put inside HTML (important for file names typed by users)
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Turns a string into a number (used to pick a colour for a name)
function hashString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 1000003;
  }
  return hash;
}

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return minutes + ":" + String(secs).padStart(2, "0");
}

function plural(count, word) {
  return count + " " + word + (count === 1 ? "" : "s");
}

// Draws a simple square album cover as an SVG image (no image files needed)
function makeCover(song) {
  const shapeType = hashString(song.id) % 4;
  let shape = "";
  if (shapeType === 0) {
    shape = '<circle cx="140" cy="140" r="80" fill="#fff" fill-opacity=".14"/>';
  } else if (shapeType === 1) {
    shape = '<rect x="-20" y="110" width="260" height="34" fill="#fff" fill-opacity=".14" transform="rotate(-20 100 120)"/>' +
            '<rect x="-20" y="150" width="260" height="18" fill="#fff" fill-opacity=".1" transform="rotate(-20 100 120)"/>';
  } else if (shapeType === 2) {
    shape = '<circle cx="100" cy="120" r="70" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="10"/>' +
            '<circle cx="100" cy="120" r="35" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="10"/>';
  } else {
    shape = '<polygon points="200,60 200,200 60,200" fill="#fff" fill-opacity=".14"/>';
  }
  const letter = escapeHTML((song.title.trim().charAt(0) || "?").toUpperCase());
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
    '<rect width="200" height="200" fill="' + song.color + '"/>' + shape +
    '<text x="16" y="50" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" fill="#fff" fill-opacity=".92">' + letter + "</text>" +
    "</svg>";
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Reads JSON from localStorage; returns the fallback if nothing is saved or data is broken
function loadSaved(key, fallback) {
  try {
    const text = localStorage.getItem(key);
    return text ? JSON.parse(text) : fallback;
  } catch (error) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage may be full or blocked; the app still works for this visit
  }
}

/* =====================================================
   3. SAVED DATA AND APP STATE
   ===================================================== */
const KEY_LIKED = "melody2_liked";
const KEY_PLAYLISTS = "melody2_playlists";
const KEY_RECENT = "melody2_recent";
const KEY_LOCAL_SONGS = "melody2_local_songs";
const KEY_SETTINGS = "melody2_settings";

let likedIds = loadSaved(KEY_LIKED, []);
let playlists = loadSaved(KEY_PLAYLISTS, []);
let recentIds = loadSaved(KEY_RECENT, []);
let settings = loadSaved(KEY_SETTINGS, {});

let shuffleOn = settings.shuffle === true;
let repeatMode = ["off", "all", "one"].includes(settings.repeat) ? settings.repeat : "off";

// library = starter songs + uploaded songs
let library = [];

let currentSongId = null;     // song loaded in the player
let queue = [];               // list of song ids that next/previous move through
let shuffleHistory = [];      // songs played in shuffle mode (used by Previous)
let lastRecordedId = null;    // stops the same song being saved twice in a row
let errorStreak = 0;          // counts songs in a row that failed to load
let view = { name: "home", param: null };
let searchQuery = "";
let menuSongId = null;        // song chosen in the "Add to playlist" dropdown
let modalHandler = null;      // function run when the modal is confirmed
const durations = {};         // song id -> length in seconds
const durationRequested = {}; // song ids whose length we already asked for

const audio = new Audio();
audio.preload = "auto";

// Page elements we use often
const $ = (id) => document.getElementById(id);
const mainEl = $("main");
const viewEl = $("view");
const searchInput = $("search-input");
const fileInput = $("file-input");
const playBtn = $("play-btn");
const progressRange = $("progress-range");
const volumeRange = $("volume-range");

function buildLibrary() {
  const uploaded = loadSaved(KEY_LOCAL_SONGS, []).map((song) => {
    // Files cannot be saved in localStorage, so after a refresh they have no src until re-selected
    return { id: song.id, title: song.title, artist: song.artist, album: song.album,
             color: song.color, moods: [], isLocal: true, src: null };
  });
  library = starterSongs.concat(uploaded);
  library.forEach((song) => {
    if (!song.cover) song.cover = makeCover(song);
  });
}

function getSong(id) {
  return library.find((song) => song.id === id) || null;
}

function saveLocalSongs() {
  const list = library.filter((song) => song.isLocal).map((song) => {
    return { id: song.id, title: song.title, artist: song.artist, album: song.album, color: song.color };
  });
  save(KEY_LOCAL_SONGS, list);
}

function saveSettings() {
  save(KEY_SETTINGS, { volume: audio.volume, shuffle: shuffleOn, repeat: repeatMode });
}

/* =====================================================
   4. TOASTS, MODAL AND PLAYLIST DROPDOWN
   ===================================================== */
function toast(message) {
  const box = document.createElement("div");
  box.className = "toast";
  box.textContent = message;
  $("toast-container").appendChild(box);
  setTimeout(() => box.classList.add("leaving"), 2400);
  setTimeout(() => box.remove(), 2800);
}

/* Modal: options = { title, message, input, placeholder, confirmLabel, danger, onConfirm }
   - input: leave out for a simple confirmation, or give a starting text for a text box
   - onConfirm(value): return an error message to keep the modal open */
function openModal(options) {
  $("modal-title").textContent = options.title;
  $("modal-message").textContent = options.message || "";
  $("modal-message").hidden = !options.message;
  $("modal-error").textContent = "";

  const input = $("modal-input");
  input.hidden = options.input === undefined;
  input.value = options.input || "";
  input.placeholder = options.placeholder || "";

  const confirmBtn = $("modal-confirm");
  confirmBtn.textContent = options.confirmLabel || "OK";
  confirmBtn.className = "btn " + (options.danger ? "btn-danger" : "btn-primary");

  modalHandler = options.onConfirm;
  $("modal").hidden = false;
  if (options.input === undefined) {
    confirmBtn.focus();
  } else {
    input.focus();
    input.select();
  }
}

function closeModal() {
  $("modal").hidden = true;
  modalHandler = null;
}

function openPlaylistMenu(songId, anchor) {
  menuSongId = songId;
  const menu = $("playlist-menu");
  let html = '<p class="popover-title">Add to playlist</p>';
  playlists.forEach((playlist) => {
    const already = playlist.songIds.includes(songId);
    html += '<button class="popover-item" role="menuitem" data-action="menu-add" data-playlist-id="' + playlist.id + '">' +
            "<span>" + escapeHTML(playlist.name) + "</span>" +
            (already ? '<span class="added">Added</span>' : "") + "</button>";
  });
  html += '<button class="popover-item popover-new" role="menuitem" data-action="menu-new">+ New playlist</button>';
  menu.innerHTML = html;
  menu.hidden = false;

  // Place the menu next to the button, keeping it inside the window
  const box = anchor.getBoundingClientRect();
  const menuWidth = menu.offsetWidth;
  const menuHeight = menu.offsetHeight;
  let left = Math.min(box.left, window.innerWidth - menuWidth - 8);
  let top = box.bottom + 6;
  if (top + menuHeight > window.innerHeight - 8) top = box.top - menuHeight - 6;
  menu.style.left = Math.max(8, left) + "px";
  menu.style.top = Math.max(8, top) + "px";
}

function closeMenu() {
  $("playlist-menu").hidden = true;
  menuSongId = null;
}

/* =====================================================
   5. LOCAL MUSIC UPLOAD
   Files stay on your computer. We only make a temporary
   link to them with URL.createObjectURL().
   ===================================================== */
function isAudioFile(file) {
  return file.type.startsWith("audio/") || /\.(mp3|wav|ogg|m4a|aac|flac|opus|webm)$/i.test(file.name);
}

// Read a number stored in 4 bytes where each byte only uses 7 bits (ID3 "synchsafe")
function readSynchsafe(bytes, position) {
  return ((bytes[position] & 0x7f) << 21) | ((bytes[position + 1] & 0x7f) << 14) |
         ((bytes[position + 2] & 0x7f) << 7) | (bytes[position + 3] & 0x7f);
}

function decodeID3Text(bytes) {
  const encoding = bytes[0];
  let body = bytes.subarray(1);
  let label = "iso-8859-1";
  if (encoding === 1) {
    label = "utf-16le";
    if (body[0] === 0xff && body[1] === 0xfe) {
      body = body.subarray(2);
    } else if (body[0] === 0xfe && body[1] === 0xff) {
      label = "utf-16be";
      body = body.subarray(2);
    }
  } else if (encoding === 2) {
    label = "utf-16be";
  } else if (encoding === 3) {
    label = "utf-8";
  }
  return new TextDecoder(label).decode(body).replace(/\0/g, "").trim();
}

/* Tries to read title, artist and album from the ID3v2 tag at the start of an MP3.
   If anything goes wrong, the file name is used as the title instead. */
async function readSongTags(file) {
  const fallback = { title: file.name.replace(/\.[^.]+$/, ""), artist: "Unknown Artist", album: "Local Upload" };
  try {
    if (!/\.mp3$/i.test(file.name)) return fallback;

    const header = new Uint8Array(await file.slice(0, 10).arrayBuffer());
    const hasTag = String.fromCharCode(header[0], header[1], header[2]) === "ID3";
    const version = header[3];
    if (!hasTag || version < 3) return fallback;

    const tagSize = Math.min(readSynchsafe(header, 6), 5 * 1024 * 1024);
    const data = new Uint8Array(await file.slice(10, 10 + tagSize).arrayBuffer());
    const found = {};
    let position = 0;

    // Each frame: 4-letter id, 4-byte size, 2 flag bytes, then the content
    while (position + 10 <= data.length) {
      const frameId = String.fromCharCode(data[position], data[position + 1], data[position + 2], data[position + 3]);
      if (!/^[A-Z0-9]{4}$/.test(frameId)) break;
      const frameSize = version === 4
        ? readSynchsafe(data, position + 4)
        : data[position + 4] * 16777216 + (data[position + 5] << 16) + (data[position + 6] << 8) + data[position + 7];
      if (frameSize <= 0 || position + 10 + frameSize > data.length) break;
      if (frameId === "TIT2" || frameId === "TPE1" || frameId === "TALB") {
        found[frameId] = decodeID3Text(data.subarray(position + 10, position + 10 + frameSize));
      }
      position += 10 + frameSize;
    }

    return {
      title: (found.TIT2 || fallback.title).slice(0, 80),
      artist: (found.TPE1 || fallback.artist).slice(0, 80),
      album: (found.TALB || fallback.album).slice(0, 80)
    };
  } catch (error) {
    return fallback;
  }
}

// Returns "added", "restored" or "skipped"
async function addLocalFile(file) {
  if (!isAudioFile(file)) return "skipped";

  // The same file always gets the same id, so likes and playlists still match after a refresh
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const id = "local-" + safeName + "-" + file.size;
  const url = URL.createObjectURL(file);
  const existing = getSong(id);

  if (existing) {
    const hadFile = Boolean(existing.src);
    if (existing.src && existing.src.startsWith("blob:")) URL.revokeObjectURL(existing.src);
    existing.src = url;
    return hadFile ? "skipped" : "restored";
  }

  const tags = await readSongTags(file);
  const song = {
    id: id,
    title: tags.title,
    artist: tags.artist,
    album: tags.album,
    color: TILE_COLORS[hashString(id) % TILE_COLORS.length],
    moods: [],
    isLocal: true,
    src: url
  };
  song.cover = makeCover(song);
  library.push(song);
  return "added";
}

async function handleFilesChosen() {
  const files = Array.from(fileInput.files);
  const result = { added: 0, restored: 0, skipped: 0 };
  for (const file of files) {
    const status = await addLocalFile(file);
    result[status]++;
  }
  fileInput.value = ""; // lets the user pick the same file again later
  if (files.length === 0) return;

  saveLocalSongs();
  refreshView();
  loadAllDurations();

  if (result.added + result.restored > 0) {
    let message = "";
    if (result.added > 0) message += plural(result.added, "song") + " added";
    if (result.restored > 0) message += (message ? ", " : "") + plural(result.restored, "song") + " restored";
    toast(message);
  } else if (files.some((file) => !isAudioFile(file))) {
    toast("That file type is not supported. Please choose an audio file.");
  } else {
    toast("Those songs are already in your library");
  }
}

function removeLocalSong(songId) {
  const song = getSong(songId);
  if (!song) return;
  openModal({
    title: "Remove this song?",
    message: '"' + song.title + '" will be removed from your library, likes and playlists. The file on your device is not touched.',
    confirmLabel: "Remove",
    danger: true,
    onConfirm: () => {
      if (currentSongId === songId) {
        audio.pause();
        audio.removeAttribute("src");
        currentSongId = null;
      }
      if (song.src && song.src.startsWith("blob:")) URL.revokeObjectURL(song.src);
      library = library.filter((item) => item.id !== songId);
      queue = queue.filter((id) => id !== songId);
      likedIds = likedIds.filter((id) => id !== songId);
      recentIds = recentIds.filter((id) => id !== songId);
      playlists.forEach((playlist) => {
        playlist.songIds = playlist.songIds.filter((id) => id !== songId);
      });
      save(KEY_LIKED, likedIds);
      save(KEY_RECENT, recentIds);
      savePlaylists();
      saveLocalSongs();
      updatePlayerUI();
      refreshView();
      toast("Song removed");
    }
  });
}

/* =====================================================
   6. PLAYBACK
   ===================================================== */
function playableIds(songs) {
  return songs.filter((song) => song.src).map((song) => song.id);
}

function playSong(id, queueIds) {
  const song = getSong(id);
  if (!song) return;
  if (!song.src) {
    toast("Click Add Music and select \"" + song.title + "\" again to play it");
    return;
  }

  if (queueIds) {
    queue = queueIds.filter((queuedId) => {
      const queued = getSong(queuedId);
      return queued && queued.src;
    });
    shuffleHistory = [];
  }
  if (!queue.includes(id)) queue = [id];

  currentSongId = id;
  audio.src = song.src;
  const attempt = audio.play();
  if (attempt) {
    attempt.catch((error) => {
      // Load errors are handled by the "error" event below
      if (error.name === "NotAllowedError") toast("Press the play button to start the music");
    });
  }
  updatePlayerUI();
  highlightCurrent();
}

function startFromLibrary() {
  const ids = playableIds(library);
  if (ids.length === 0) {
    toast("Add some music first");
    return;
  }
  const startId = shuffleOn ? ids[Math.floor(Math.random() * ids.length)] : ids[0];
  playSong(startId, ids);
}

function togglePlay() {
  if (!currentSongId) {
    startFromLibrary();
    return;
  }
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

function playNext(autoAdvance) {
  if (!currentSongId || queue.length === 0) {
    if (!autoAdvance) startFromLibrary();
    return;
  }
  const index = queue.indexOf(currentSongId);
  let nextId;

  if (shuffleOn && queue.length > 1) {
    shuffleHistory.push(currentSongId);
    if (shuffleHistory.length > 50) shuffleHistory.shift();
    do {
      nextId = queue[Math.floor(Math.random() * queue.length)];
    } while (nextId === currentSongId);
  } else {
    let nextIndex = index + 1;
    if (nextIndex >= queue.length) {
      // End of the queue: stop if repeat is off and the song ended by itself
      if (autoAdvance && repeatMode === "off") {
        audio.currentTime = 0;
        updateProgress();
        return;
      }
      nextIndex = 0;
    }
    nextId = queue[nextIndex];
  }
  playSong(nextId);
}

function playPrevious() {
  if (!currentSongId) {
    startFromLibrary();
    return;
  }
  // Like most players: if the song is already a few seconds in, restart it first
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  if (shuffleOn) {
    while (shuffleHistory.length > 0) {
      const earlierId = shuffleHistory.pop();
      if (queue.includes(earlierId)) {
        playSong(earlierId);
        return;
      }
    }
  }
  const index = queue.indexOf(currentSongId);
  const previousIndex = index <= 0 ? queue.length - 1 : index - 1;
  playSong(queue[previousIndex]);
}

function toggleShuffle() {
  shuffleOn = !shuffleOn;
  saveSettings();
  updateModeButtons();
  toast(shuffleOn ? "Shuffle on" : "Shuffle off");
}

function cycleRepeat() {
  repeatMode = repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
  saveSettings();
  updateModeButtons();
  toast({ off: "Repeat off", all: "Repeat all", one: "Repeat one" }[repeatMode]);
}

// Audio element events
audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);
audio.addEventListener("timeupdate", updateProgress);

audio.addEventListener("loadedmetadata", () => {
  if (currentSongId && isFinite(audio.duration)) {
    durations[currentSongId] = audio.duration;
    updateDurationLabels(currentSongId);
  }
  updateProgress();
});

audio.addEventListener("playing", () => {
  errorStreak = 0;
  // Save to "Recently played" once per song start
  if (currentSongId && currentSongId !== lastRecordedId) {
    lastRecordedId = currentSongId;
    addToRecent(currentSongId);
  }
});

audio.addEventListener("ended", () => {
  if (repeatMode === "one") {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } else {
    playNext(true);
  }
});

audio.addEventListener("error", () => {
  if (!currentSongId) return;
  const failedId = currentSongId;
  const failedSong = getSong(failedId);
  toast("Could not play \"" + (failedSong ? failedSong.title : "this song") + "\"");
  errorStreak++;
  // Try the next song, but give up if every song in the queue has failed
  if (queue.length > 1 && errorStreak < queue.length) {
    setTimeout(() => {
      if (currentSongId === failedId) playNext(false);
    }, 700);
  } else {
    audio.pause(); // nothing playable: make the button show Play again
    errorStreak = 0;
  }
});

/* =====================================================
   7. PLAYER BAR
   ===================================================== */
function updatePlayerUI() {
  const song = getSong(currentSongId);
  const cover = $("player-cover");
  if (song) {
    cover.src = song.cover;
    $("player-title").textContent = song.title;
    $("player-artist").textContent = song.artist;
    document.title = song.title + " - " + song.artist + " | Melody 2.0";
  } else {
    cover.removeAttribute("src");
    $("player-title").textContent = "Nothing playing";
    $("player-artist").textContent = "Pick a song to start";
    document.title = "Melody 2.0";
    progressRange.value = 0;
    progressRange.style.setProperty("--fill", "0%");
    $("current-time").textContent = "0:00";
    $("total-time").textContent = "0:00";
  }
  const liked = song ? likedIds.includes(song.id) : false;
  $("player-like").classList.toggle("liked", liked);
  $("player-like").setAttribute("aria-pressed", liked);
  updatePlayButton();
}

function updatePlayButton() {
  const playing = Boolean(currentSongId) && !audio.paused;
  playBtn.innerHTML = icon(playing ? "pause" : "play");
  playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
}

function updateModeButtons() {
  const shuffleBtn = $("shuffle-btn");
  shuffleBtn.classList.toggle("active", shuffleOn);
  shuffleBtn.setAttribute("aria-pressed", shuffleOn);
  shuffleBtn.title = "Shuffle: " + (shuffleOn ? "on" : "off");

  const repeatBtn = $("repeat-btn");
  repeatBtn.innerHTML = icon(repeatMode === "one" ? "repeatOne" : "repeat");
  repeatBtn.classList.toggle("active", repeatMode !== "off");
  repeatBtn.setAttribute("aria-pressed", repeatMode !== "off");
  repeatBtn.title = "Repeat: " + repeatMode;
}

function updateProgress() {
  const duration = audio.duration;
  const hasDuration = isFinite(duration) && duration > 0;
  const percent = hasDuration ? (audio.currentTime / duration) * 100 : 0;
  progressRange.value = percent * 10;
  progressRange.style.setProperty("--fill", percent + "%");
  $("current-time").textContent = formatTime(audio.currentTime);
  $("total-time").textContent = hasDuration ? formatTime(duration) : "0:00";
}

function updateVolumeUI() {
  const level = audio.muted ? 0 : audio.volume;
  volumeRange.value = level * 100;
  volumeRange.style.setProperty("--fill", level * 100 + "%");
  $("mute-btn").innerHTML = icon(level === 0 ? "volumeMute" : "volume");
  $("mute-btn").setAttribute("aria-label", level === 0 ? "Unmute" : "Mute");
}

function toggleMute() {
  audio.muted = !audio.muted;
  if (!audio.muted && audio.volume === 0) audio.volume = 0.5;
  saveSettings();
  updateVolumeUI();
}

// Highlight the playing song in whatever list is on screen
function highlightCurrent() {
  document.querySelectorAll("[data-song-id]").forEach((element) => {
    if (element.classList.contains("song-row") || element.classList.contains("card")) {
      element.classList.toggle("playing", element.dataset.songId === currentSongId);
    }
  });
}

/* ----- Song lengths -----
   The starter songs have no length written in the array, so we ask the
   browser for it once (preload="metadata") and show it in the lists. */
function durationText(song) {
  return durations[song.id] ? formatTime(durations[song.id]) : "-:--";
}

function updateDurationLabels(songId) {
  document.querySelectorAll('[data-duration-for="' + songId + '"]').forEach((label) => {
    label.textContent = formatTime(durations[songId]);
  });
}

function loadAllDurations() {
  library.forEach((song) => {
    if (!song.src || durations[song.id] || durationRequested[song.id]) return;
    durationRequested[song.id] = true;
    const probe = new Audio();
    probe.preload = "metadata";
    probe.addEventListener("loadedmetadata", () => {
      if (isFinite(probe.duration)) {
        durations[song.id] = probe.duration;
        updateDurationLabels(song.id);
      }
    });
    probe.src = song.src;
  });
}

/* =====================================================
   8. LIKES, RECENTLY PLAYED AND PLAYLISTS
   ===================================================== */
function toggleLike(songId) {
  const song = getSong(songId);
  if (!song) return;
  if (likedIds.includes(songId)) {
    likedIds = likedIds.filter((id) => id !== songId);
    toast("Removed from Liked Songs");
  } else {
    likedIds.unshift(songId);
    toast("Added to Liked Songs");
  }
  save(KEY_LIKED, likedIds);
  updatePlayerUI();
  refreshView();
}

function addToRecent(songId) {
  recentIds = recentIds.filter((id) => id !== songId); // no duplicates
  recentIds.unshift(songId);
  recentIds = recentIds.slice(0, 20);
  save(KEY_RECENT, recentIds);
  if (view.name === "home" || view.name === "recent") refreshView();
}

function savePlaylists() {
  save(KEY_PLAYLISTS, playlists);
  renderSidebarPlaylists();
}

function getPlaylist(id) {
  return playlists.find((playlist) => playlist.id === id) || null;
}

function validatePlaylistName(name, ignoreId) {
  const clean = name.trim();
  if (!clean) return "Please enter a name.";
  const duplicate = playlists.some((playlist) => playlist.id !== ignoreId && playlist.name.toLowerCase() === clean.toLowerCase());
  if (duplicate) return "You already have a playlist with that name.";
  return "";
}

function addSongToPlaylist(playlistId, songId) {
  const playlist = getPlaylist(playlistId);
  const song = getSong(songId);
  if (!playlist || !song) return;
  if (playlist.songIds.includes(songId)) {
    toast("Already in \"" + playlist.name + "\"");
    return;
  }
  playlist.songIds.push(songId);
  savePlaylists();
  toast("Added to \"" + playlist.name + "\"");
  refreshView();
}

function removeSongFromPlaylist(playlistId, songId) {
  const playlist = getPlaylist(playlistId);
  if (!playlist) return;
  playlist.songIds = playlist.songIds.filter((id) => id !== songId);
  savePlaylists();
  toast("Removed from \"" + playlist.name + "\"");
  refreshView();
}

// Asks for a name; if songId is given, that song is added to the new playlist
function openCreatePlaylist(songId) {
  openModal({
    title: "Create playlist",
    message: "Give your playlist a name.",
    input: "",
    placeholder: "My playlist",
    confirmLabel: "Create",
    onConfirm: (value) => {
      const error = validatePlaylistName(value);
      if (error) return error;
      const playlist = { id: "pl" + Date.now(), name: value.trim(), songIds: [] };
      if (songId) playlist.songIds.push(songId);
      playlists.push(playlist);
      savePlaylists();
      toast(songId ? "Playlist created and song added" : "Playlist created");
      if (songId) {
        refreshView();
      } else {
        setView("playlist", playlist.id);
      }
    }
  });
}

function openRenamePlaylist(playlistId) {
  const playlist = getPlaylist(playlistId);
  if (!playlist) return;
  openModal({
    title: "Rename playlist",
    input: playlist.name,
    confirmLabel: "Save",
    onConfirm: (value) => {
      const error = validatePlaylistName(value, playlistId);
      if (error) return error;
      playlist.name = value.trim();
      savePlaylists();
      toast("Playlist renamed");
      refreshView();
    }
  });
}

function openDeletePlaylist(playlistId) {
  const playlist = getPlaylist(playlistId);
  if (!playlist) return;
  openModal({
    title: "Delete playlist?",
    message: '"' + playlist.name + '" will be deleted. The songs stay in your library.',
    confirmLabel: "Delete",
    danger: true,
    onConfirm: () => {
      playlists = playlists.filter((item) => item.id !== playlistId);
      savePlaylists();
      toast("Playlist deleted");
      if (view.name === "playlist" && view.param === playlistId) {
        setView("library");
      } else {
        refreshView();
      }
    }
  });
}

/* =====================================================
   9. DRAWING THE PAGES
   Each render function returns a string of HTML.
   ===================================================== */
function songRowHTML(song, options) {
  options = options || {};
  const title = escapeHTML(song.title);
  const liked = likedIds.includes(song.id);
  const missing = song.isLocal && !song.src;
  let extra = "";
  if (options.playlistId) {
    extra = '<button class="icon-btn" data-action="remove-from-playlist" data-playlist-id="' + options.playlistId +
            '" title="Remove from playlist" aria-label="Remove ' + title + ' from playlist">' + icon("trash") + "</button>";
  } else if (options.allowDelete && song.isLocal) {
    extra = '<button class="icon-btn" data-action="remove-local" title="Remove uploaded song" aria-label="Remove ' +
            title + ' from library">' + icon("trash") + "</button>";
  }
  const classes = "song-row" + (song.id === currentSongId ? " playing" : "") + (missing ? " missing" : "") + (extra ? " has-extra" : "");

  return '<div class="' + classes + '" data-song-id="' + song.id + '">' +
    '<button class="row-cover" data-action="play" aria-label="Play ' + title + '">' +
      '<img src="' + song.cover + '" alt=""><span class="row-cover-overlay">' + icon("play") + "</span></button>" +
    '<div class="row-info"><span class="row-title">' + title + "</span>" +
      '<span class="row-artist">' + escapeHTML(song.artist) + (missing ? ' <span class="badge">Re-select file</span>' : "") + "</span></div>" +
    '<span class="row-album">' + escapeHTML(song.album) + "</span>" +
    '<button class="icon-btn like-btn' + (liked ? " liked" : "") + '" data-action="like" aria-pressed="' + liked +
      '" title="' + (liked ? "Remove from Liked Songs" : "Add to Liked Songs") + '" aria-label="Like ' + title + '">' + icon("heart") + "</button>" +
    '<button class="icon-btn" data-action="add-to-playlist" title="Add to playlist" aria-label="Add ' + title + ' to a playlist">' + icon("plus") + "</button>" +
    '<span class="row-duration" data-duration-for="' + song.id + '">' + durationText(song) + "</span>" +
    extra + "</div>";
}

function songListHTML(songs, options) {
  const ids = songs.map((song) => song.id).join(",");
  return '<div class="song-list" data-queue="' + ids + '">' +
    songs.map((song) => songRowHTML(song, options)).join("") + "</div>";
}

function songCardHTML(song) {
  return '<button class="card' + (song.id === currentSongId ? " playing" : "") + '" data-action="play" data-song-id="' + song.id + '">' +
    '<span class="card-cover"><img src="' + song.cover + '" alt=""><span class="card-play">' + icon("play") + "</span></span>" +
    '<span class="card-title">' + escapeHTML(song.title) + "</span>" +
    '<span class="card-sub">' + escapeHTML(song.artist) + "</span></button>";
}

function songCardsHTML(songs) {
  return '<div class="card-grid" data-queue="' + songs.map((song) => song.id).join(",") + '">' +
    songs.map(songCardHTML).join("") + "</div>";
}

function playlistColor(playlist) {
  return TILE_COLORS[hashString(playlist.id) % TILE_COLORS.length];
}

function playlistCardsHTML() {
  return '<div class="card-grid">' + playlists.map((playlist) => {
    return '<button class="card" data-action="nav" data-view="playlist" data-param="' + playlist.id + '">' +
      '<span class="card-cover"><span class="tile" style="background:' + playlistColor(playlist) + '">' + icon("music") + "</span></span>" +
      '<span class="card-title">' + escapeHTML(playlist.name) + "</span>" +
      '<span class="card-sub">' + plural(playlist.songIds.length, "song") + "</span></button>";
  }).join("") + "</div>";
}

function moodCardsHTML() {
  return '<div class="mood-grid">' + MOODS.map((mood) => {
    return '<button class="mood-card" style="background:' + mood.color + '" data-action="nav" data-view="mood" data-param="' +
      escapeHTML(mood.name) + '">' + escapeHTML(mood.name) + icon("music") + "</button>";
  }).join("") + "</div>";
}

function sectionHTML(title, bodyHTML, seeAllView) {
  const seeAll = seeAllView
    ? '<button class="link-btn" data-action="nav" data-view="' + seeAllView + '">See all</button>'
    : "";
  return '<section class="section"><div class="section-head"><h2>' + title + "</h2>" + seeAll + "</div>" + bodyHTML + "</section>";
}

function emptyStateHTML(iconName, title, text, buttonHTML) {
  return '<div class="empty-state">' + icon(iconName) + "<h3>" + title + "</h3><p>" + text + "</p>" + (buttonHTML || "") + "</div>";
}

const ADD_MUSIC_BUTTON = '<button class="btn btn-primary" data-action="add-music">' + icon("upload") + " Add Music</button>";
const CREATE_PLAYLIST_BUTTON = '<button class="btn btn-primary" data-action="create-playlist">' + icon("plus") + " Create Playlist</button>";

// Header used by Liked, Recent, Playlist, Mood and Library pages
function listHeaderHTML(options) {
  const queueIds = playableIds(options.songs).join(",");
  const playAll = queueIds
    ? '<button class="btn btn-primary" data-action="play-all" data-queue="' + queueIds + '">' + icon("play") + " Play all</button>"
    : "";
  return '<header class="list-header">' +
    '<div class="list-art" style="background:' + options.color + '">' + icon(options.icon) + "</div>" +
    "<div>" +
      '<p class="eyebrow">' + options.eyebrow + "</p>" +
      "<h1>" + escapeHTML(options.title) + "</h1>" +
      '<p class="muted">' + options.subtitle + "</p>" +
      '<div class="list-actions">' + playAll + (options.buttons || "") + "</div>" +
    "</div></header>";
}

function renderHome() {
  if (library.length === 0) {
    return '<section class="hero"><h1>Welcome to Melody 2.0</h1></section>' +
      emptyStateHTML("music", "Your library is empty", "Add songs from your device to get started.", ADD_MUSIC_BUTTON);
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  let featured = library.filter((song) => song.featured).slice(0, 6);
  if (featured.length === 0) featured = library.slice(0, 6);
  let popular = library.filter((song) => song.popular).slice(0, 8);
  if (popular.length === 0) popular = library.slice(0, 8);
  const recent = recentIds.map(getSong).filter(Boolean).slice(0, 6);
  const liked = likedIds.map(getSong).filter(Boolean);

  let html = '<section class="hero"><h1>' + greeting + "</h1>" +
    "<p>Welcome to Melody 2.0. Pick something to play, or add your own music.</p>" +
    '<div class="list-actions"><button class="btn btn-primary" data-action="shuffle-all">' + icon("shuffle") + " Play something</button>" +
    '<button class="btn btn-outline" data-action="add-music">' + icon("upload") + " Add Music</button></div></section>";

  html += sectionHTML("Featured music", songCardsHTML(featured));

  html += sectionHTML("Recently played",
    recent.length
      ? songCardsHTML(recent)
      : emptyStateHTML("clock", "Nothing played yet", "Songs you play will show up here."),
    recent.length ? "recent" : "");

  html += sectionHTML("Popular tracks", songListHTML(popular));
  html += sectionHTML("Browse by mood", moodCardsHTML());

  html += sectionHTML("Your playlists",
    playlists.length
      ? playlistCardsHTML()
      : emptyStateHTML("music", "No playlists yet", "Create a playlist to collect your favourite songs.", CREATE_PLAYLIST_BUTTON),
    playlists.length ? "library" : "");

  html += sectionHTML("Liked songs",
    liked.length
      ? songListHTML(liked.slice(0, 5))
      : emptyStateHTML("heart", "No liked songs yet", "Tap the heart beside any song to save it here."),
    liked.length ? "liked" : "");

  return html;
}

function renderSearch() {
  const query = searchQuery.trim().toLowerCase();
  if (!query) {
    return '<section class="hero"><h1>Search</h1><p>Type a song title, artist or album in the search bar above.</p></section>' +
      sectionHTML("Browse by mood", moodCardsHTML());
  }
  const results = library.filter((song) => {
    return song.title.toLowerCase().includes(query) ||
           song.artist.toLowerCase().includes(query) ||
           song.album.toLowerCase().includes(query);
  });
  const heading = '<section class="hero"><h1>Results for "' + escapeHTML(searchQuery.trim()) + '"</h1><p>' +
    plural(results.length, "song") + " found</p></section>";
  if (results.length === 0) {
    return heading + emptyStateHTML("search", "No results found",
      "We could not find anything for \"" + escapeHTML(searchQuery.trim()) + "\". Try a different title, artist or album.");
  }
  return heading + songListHTML(results);
}

function renderLibrary() {
  const missingCount = library.filter((song) => song.isLocal && !song.src).length;
  let html = listHeaderHTML({
    eyebrow: "Library", title: "Your Library", color: "#1f6f5c", icon: "library", songs: library,
    subtitle: plural(library.length, "song") + " - " + plural(playlists.length, "playlist"),
    buttons: '<button class="btn btn-outline" data-action="add-music">' + icon("upload") + " Add Music</button>" +
             '<button class="btn btn-outline" data-action="create-playlist">' + icon("plus") + " Create Playlist</button>"
  });

  if (missingCount > 0) {
    html += '<div class="notice"><span>' + plural(missingCount, "uploaded song") +
      " need their files selected again after the page was refreshed.</span>" +
      '<button class="btn btn-outline" data-action="add-music">Select files</button></div>';
  }

  html += sectionHTML("Playlists",
    playlists.length
      ? playlistCardsHTML()
      : emptyStateHTML("music", "No playlists yet", "Create one to organise your songs.", CREATE_PLAYLIST_BUTTON));

  html += sectionHTML("All songs",
    library.length
      ? songListHTML(library, { allowDelete: true })
      : emptyStateHTML("music", "No songs yet", "Add songs from your device.", ADD_MUSIC_BUTTON));
  return html;
}

function renderLiked() {
  const songs = likedIds.map(getSong).filter(Boolean);
  let html = listHeaderHTML({
    eyebrow: "Playlist", title: "Liked Songs", color: "#5b21b6", icon: "heart", songs: songs,
    subtitle: plural(songs.length, "song")
  });
  html += songs.length
    ? '<section class="section">' + songListHTML(songs) + "</section>"
    : '<section class="section">' + emptyStateHTML("heart", "No liked songs yet", "Tap the heart beside any song to save it here.") + "</section>";
  return html;
}

function renderRecent() {
  const songs = recentIds.map(getSong).filter(Boolean);
  let html = listHeaderHTML({
    eyebrow: "History", title: "Recently Played", color: "#0e7490", icon: "clock", songs: songs,
    subtitle: plural(songs.length, "song"),
    buttons: songs.length ? '<button class="btn btn-outline" data-action="clear-recent">' + icon("trash") + " Clear history</button>" : ""
  });
  html += songs.length
    ? '<section class="section">' + songListHTML(songs) + "</section>"
    : '<section class="section">' + emptyStateHTML("clock", "Nothing played yet", "Songs you play will show up here.") + "</section>";
  return html;
}

function renderPlaylist(playlistId) {
  const playlist = getPlaylist(playlistId);
  if (!playlist) return renderHome();
  const songs = playlist.songIds.map(getSong).filter(Boolean);
  let html = listHeaderHTML({
    eyebrow: "Playlist", title: playlist.name, color: playlistColor(playlist), icon: "music", songs: songs,
    subtitle: plural(songs.length, "song"),
    buttons: '<button class="btn btn-outline" data-action="rename-playlist" data-playlist-id="' + playlist.id + '">' + icon("edit") + " Rename</button>" +
             '<button class="btn btn-outline" data-action="delete-playlist" data-playlist-id="' + playlist.id + '">' + icon("trash") + " Delete</button>"
  });
  html += songs.length
    ? '<section class="section">' + songListHTML(songs, { playlistId: playlist.id }) + "</section>"
    : '<section class="section">' + emptyStateHTML("music", "This playlist is empty",
        "Use the + button beside any song to add it here.",
        '<button class="btn btn-primary" data-action="nav" data-view="search">' + icon("search") + " Find songs</button>") + "</section>";
  return html;
}

function renderMood(moodName) {
  const mood = MOODS.find((item) => item.name === moodName);
  if (!mood) return renderHome();
  const songs = library.filter((song) => song.moods && song.moods.includes(moodName));
  let html = listHeaderHTML({
    eyebrow: "Mood", title: mood.name, color: mood.color, icon: "music", songs: songs,
    subtitle: plural(songs.length, "song")
  });
  html += songs.length
    ? '<section class="section">' + songListHTML(songs) + "</section>"
    : '<section class="section">' + emptyStateHTML("music", "No songs in this mood yet",
        "Add a moods list to a song in script.js to see it here.") + "</section>";
  return html;
}

function renderSidebarPlaylists() {
  const box = $("sidebar-playlists");
  if (playlists.length === 0) {
    box.innerHTML = '<p class="side-empty">No playlists yet</p>';
  } else {
    box.innerHTML = playlists.map((playlist) => {
      return '<button class="side-playlist" data-action="nav" data-view="playlist" data-param="' + playlist.id + '">' +
        icon("music") + "<span>" + escapeHTML(playlist.name) + "</span></button>";
    }).join("");
  }
  updateNavActive();
}

function updateNavActive() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    const active = button.dataset.view === view.name;
    button.classList.toggle("active", active);
    if (active) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
  document.querySelectorAll(".side-playlist").forEach((button) => {
    button.classList.toggle("active", view.name === "playlist" && button.dataset.param === view.param);
  });
}

// Redraws the current page but keeps the scroll position
function refreshView() {
  const scrollTop = mainEl.scrollTop;
  switch (view.name) {
    case "search":   viewEl.innerHTML = renderSearch(); break;
    case "library":  viewEl.innerHTML = renderLibrary(); break;
    case "liked":    viewEl.innerHTML = renderLiked(); break;
    case "recent":   viewEl.innerHTML = renderRecent(); break;
    case "playlist":
      if (!getPlaylist(view.param)) view = { name: "home", param: null };
      viewEl.innerHTML = view.name === "playlist" ? renderPlaylist(view.param) : renderHome();
      break;
    case "mood":     viewEl.innerHTML = renderMood(view.param); break;
    default:         viewEl.innerHTML = renderHome();
  }
  mainEl.scrollTop = scrollTop;
  updateNavActive();
}

function setView(name, param) {
  view = { name: name, param: param || null };
  if (name !== "search") {
    searchInput.value = "";
    searchQuery = "";
  }
  closeMenu();
  refreshView();
  mainEl.scrollTop = 0;
  if (name === "search") searchInput.focus();
}

/* =====================================================
   10. CLICKS, KEYBOARD SHORTCUTS AND START-UP
   ===================================================== */
function handleAction(element) {
  const action = element.dataset.action;
  const songElement = element.closest("[data-song-id]");
  const songId = songElement ? songElement.dataset.songId : null;

  switch (action) {
    case "nav":
      setView(element.dataset.view, element.dataset.param);
      break;

    case "play": {
      if (songId === currentSongId) {
        togglePlay();
        break;
      }
      const queueElement = element.closest("[data-queue]");
      playSong(songId, queueElement ? queueElement.dataset.queue.split(",") : null);
      break;
    }

    case "play-all": {
      const ids = element.dataset.queue.split(",");
      const startId = shuffleOn ? ids[Math.floor(Math.random() * ids.length)] : ids[0];
      playSong(startId, ids);
      break;
    }

    case "shuffle-all":
      shuffleOn = true;
      saveSettings();
      updateModeButtons();
      startFromLibrary();
      break;

    case "like":
      toggleLike(songId);
      break;

    case "add-to-playlist": {
      // The button in the player bar has no song row, so it uses the current song
      const targetId = songId || currentSongId;
      if (!targetId) {
        toast("Play a song first");
        break;
      }
      openPlaylistMenu(targetId, element);
      break;
    }

    case "menu-add": {
      const targetId = menuSongId;
      addSongToPlaylist(element.dataset.playlistId, targetId);
      closeMenu();
      break;
    }

    case "menu-new": {
      const targetId = menuSongId;
      closeMenu();
      openCreatePlaylist(targetId);
      break;
    }

    case "remove-from-playlist":
      removeSongFromPlaylist(element.dataset.playlistId, songId);
      break;

    case "remove-local":
      removeLocalSong(songId);
      break;

    case "create-playlist":
      openCreatePlaylist(null);
      break;

    case "rename-playlist":
      openRenamePlaylist(element.dataset.playlistId);
      break;

    case "delete-playlist":
      openDeletePlaylist(element.dataset.playlistId);
      break;

    case "add-music":
      fileInput.click();
      break;

    case "clear-recent":
      recentIds = [];
      lastRecordedId = null;
      save(KEY_RECENT, recentIds);
      toast("History cleared");
      refreshView();
      break;
  }
}

document.addEventListener("click", (event) => {
  // Close the playlist dropdown when clicking anywhere else
  if (!event.target.closest("#playlist-menu") && !event.target.closest('[data-action="add-to-playlist"]')) {
    closeMenu();
  }

  const actionElement = event.target.closest("[data-action]");
  if (actionElement) {
    handleAction(actionElement);
    return;
  }

  // Clicking anywhere else on a song row plays that song
  const row = event.target.closest(".song-row");
  if (row) {
    const playButton = row.querySelector('[data-action="play"]');
    if (playButton) playButton.click();
  }
});

// Search bar: results update as the user types
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  if (view.name !== "search") view = { name: "search", param: null };
  refreshView();
});

$("search-form").addEventListener("submit", (event) => event.preventDefault());

// Modal
$("modal-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!modalHandler) return;
  const error = modalHandler($("modal-input").value);
  if (error) {
    $("modal-error").textContent = error;
    return;
  }
  closeModal();
});
$("modal-cancel").addEventListener("click", closeModal);
$("modal").addEventListener("click", (event) => {
  if (event.target === $("modal")) closeModal();
});

// Player buttons
playBtn.addEventListener("click", togglePlay);
$("next-btn").addEventListener("click", () => playNext(false));
$("prev-btn").addEventListener("click", playPrevious);
$("shuffle-btn").addEventListener("click", toggleShuffle);
$("repeat-btn").addEventListener("click", cycleRepeat);
$("mute-btn").addEventListener("click", toggleMute);
$("player-like").addEventListener("click", () => {
  if (!currentSongId) {
    toast("Play a song first");
    return;
  }
  toggleLike(currentSongId);
});

// Progress bar: dragging jumps to that point in the song
progressRange.addEventListener("input", () => {
  if (!currentSongId || !isFinite(audio.duration)) return;
  audio.currentTime = (progressRange.value / 1000) * audio.duration;
  updateProgress();
});

volumeRange.addEventListener("input", () => {
  audio.volume = volumeRange.value / 100;
  audio.muted = false;
  saveSettings();
  updateVolumeUI();
});

// Let the keyboard shortcuts work again after using a slider
[progressRange, volumeRange].forEach((slider) => {
  slider.addEventListener("change", () => slider.blur());
});

fileInput.addEventListener("change", handleFilesChosen);

// Close the dropdown if the window changes
window.addEventListener("resize", closeMenu);
mainEl.addEventListener("scroll", closeMenu);

// Keyboard shortcuts: Space, Left Arrow, Right Arrow (Escape closes popups)
function shortcutShouldBeIgnored(event) {
  const tag = event.target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
         !$("modal").hidden || Boolean(event.target.closest("#playlist-menu"));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!$("modal").hidden) closeModal();
    closeMenu();
    return;
  }
  if (shortcutShouldBeIgnored(event) || event.ctrlKey || event.metaKey || event.altKey) return;

  if (event.code === "Space") {
    event.preventDefault(); // stops the page from scrolling or clicking a focused button
    togglePlay();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    playNext(false);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    playPrevious();
  }
});

// Some browsers click a focused button when Space is released
document.addEventListener("keyup", (event) => {
  if (event.code === "Space" && !shortcutShouldBeIgnored(event) && event.target.tagName === "BUTTON") {
    event.preventDefault();
  }
});

// ----- Start-up -----
function init() {
  document.querySelectorAll("[data-icon]").forEach((element) => {
    element.innerHTML = icon(element.dataset.icon);
  });
  $("player-like").innerHTML = icon("heart");
  $("player-playlist").innerHTML = icon("plus");
  $("prev-btn").innerHTML = icon("prev");
  $("next-btn").innerHTML = icon("next");
  $("shuffle-btn").innerHTML = icon("shuffle");

  audio.volume = typeof settings.volume === "number" ? Math.min(1, Math.max(0, settings.volume)) : 0.8;

  buildLibrary();
  // Remove saved ids that no longer match a song (for example, a deleted starter song)
  likedIds = likedIds.filter((id) => getSong(id));
  recentIds = recentIds.filter((id) => getSong(id));
  playlists.forEach((playlist) => {
    playlist.songIds = playlist.songIds.filter((id) => getSong(id));
  });

  updateModeButtons();
  updateVolumeUI();
  updatePlayerUI();
  renderSidebarPlaylists();
  refreshView();
  loadAllDurations();
}

init();
