# MERIT

**Memory and Rapid Information-processing Test**: a short cognitive battery that runs in the
browser on a tablet (iPad, Android tablet, Surface or touch laptop) and works offline once installed.

**Open the app:** https://USERNAME.github.io/REPO/

```
HVLT learning trials 1–3 (examiner)  →  SDMT (participant)  →  HVLT recognition (examiner)  →  CSV
```

- **HVLT learning trials:** 12 words, presented by audio (one word every 2 s) or visually
  (self-paced, optionally rotated 180° for a participant sitting opposite). The examiner scores
  free recall by tapping the words.
- **SDMT:** Symbol Digit Modalities Test with an optional practice run; 6 versions, 1–3 min.
- **HVLT recognition:** 24 words, the examiner records yes/no answers.
- **Output:** one CSV per session (long format, one row per event).

## Installing on a tablet

Open the link above once **while online**, then add it to the home screen:

- **iPad (Safari):** Share → Add to Home Screen
- **Android (Chrome):** menu ⋮ → Install app / Add to Home screen
- **Windows (Edge or Chrome):** install icon in the address bar

Start it from the home screen. It runs full-screen and **works without internet**. On the app's
home screen, "Cached for offline use" should show 24/24 for every HVLT form you plan to use.

During testing, lock the device to the app (iPad: Guided Access; Android: App pinning) and set
auto-lock to "Never".

## Data and privacy

All results stay **on the device**. The app sends nothing anywhere.

- Each session is saved on the device after every step. The app's home screen lists all sessions
  with **CSV**, **Share** and **Delete** buttons.
- At the end of a session: **Download CSV** or **Share / Save to Files**.
- On-device storage is a backup, not an archive: export each session's CSV after testing.

## Examiner controls

- **Abort (hold 2 s)**, top right on examiner screens: stops the session (saved as `aborted`).
- **End (hold 1.5 s)** during the SDMT: ends the current SDMT run early.
- After the SDMT the participant sees a hand-back screen; the examiner presses and holds to continue.

## Files

| file | purpose |
|---|---|
| `index.html` | the whole app (HTML, CSS, JavaScript in one file) |
| `sw.js` | service worker for offline use |
| `manifest.webmanifest`, `icon-*.png` | home-screen name and icons |
| `audio/` | word recordings, `f<form>_<word>.mp3` |

The word recordings were synthesised with the OpenAI speech API (voice "alloy").

**Updating:** change `APP_VERSION` in `index.html` and `CACHE_VERSION` in `sw.js`, then upload the
changed files. Tablets pick up the new version the next time the app is opened online. The version
is shown on the start screen and in every CSV row.

## Credits

The SDMT part is adapted from Ryan Panela's
[sdmt-pwa](https://github.com/ryanapanela/sdmt-pwa), with his agreement.
