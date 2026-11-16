const songs = [
    { title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", time: "4:03", color: "linear-gradient(135deg,#243f8c,#f38b79)", icon: "🌃", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", tags: ["Chill Mix","Daily Vibes"] },
    { title: "Golden", artist: "Harry Styles", album: "Fine Line", time: "3:28", color: "linear-gradient(135deg,#e7a34b,#e85c4a)", icon: "☀", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", tags: ["Daily Vibes"] },
    { title: "Weightless", artist: "Marconi Union", album: "Ambient Transmissions", time: "5:12", color: "linear-gradient(135deg,#6d9d9d,#263f58)", icon: "☁", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", tags: ["Chill Mix","Focus Mode"] },
    { title: "Sunset Lover", artist: "Petit Biscuit", album: "Presence", time: "3:57", color: "linear-gradient(135deg,#ef8a65,#734b79)", icon: "🌅", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", tags: ["Chill Mix","Daily Vibes"] },
    { title: "The Nights", artist: "Avicii", album: "The Days / Nights", time: "2:56", color: "linear-gradient(135deg,#e5c66b,#4c8d9c)", icon: "🌄", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", tags: ["Daily Vibes"] },
    { title: "Space Song", artist: "Beach House", album: "Depression Cherry", time: "5:20", color: "linear-gradient(135deg,#5e4d91,#d28b9b)", icon: "🌌", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", tags: ["Chill Mix","Focus Mode"] },
    { title: "A Walk", artist: "Tycho", album: "Dive", time: "5:16", color: "linear-gradient(135deg,#4c9b87,#d3b46b)", icon: "🌿", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", tags: ["Focus Mode"] },
    { title: "Night Trouble", artist: "Petit Biscuit", album: "Presence", time: "3:44", color: "linear-gradient(135deg,#263d69,#a16a9a)", icon: "🌙", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", tags: ["Chill Mix"] }
];

const audio = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");
const progressBar = document.getElementById("progressBar");
const currentTimeText = document.getElementById("currentTime");
const durationText = document.getElementById("duration");
let currentIndex = -1;
let isPlaying = false;
let shuffle = false;
let repeat = false;
let likedSongs = [];
let currentFilter = "all";

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1900);
}

function renderQuickCards() {
    const cards = [
        { name: "Chill Mix", icon: "☁", color: "linear-gradient(135deg,#527b88,#b6c9c2)", filter: "Chill Mix" },
        { name: "Daily Vibes", icon: "☀", color: "linear-gradient(135deg,#c96d49,#e6bd74)", filter: "Daily Vibes" },
        { name: "Focus Mode", icon: "✦", color: "linear-gradient(135deg,#4d5b91,#9e9ac5)", filter: "Focus Mode" }
    ];
    document.getElementById("quickGrid").innerHTML = cards.map(card => `
        <button class="quick-card" data-filter="${card.filter}">
            <span class="cover" style="background:${card.color}">${card.icon}</span>
            <strong>${card.name}</strong><span class="quick-play">▶</span>
        </button>`).join("");
    document.querySelectorAll(".quick-card").forEach(card => card.addEventListener("click", () => playFiltered(card.dataset.filter)));
}

function renderTracks(list, container, showAll = false) {
    container.innerHTML = "";
    const shown = showAll ? list : list.slice(0, 6);
    if (shown.length === 0) {
        container.innerHTML = '<p class="empty-message">No songs found. Try another search.</p>';
        return;
    }
    shown.forEach(song => {
        const index = songs.indexOf(song);
        const row = document.createElement("div");
        row.className = "track-row" + (index === currentIndex ? " playing" : "");
        row.innerHTML = `
            <span class="track-number">${index === currentIndex && isPlaying ? "♫" : String(index + 1).padStart(2,"0")}</span>
            <div class="track-cover" style="background:${song.color}">${song.icon}</div>
            <div class="track-info"><strong>${song.title}</strong><small>${song.artist}</small></div>
            <span class="track-album">${song.album}</span>
            <div class="track-actions"><button class="track-like ${likedSongs.includes(index) ? "liked" : ""}" title="Like"> ${likedSongs.includes(index) ? "♥" : "♡"} </button><span class="track-time">${song.time}</span></div>`;
        row.addEventListener("click", event => {
            if (event.target.closest(".track-like")) {
                toggleLike(index);
                return;
            }
            playSong(index);
        });
        container.appendChild(row);
    });
}

function refreshLists() {
    renderTracks(songs, document.getElementById("trackList"));
    if (!document.getElementById("searchResults").classList.contains("hidden")) {
        runSearch(document.getElementById("searchInput").value);
    }
    if (!document.getElementById("librarySection").classList.contains("hidden")) {
        showLibrary(currentFilter);
    }
}

function playSong(index) {
    currentIndex = index;
    audio.src = songs[index].url;
    audio.load();
    audio.play().then(() => {
        isPlaying = true;
        updatePlayer();
    }).catch(() => {
        isPlaying = false;
        updatePlayer();
        showToast("Could not load this demo audio. Check your internet connection.");
    });
    updatePlayer();
}

function updatePlayer() {
    const song = songs[currentIndex];
    playButton.textContent = isPlaying ? "Ⅱ" : "▶";
    if (song) {
        document.getElementById("playerTitle").textContent = song.title;
        document.getElementById("playerArtist").textContent = song.artist;
        const cover = document.getElementById("playerCover");
        cover.textContent = song.icon;
        cover.style.background = song.color;
        document.getElementById("playerLike").textContent = likedSongs.includes(currentIndex) ? "♥" : "♡";
        document.getElementById("playerLike").classList.toggle("liked", likedSongs.includes(currentIndex));
    }
    refreshLists();
}

function togglePlay() {
    if (currentIndex === -1) {
        playSong(0);
    } else if (audio.paused) {
        audio.play().then(() => { isPlaying = true; updatePlayer(); });
    } else {
        audio.pause();
        isPlaying = false;
        updatePlayer();
    }
}

function nextSong() {
    if (currentIndex === -1) return playSong(0);
    let next = shuffle ? Math.floor(Math.random() * songs.length) : (currentIndex + 1) % songs.length;
    playSong(next);
}
function previousSong() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        playSong((currentIndex - 1 + songs.length) % songs.length);
    }
}
function toggleLike(index) {
    if (likedSongs.includes(index)) likedSongs = likedSongs.filter(item => item !== index);
    else likedSongs.push(index);
    updatePlayer();
    showToast(likedSongs.includes(index) ? "Added to Liked Songs" : "Removed from Liked Songs");
}
function playFiltered(filter) {
    const matching = songs.filter(song => song.tags.includes(filter));
    if (matching.length) playSong(songs.indexOf(matching[0]));
    showToast("Playing " + filter);
}
function showLibrary(filter) {
    currentFilter = filter || "all";
    document.getElementById("welcome").classList.add("hidden");
    document.getElementById("quickSection").classList.add("hidden");
    document.getElementById("musicSection").classList.add("hidden");
    document.getElementById("searchResults").classList.add("hidden");
    document.getElementById("librarySection").classList.remove("hidden");
    document.getElementById("libraryTitle").textContent = filter === "Liked Songs" ? "Liked Songs" : filter === "all" ? "Your Library" : filter;
    const list = filter === "Liked Songs" ? songs.filter((song, index) => likedSongs.includes(index)) :
        filter === "all" ? songs : songs.filter(song => song.tags.includes(filter));
    renderTracks(list, document.getElementById("libraryList"), true);
}
function showHome() {
    document.getElementById("welcome").classList.remove("hidden");
    document.getElementById("quickSection").classList.remove("hidden");
    document.getElementById("musicSection").classList.remove("hidden");
    document.getElementById("searchResults").classList.add("hidden");
    document.getElementById("librarySection").classList.add("hidden");
}
function runSearch(value) {
    const query = value.trim().toLowerCase();
    document.getElementById("welcome").classList.add("hidden");
    document.getElementById("quickSection").classList.add("hidden");
    document.getElementById("musicSection").classList.add("hidden");
    document.getElementById("librarySection").classList.add("hidden");
    document.getElementById("searchResults").classList.remove("hidden");
    document.getElementById("resultsTitle").textContent = query ? `Results for "${value.trim()}"` : "Explore all songs";
    const results = songs.filter(song => (song.title + " " + song.artist + " " + song.album).toLowerCase().includes(query));
    renderTracks(results, document.getElementById("resultsList"), true);
}

playButton.addEventListener("click", togglePlay);
document.getElementById("nextButton").addEventListener("click", nextSong);
document.getElementById("previousButton").addEventListener("click", previousSong);
document.getElementById("playerLike").addEventListener("click", () => { if (currentIndex !== -1) toggleLike(currentIndex); });
document.getElementById("shuffleButton").addEventListener("click", event => {
    shuffle = !shuffle;
    event.currentTarget.classList.toggle("selected", shuffle);
    showToast(shuffle ? "Shuffle is on" : "Shuffle is off");
});
document.getElementById("repeatButton").addEventListener("click", event => {
    repeat = !repeat;
    audio.loop = repeat;
    event.currentTarget.classList.toggle("selected", repeat);
    showToast(repeat ? "Repeat is on" : "Repeat is off");
});
document.getElementById("mixPlay").addEventListener("click", () => playSong(0));
document.getElementById("showAll").addEventListener("click", () => showLibrary("all"));
document.getElementById("showAllSongs").addEventListener("click", () => showLibrary("all"));
document.getElementById("addPlaylist").addEventListener("click", () => showToast("Playlist creation can be added as an extension."));
document.getElementById("premiumButton").addEventListener("click", () => showToast("This is a frontend demo — no subscription is needed."));
document.getElementById("searchInput").addEventListener("input", event => runSearch(event.target.value));
document.getElementById("searchInput").addEventListener("focus", () => {
    document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.page === "search"));
});
document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
    if (link.dataset.page === "home") showHome();
    if (link.dataset.page === "search") {
        document.getElementById("searchInput").focus();
        runSearch(document.getElementById("searchInput").value);
    }
    if (link.dataset.page === "library") showLibrary("all");
}));
document.querySelectorAll(".collection-link").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    document.querySelectorAll(".nav-link").forEach(item => item.classList.toggle("active", item.dataset.page === "library"));
    showLibrary(link.dataset.filter);
}));
progressBar.addEventListener("input", () => {
    if (audio.duration) audio.currentTime = (progressBar.value / 100) * audio.duration;
});
document.getElementById("volumeBar").addEventListener("input", event => audio.volume = event.target.value);
audio.volume = 0.7;
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeText.textContent = formatTime(audio.currentTime);
        durationText.textContent = formatTime(audio.duration);
    }
});
audio.addEventListener("ended", () => {
    if (!repeat) nextSong();
});
audio.addEventListener("play", () => { isPlaying = true; updatePlayer(); });
audio.addEventListener("pause", () => { isPlaying = false; updatePlayer(); });
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remaining}`;
}

renderQuickCards();
renderTracks(songs, document.getElementById("trackList"));
