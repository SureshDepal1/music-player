"use strict";

const songs = [
  { id: 1, title: "Midnight Drive", artist: "Alex Morgan", album: "Night Sessions", audio: "assets/music/song1.mp3", cover: "assets/images/song1.jpg", color: "#a44a6a" },
  { id: 2, title: "Ocean Lights", artist: "Mira Vale", album: "Tidal Memory", audio: "assets/music/song2.mp3", cover: "assets/images/song2.jpg", color: "#367b9b" },
  { id: 3, title: "Neon Dreams", artist: "The Paper Satellites", album: "After Image", audio: "assets/music/song3.mp3", cover: "assets/images/song3.jpg", color: "#7359aa" },
  { id: 4, title: "After Dark", artist: "June Hollow", album: "City Static", audio: "assets/music/song4.mp3", cover: "assets/images/song4.jpg", color: "#b56b42" }
];

const audio = document.querySelector("#audio");
const elements = {
  playlistList: document.querySelector("#playlistList"), trackCount: document.querySelector("#trackCount"), noResults: document.querySelector("#noResults"), searchInput: document.querySelector("#searchInput"),
  title: document.querySelector("#songTitle"), artist: document.querySelector("#songArtist"), cover: document.querySelector("#coverImage"), artworkFallback: document.querySelector("#artworkFallback"), initials: document.querySelector("#artworkInitials"),
  playButton: document.querySelector("#playButton"), playIcon: document.querySelector("#playIcon"), previousButton: document.querySelector("#previousButton"), nextButton: document.querySelector("#nextButton"), shuffleButton: document.querySelector("#shuffleButton"), repeatButton: document.querySelector("#repeatButton"), favoriteButton: document.querySelector("#favoriteButton"), muteButton: document.querySelector("#muteButton"), volumeIcon: document.querySelector("#volumeIcon"),
  progressBar: document.querySelector("#progressBar"), currentTime: document.querySelector("#currentTime"), duration: document.querySelector("#duration"), volumeBar: document.querySelector("#volumeBar"), volumeValue: document.querySelector("#volumeValue"), message: document.querySelector("#playerMessage"), toast: document.querySelector("#toast"), playlistPanel: document.querySelector("#playlistPanel"), playlistToggle: document.querySelector("#playlistToggle")
};

const state = { currentSongIndex: Number(localStorage.getItem("melody-song")) || 0, isPlaying: false, isShuffle: localStorage.getItem("melody-shuffle") === "true", isRepeat: localStorage.getItem("melody-repeat") === "true", volume: Number(localStorage.getItem("melody-volume")) || .75, favorites: JSON.parse(localStorage.getItem("melody-favorites") || "[]") };
let toastTimer;

function formatTime(seconds) { if (!Number.isFinite(seconds)) return "0:00"; const minutes = Math.floor(seconds / 60); const remainder = Math.floor(seconds % 60).toString().padStart(2, "0"); return `${minutes}:${remainder}`; }
function currentSong() { return songs[state.currentSongIndex]; }
function showToast(message) { elements.toast.textContent = message; elements.toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2400); }
function saveState() { localStorage.setItem("melody-song", state.currentSongIndex); localStorage.setItem("melody-shuffle", state.isShuffle); localStorage.setItem("melody-repeat", state.isRepeat); localStorage.setItem("melody-volume", state.volume); localStorage.setItem("melody-favorites", JSON.stringify(state.favorites)); }
function setMessage(message, isError = false) { elements.message.textContent = message; elements.message.classList.toggle("error", isError); }

