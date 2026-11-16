# Melody — Spotify-inspired frontend mini project

## Project details
- **Project:** Melody (Spotify-inspired music player)
- **Technologies:** HTML, CSS and JavaScript
- **Database/backend:** Not used
- **Entry file:** `index.html`

## How to run
1. Download and extract the ZIP file.
2. Keep `index.html`, `style.css` and `script.js` in the same folder.
3. Double-click `index.html` to open it in a browser.
4. An internet connection is needed for the demo audio tracks and Google Font.

## Features
- Spotify-inspired dark interface
- Home, Search and Your Library navigation
- Search songs by title, artist or album
- Playlist-style filters: Chill Mix, Daily Vibes and Focus Mode
- Play, pause, next and previous controls
- Seek/progress bar and volume control
- Shuffle and repeat
- Like songs and view the Liked Songs collection
- Responsive layout for smaller screens

## Important note about audio
The project uses publicly accessible SoundHelix demo MP3 files as placeholder audio. Replace the `url` values in the `songs` array in `script.js` with audio files you are permitted to use. For local audio, place MP3 files in an `audio` folder and use paths such as `audio/song1.mp3`.

## Suggested viva explanation
- **HTML** creates the sidebar, song list, search box and music player.
- **CSS** handles the dark theme, layout, cards, hover effects and responsive design.
- **JavaScript** stores the song list in an array, creates song cards, handles search and playlist filters, and controls the HTML audio element.
- No database is used. The song data is stored in a JavaScript array.
