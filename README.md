# Melody 2.0 - Spotify-Inspired Music Player

## 1. Project Introduction

Melody 2.0 is a music player website with a dark, Spotify-inspired look. It has a sidebar for navigation, a main area for browsing songs, and a music player that stays fixed at the bottom of the page.

**Melody 2.0 is a frontend-only project. It does not use a database or any backend/server.** Everything runs inside the browser, and all saved data is kept in the browser's `localStorage`.

This is a first-year B.Tech Computer Science frontend mini-project.

## 2. Project Objectives

- Build a complete, realistic web interface using only HTML, CSS and JavaScript.
- Practise DOM manipulation, events, arrays and objects in JavaScript.
- Use the HTML5 `Audio` element to play music.
- Save user data in the browser using `localStorage`.
- Design a responsive layout that works on laptops, tablets and phones.
- Keep the code simple enough to read, modify and explain in a viva.

## 3. Technologies Used

| Technology | Used for |
|---|---|
| HTML5 | Page structure (semantic elements such as `aside`, `main`, `header`, `footer`, `nav`) |
| CSS3 | Dark theme, grid and flexbox layout, hover effects, responsive media queries |
| Vanilla JavaScript | All app logic: playback, search, playlists, likes, upload |
| HTML5 Audio | Playing songs |
| `localStorage` | Saving likes, playlists, recent songs and settings |

No frameworks, libraries, build tools, backend or database are used.

## 4. Features

- **Playback:** play/pause, next, previous, auto-play of the next song, seek bar, current time and total duration, volume slider, mute/unmute.
- **Shuffle and repeat:** shuffle on/off; repeat off, repeat all and repeat one.
- **Local music upload:** add MP3 (and other browser-supported audio) files from your device. Title, artist and album are read from the MP3's ID3 tag when possible; otherwise the file name is used as the title.
- **Search:** results update as you type, by song title, artist or album, with an empty state when nothing matches.
- **Liked Songs:** like and unlike songs; they are saved after refresh.
- **Playlists:** create, rename, delete (with confirmation), open, add songs, remove songs and play all.
- **Recently Played:** records songs automatically, without duplicates.
- **Mood categories:** Chill, Workout, Romantic, Focus, Party, Sad, Bollywood and English Hits.
- **Extras:** keyboard shortcuts, toast notifications, empty states, a welcome screen if the library is empty, and graceful handling of audio files that fail to load.
- **Responsive design:** the sidebar becomes an icon rail on tablets and a bottom tab bar on phones.

### Keyboard shortcuts

| Key | Action |
|---|---|
| Space | Play / Pause |
| Left Arrow | Previous song |
| Right Arrow | Next song |
| Escape | Close a popup or menu |

Shortcuts are ignored while you are typing in a text box.

## 5. Folder Structure

```
Melody_2.0/
│
├── index.html    -> page structure
├── style.css     -> all styling
├── script.js     -> all functionality (starter songs are at the top)
└── README.md     -> this file
```

## 6. How to Run the Project

1. Unzip the project folder.
2. Double-click `index.html` (or right-click and choose *Open with* a browser such as Chrome, Edge or Firefox).
3. That's it. No installation or server is needed.

**Internet connection:** the starter demo songs are streamed from the internet (SoundHelix demo music), so you need to be online to play them. Songs you upload from your device work offline.

## 7. How to Add Local MP3 Files

### Method 1: Add Music button (easiest)

1. Click **Add Music** (top bar, Library page or Home page).
2. Choose one or more audio files from your computer.
3. The songs appear in **Your Library**. You can play them, like them and add them to playlists.

Your files are **not uploaded anywhere**. The browser just opens them locally.

> **Important:** a browser cannot keep your files after the page is refreshed. The song's name, likes and playlist entries are remembered, but you must click **Add Music** and select the same file(s) again before they can be played. Songs waiting for this are marked **Re-select file**, and the Library page shows a notice. Once you re-select the same file, everything reconnects automatically.

### Method 2: Add songs to the starter list (permanent)

1. Create a folder called `music` next to `index.html` and copy your MP3 into it.
2. Open `script.js` and find the `starterSongs` array at the top.
3. Copy one line and edit it:

```js
{ id: "s17", title: "My Song", artist: "Me", album: "My Album", color: "#1f6f5c",
  moods: ["Chill"], featured: false, popular: false, src: "music/my-song.mp3" },
```

- `id` must be unique (letters, numbers and `-` only).
- `moods` must use names from the `MOODS` list (for example `"Chill"` or `"Party"`).
- Album artwork is drawn automatically from `color`. To use your own image add `cover: "images/my-cover.jpg"`.

Songs added this way work after refresh without re-selecting them.

## 8. How localStorage Is Used

`localStorage` stores small pieces of text in the browser. Melody 2.0 saves these keys:

| Key | What it stores |
|---|---|
| `melody2_liked` | List of liked song ids |
| `melody2_playlists` | Playlists (name and list of song ids) |
| `melody2_recent` | Recently played song ids (latest 20) |
| `melody2_local_songs` | Title, artist and album of uploaded songs (not the audio file) |
| `melody2_settings` | Volume, shuffle and repeat settings |

To reset the app, clear the site data in your browser or run `localStorage.clear()` in the browser console.

## 9. Project Limitations

- Frontend only: no accounts, no database, no server. Data lives only in one browser on one device.
- Uploaded audio files must be selected again after a page refresh (browser security rule).
- Starter songs need an internet connection, and their titles, artists and mood labels are placeholders for the SoundHelix demo tracks.
- Tags are read only from MP3 files with ID3v2.3 or ID3v2.4 tags. Other formats use the file name.
- Uploaded songs have no mood labels, so they do not appear in mood categories.
- Embedded cover art in MP3 files is not read; a generated cover is used.
- `localStorage` is limited in size and can be cleared by the user or by private browsing mode.
- Browsers differ in which audio formats they can play.

## 10. Possible Future Improvements

- Save uploaded audio files with IndexedDB so they survive a refresh.
- Read embedded album art from MP3 files.
- Drag and drop to reorder playlist songs.
- A "Play queue" panel and a sleep timer.
- Light theme and theme switching.
- Add lyrics or an audio visualiser.
- Connect to a real backend and database for accounts and cloud-synced playlists.