function loadSong(index = state.currentSongIndex, shouldPlay = false) {
  state.currentSongIndex = (index + songs.length) % songs.length;
  const song = currentSong();
  audio.src = song.audio;
  audio.volume = state.volume;
  elements.title.textContent = song.title;
  elements.artist.innerHTML = `${song.artist} <span>/</span> ${song.album}`;
  elements.cover.src = song.cover;
  elements.cover.alt = `${song.title} album artwork`;
  elements.cover.style.display = "block";
  elements.cover.onerror = () => { elements.cover.style.display = "none"; };
  elements.initials.textContent = song.title.split(" ").map(word => word[0]).join("").slice(0, 2);
  elements.artworkFallback.style.background = `radial-gradient(circle at 68% 28%, #f4ce85, transparent 4%, ${song.color} 25%, transparent 26%), linear-gradient(140deg, #191633, ${song.color} 48%, #e0a750)`;
  elements.progressBar.value = 0; elements.currentTime.textContent = "0:00"; elements.duration.textContent = "0:00";
  elements.favoriteButton.setAttribute("aria-pressed", state.favorites.includes(song.id)); elements.favoriteButton.setAttribute("aria-label", state.favorites.includes(song.id) ? "Remove from favorites" : "Add to favorites");
  updateActiveSong(); saveState(); setMessage("Add your music files to assets/music/ to start listening.");
  if (shouldPlay) playSong();
}
function updateActiveSong() { document.querySelectorAll(".playlist-item").forEach(item => item.classList.toggle("active", Number(item.dataset.id) === currentSong().id)); }
async function playSong() { try { await audio.play(); } catch (error) { if (error.name !== "AbortError") setMessage("Unable to load this track. Please check the music file.", true); } }
function pauseSong() { audio.pause(); }
function togglePlay() { state.isPlaying ? pauseSong() : playSong(); }
function nextSong() { let nextIndex; if (state.isShuffle && songs.length > 1) { const choices = songs.map((_, index) => index).filter(index => index !== state.currentSongIndex); nextIndex = choices[Math.floor(Math.random() * choices.length)]; } else nextIndex = state.currentSongIndex + 1; loadSong(nextIndex, true); }
function previousSong() { if (audio.currentTime > 3) { audio.currentTime = 0; return; } loadSong(state.currentSongIndex - 1, state.isPlaying); }
function renderPlaylist() { const query = elements.searchInput.value.trim().toLowerCase(); const visibleSongs = songs.filter(song => `${song.title} ${song.artist} ${song.album}`.toLowerCase().includes(query)); elements.playlistList.innerHTML = visibleSongs.map((song, index) => `<button class="playlist-item ${song.id === currentSong().id ? "active" : ""}" data-id="${song.id}" type="button"><span class="item-number">${String(songs.indexOf(song) + 1).padStart(2, "0")}</span><span class="thumb" style="background: ${song.color}"><img src="${song.cover}" alt="" onerror="this.style.display='none'"></span><span class="item-copy"><span class="item-title">${song.title}</span><span class="item-artist">${song.artist}</span></span><span class="item-duration">${song.duration || "--:--"}</span><span class="equalizer" aria-label="Playing"><i></i><i></i><i></i></span></button>`).join(""); elements.trackCount.textContent = `${String(visibleSongs.length).padStart(2, "0")} tracks`; elements.noResults.hidden = visibleSongs.length > 0; }
function toggleFavorite() { const id = currentSong().id; const favoriteIndex = state.favorites.indexOf(id); if (favoriteIndex === -1) { state.favorites.push(id); showToast("Added to favorites"); } else { state.favorites.splice(favoriteIndex, 1); showToast("Removed from favorites"); } elements.favoriteButton.setAttribute("aria-pressed", favoriteIndex === -1); elements.favoriteButton.setAttribute("aria-label", favoriteIndex === -1 ? "Remove from favorites" : "Add to favorites"); saveState(); }
function updateProgress() { elements.progressBar.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0; elements.currentTime.textContent = formatTime(audio.currentTime); }
function setProgress() { if (audio.duration) audio.currentTime = (Number(elements.progressBar.value) / 100) * audio.duration; }
function setVolume() { state.volume = Number(elements.volumeBar.value); audio.volume = state.volume; elements.volumeValue.textContent = Math.round(state.volume * 100); updateVolumeIcon(); saveState(); }
function updateVolumeIcon() { const muted = audio.muted || state.volume === 0; elements.volumeIcon.innerHTML = muted ? `<path d="M4 10v4h4l5 4V6l-5 4H4Zm13 1 4 4m0-4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M4 10v4h4l5 4V6l-5 4H4Zm12.5-2a6 6 0 0 1 0 8M18.5 5a10 10 0 0 1 0 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`; elements.muteButton.setAttribute("aria-label", muted ? "Unmute" : "Mute"); }

