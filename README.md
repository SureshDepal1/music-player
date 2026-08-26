# Melody

Melody is a polished, responsive music player built with native HTML5, CSS3, and vanilla JavaScript. It is designed to work as a static site with a local music library and no backend.

## Features

- Play, pause, resume, previous, and next controls
- Automatic next-track playback, repeat, and shuffle
- Seekable progress bar with current time and duration
- Volume slider and mute control
- Search by title, artist, or album
- Favorite tracks persisted with localStorage
- Active playlist state with animated equalizer
- Responsive desktop, tablet, and mobile layouts
- Graceful messaging when local media is missing
- Keyboard shortcuts: `/` focuses search and `Space` toggles playback

## Technologies

- HTML5 semantic markup
- CSS3 custom properties, grid, flexbox, and responsive media queries
- Vanilla JavaScript and the native HTML5 Audio API

## Folder structure

```text
music-player/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── images/
    └── music/
```

## Run locally

Open `index.html` directly, or serve the folder with VS Code Live Server or another local static server. A server is recommended because browsers can restrict local audio requests opened from a `file://` URL.

## Add songs

Place your audio files in `assets/music/` using these names:

- `song1.mp3`
- `song2.mp3`
- `song3.mp3`
- `song4.mp3`

To add or remove tracks, edit the `songs` array in `script.js` and provide a local `audio` path.

## Add album artwork

Place matching images in `assets/images/`:

- `song1.jpg`
- `song2.jpg`
- `song3.jpg`
- `song4.jpg`

Update each song's `cover` path in `script.js` if you use different filenames. Until images are added, the player shows an original CSS artwork fallback.

## Customize colors

Edit the variables at the top of `style.css`, especially `--accent`, `--violet`, `--bg`, and `--panel`.

## Deploy

Deploy the folder to any static host such as GitHub Pages, Netlify, Vercel static hosting, or Cloudflare Pages. Ensure the `assets/music/` files are included in the deployed output; the player does not upload or store audio in localStorage.

## Placeholders

The four demo tracks and their cover images are intentionally local placeholders. The interface remains usable and reports a friendly message until your own audio and image files are added.
