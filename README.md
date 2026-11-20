# Accessible Campus Navigator

Indoor-outdoor navigation for three campus buildings that helps wheelchair users and visually impaired students find routes they can actually use.

## Features
- **Fastest vs step-free** routing (Dijkstra on an accessibility graph)
- **Screen-reader friendly**: semantic HTML, labelled controls, live-region announcements, optional read-aloud (tested with TalkBack / VoiceOver)
- **Landmark-based directions**: one action per step, tactile and audible cues
- **Broken-lift reporting**: report or clear a lift fault and the route recalculates immediately

## Run it
No build needed. Open `index.html` in a browser, or enable GitHub Pages (Settings > Pages > main branch) to get a live link.

## Files
| File | Purpose |
|---|---|
| `data.js` | Campus graph: nodes, edges, lifts (edit this with your real survey data) |
| `app.js` | Routing, direction text, lift reports |
| `index.html`, `style.css` | Accessible UI |

## How routing works
Each path segment has a type (path, ramp, steps, stairs, lift, door, bridge). Step-free mode skips `steps` and `stairs`. Lifts reported broken are skipped in every mode.

## Limitations and next steps
- Sample buildings and landmarks are placeholders; replace them after walking the real campus.
- Lift reports are stored in the browser (`localStorage`). Next: sync with Firebase/Supabase so all users see them, add report confirmations and auto-expiry.
- Add slope and door-width filters, QR codes at lifts, and offline support.

## Team
Add team name and members.

Problem statement M9: Accessible Campus Navigator