function bindEvents() {
  elements.playButton.addEventListener("click", togglePlay); elements.nextButton.addEventListener("click", nextSong); elements.previousButton.addEventListener("click", previousSong); elements.progressBar.addEventListener("input", setProgress); elements.volumeBar.addEventListener("input", setVolume); elements.favoriteButton.addEventListener("click", toggleFavorite); elements.searchInput.addEventListener("input", renderPlaylist);
  elements.shuffleButton.addEventListener("click", () => { state.isShuffle = !state.isShuffle; elements.shuffleButton.setAttribute("aria-pressed", state.isShuffle); saveState(); showToast(state.isShuffle ? "Shuffle on" : "Shuffle off"); });
  elements.repeatButton.addEventListener("click", () => { state.isRepeat = !state.isRepeat; elements.repeatButton.setAttribute("aria-pressed", state.isRepeat); saveState(); showToast(state.isRepeat ? "Repeat on" : "Repeat off"); });
  elements.muteButton.addEventListener("click", () => { audio.muted = !audio.muted; updateVolumeIcon(); });
  elements.playlistList.addEventListener("click", event => { const item = event.target.closest(".playlist-item"); if (!item) return; loadSong(songs.findIndex(song => song.id === Number(item.dataset.id)), true); if (window.innerWidth <= 850) { elements.playlistPanel.classList.remove("open"); elements.playlistToggle.setAttribute("aria-expanded", "false"); } });
  elements.playlistToggle.addEventListener("click", () => { const isOpen = elements.playlistPanel.classList.toggle("open"); elements.playlistToggle.setAttribute("aria-expanded", isOpen); });
  document.addEventListener("keydown", event => { if (event.key === "/" && document.activeElement !== elements.searchInput) { event.preventDefault(); elements.searchInput.focus(); } if (event.code === "Space" && document.activeElement.tagName !== "INPUT") { event.preventDefault(); togglePlay(); } });
  audio.addEventListener("play", () => { state.isPlaying = true; elements.playButton.setAttribute("aria-label", "Pause"); elements.playIcon.innerHTML = `<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>`; document.querySelector(".artwork-wrap").classList.add("is-playing"); setMessage(""); updateActiveSong(); });
  audio.addEventListener("pause", () => { state.isPlaying = false; elements.playButton.setAttribute("aria-label", "Play"); elements.playIcon.innerHTML = `<path d="M8 5.1v13.8L19 12 8 5.1Z"/>`; document.querySelector(".artwork-wrap").classList.remove("is-playing"); });
  audio.addEventListener("timeupdate", updateProgress); audio.addEventListener("loadedmetadata", () => { elements.duration.textContent = formatTime(audio.duration); }); audio.addEventListener("ended", () => state.isRepeat ? loadSong(state.currentSongIndex, true) : nextSong()); audio.addEventListener("error", () => setMessage("Unable to load this track. Please check the music file.", true));
}

function initialize() { elements.volumeBar.value = state.volume; elements.shuffleButton.setAttribute("aria-pressed", state.isShuffle); elements.repeatButton.setAttribute("aria-pressed", state.isRepeat); elements.volumeValue.textContent = Math.round(state.volume * 100); loadSong(); renderPlaylist(); updateVolumeIcon(); bindEvents(); }
initialize();
