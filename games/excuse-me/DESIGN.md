# EXCUSE ME — Game Design Document (draft 0.1)

Working title: **EXCUSE ME** / ES **CON PERMISO** / PT **COM LICENÇA**.
"Con permiso" is what you say to get through a crowd. It is also the question the whole game asks: who gets to take up space, and who asks before they do.

An 8-bit top-down RPG about moving through a club with your friends. No combat. The obstacles are people, and every one of them is a conversation.

> Rating: R / 18+. Drugs, sex, nightlife, strong language. Written for people who have been there. Nothing is sanitized and nothing is glamorized. Consequences are social and bodily, never a lecture.

---

## 1. Pillars

1. **The crowd is the level.** Walls barely matter. Bodies, moods and egos are the geometry.
2. **Every obstacle is a person.** They want something, they are scared of something, or they are too high to say what they want.
3. **One night, one thread.** Levels are not separate. What you do to someone in chapter 1 walks back into chapter 4.
4. **No game over, only a worse night.** You can't fail out. You can lose a friend for a chapter, get thrown out the main way, or earn an enemy. The ending is a **Night Report**, not a score.
5. **Nightlife politics, lightly worn.** Consent, space, the no-photo rule, care work, labor (the cleaning lady), the gendered logic of the "protective" boyfriend. Played as comedy and tenderness, never as a seminar.

## 2. Tone and writing rules

- Funny first, then true. The jokes come from recognizing the situation.
- Everyone gets dignity, including Broh. He is scared, not evil.
- Drugs are part of the world. They are in dialogue and in choices, never in instructions. No dosing information, no "how to". Harm reduction appears as things friends do for each other (water, sitting someone down, finding their people).
- Sex is present and implied: couples on sofas, a threesome in the darkroom, a hook-up in the tunnel. Sprites are abstract silhouettes, text is suggestive, nothing is graphic.
- Language is real. Spanish and Portuguese are written in venue slang, not translated from English. "Broh" becomes *bro / wey / hermano* in ES and *mano / parça / irmão* in PT.
- No gendered adjectives for the player character in ES/PT ("estoy listo/a" is rewritten).
- Never *"not X but Y"* constructions in teasers and site copy (house editorial rule).

## 3. The loop

```
ENTER SCENE → move with arrows → bump / approach a person →
  DIALOGUE (choose what to say)   or
  GESTURE  (they can't parse words) or
  DANCE    (a group demands a move) →
RESULT: path opens / closes, VIBE changes, flags are set, party reacts →
REACH THE EXIT TRIGGER → next scene
```

### Controls
- **Arrows** move. **Z / Enter / Space** confirm, talk, interact. **1–4** pick a dialogue option directly. **X / Esc** skips text.
- Dance and breathing sequences use the arrows only.
- Touch: on-screen D-pad plus one **A** button below the canvas. Dialogue options are tap targets, minimum 44×44px.

### The three interaction types

| Type | When | Feel |
|---|---|---|
| **Dialogue** | Anyone who can talk | 2–4 premade replies per beat. Each carries a visible tone tag (`[CHILL]`, `[SMOOTH]`, `[BLUNT]`, `[HUG]`, `[LIE]`) so you can play a character. Effects are never shown in advance. |
| **Gesture** | Intoxicated, deaf-by-volume or language-gap people | The NPC's speech is garbled. You pick from 3–5 gestures (point, mime drinking, palm up, hug, guide by the shoulders, show your phone). The NPC *misreads* some of them, which is the joke and the risk. |
| **Dance gate** | Groups, circles, a cypher | The group performs a 4–6 step arrow phrase on the beat (←←→←←). Then you repeat it on the next beats. Timing window is forgiving. Fail twice and you may *bail out* (slip through awkwardly, small VIBE cost) instead of retrying forever. |

Optional accessibility switch: **NO-RHYTHM MODE** ignores timing and checks sequence order only.

### Party
Your friends trail you in a snake line. They are not decoration:
- They **bark** one-liners at set triggers (passing a couple on a sofa, a loud drop, a stall door).
- They have **needs** that change the objective: Maru has to pee, Dani is rolling and drifts toward anyone friendly, Tato is spiraling and needs an anchor.
- Some dialogue options only exist **with** a given friend, and some friends will do things on their own if you ignore them (Dani joins the sofa).
- If a friend gets separated, their sprite stops with a `!`. Walk back to regroup, or push on and carry the guilt into the Night Report.

### State
- **VIBE** (0–6): goodwill with the room. It gates charm options. It never ends the game.
- **HIGH** (0–3), chosen on the title screen as "what did you take tonight": 0 SOBER, 1 PRE-DRINKS, 2 ROLLING, 3 FULL SEND. It unlocks different options (see below). At 3 the movement sways slightly.
- **ITEMS**: WATER (you start with one) and optionally a PILL from the dealer. Water is deliberately scarce: the k-hole guy, Tato and Rosa can each use it, and you can't serve all three.
- **FLAGS**: a dictionary of booleans (`broh_friend`, `broh_hostile`, `tobi_water`, `sofa_invite`, `stall_bump`, `rosa_ally`, `tato_calm`…). These drive the callbacks.

| HIGH | What changes |
|---|---|
| 0 SOBER | Clear-headed options: read a stranger's state, find their friends, call the medic. Less access to hugs and charm. |
| 1 PRE-DRINKS | Baseline. |
| 2 ROLLING | `[HUG]` options appear and disarm people. Your own replies get a little too honest. |
| 3 FULL SEND | Everything above, a sway to your movement, a few replies garbled on purpose, and the risk of being the one who needs looking after. |

## 4. Callback engine (what makes the levels interconnected)

Every encounter writes flags. Later scenes read them and swap lines, blockers or helpers. Examples:

| Set in | Flag | Pays off in |
|---|---|---|
| Ch1 Broh | `broh_friend` | Ch2: he clears a gap for your group. Ch3: he vouches for you in the toilet queue. Ch6: he and his girlfriend dance next to you. |
| Ch1 Broh | `broh_hostile` | Ch2: he and two friends block the corridor. Ch3: he's behind you in the queue and says something. |
| Ch1 k-hole guy | `tobi_water` | Ch3/4: he's sitting up, sees you, and tells the host "this one's good." Rosa mentions him. |
| Ch2 sofa | `sofa_invite` | Ch6B: someone in the tunnel says *"I know you from the sofa."* |
| Ch3 stall | `stall_bump` | Ch4: Rosa finds residue. Honesty changes her reaction. |
| Ch4 Rosa | `rosa_ally` | Ch5: she tells you the service corridor shortcut to the smoking area. |
| Ch4 Rosa | `rosa_angry` | Ch5: security walks you to the main hall. The tunnel route closes. |

The Night Report prints these as plain lines: *"Broh remembers you. Tobi is fine. Rosa has your name. You kept all three friends together."*

## 5. Chapters

Runtime target: 25–40 minutes for the full night, 6–8 minutes per chapter. Each chapter is one map plus a short scripted tail.

### CH 01 — DOORS (arrival)
You are late. The group chat is a graveyard of *"where r u"*. Cross the main floor to the pillar by the left speaker stack.
- **BROH + SOFI**: the encounter from your brief. Broh holds Sofi like a shield, legs apart, no room to pass. See §6.
- **TOBI (k-hole)**: gesture encounter. He stands staring at a light in the middle of the path.
- **THE STOMP CIRCLE**: a dance gate, ←←→←←.
- **FERNET the dealer** (optional): a polite vending machine. You can buy, decline, or ask what's in it. Asking earns you a straight answer.
- **EXIT**: the pillar. MARU, DANI and TATO. The group reacts to how late and how high you are. Maru: *"Ok, I need to pee right now."*

### CH 02 — THE MARCH
The group needs to cross the room back toward the toilets. This is a chapter about moving as four people.
- Broh again, changed by your flag.
- **The sofa nook**: a couple (maybe three) making out across the narrow passage. Squeeze by, ask "room for one more?", or send Dani to be charming. Dani may not come back.
- **The story-filmer**: someone filming faces for their page. Ask them to delete it, point at the no-photo sticker, or let Dani give the camera a gift.
- A small dance gate in a tight cluster.
- **EXIT**: the toilet corridor.

### CH 03 — THE QUEUE
Gender-neutral toilets, one long queue, one **host** at the door who enforces *one person, one stall*.
- Talk to the queue (optional): the person who really needs to pee, the girl who is fixing her face, the guy who thinks he's in a movie.
- Negotiate with the **HOST**: Maru needs the toilet, Tato is spiraling and can't be alone, Dani is unpredictable. Your line decides whether you get one stall for three, two stalls, or a split party.
- **The stall** (a short interior scene):
  - Maru pees. Privacy comedy, you hold the door.
  - Dani wants to do a bump. Say no, guard the door, or say yes and own it.
  - Tato spirals. **Breathing mini-game**: a slow ↑ ↓ ↑ ↓ on the beat, reusing the dance mechanic at half speed. Water helps, talking helps, telling him to relax doesn't.
- Then a knock.

### CH 04 — ROSA
Rosa, the cleaning lady, has been in this room for nine hours and has heard three voices in one stall. She is the moral center of the night.
- She isn't there to catch you. She wants the stall left clean and wants to know that nobody is dying in it.
- Honest, funny, defensive, or humiliatingly polite: she reads all of it. You can give her water, apologize, tip, or try to talk your way out.
- Outcomes: she becomes an ally and gives the **service corridor shortcut**, she lets it go, or she calls security.
- The sinks: refill your water bottle (once).

### CH 05 — THE FORK
A hallway with two doors and the group's votes:
- **Left**: the dancefloor, loud, hot, where the night peaks.
- **Right**: the tunnel to the smoking area, cold, dark, wet concrete.
Each friend leans one way depending on state: Dani wants to dance, Tato wants air, Maru is undecided. Walking through a door commits the group. The party can also **split**: it's allowed, and it has costs.

### CH 06A — THE FLOOR (peak)
You want to get your group to the front of the speakers for the drop.
- Three nested dance gates with longer phrases (5, 6, 7 steps). The cypher opens up in layers.
- Callbacks dance beside you: Broh and Sofi, Tobi sitting up, whoever you helped.
- **The drop**: a quiet cinematic moment. The best text in the game goes here.

### CH 06B — THE TUNNEL
A flashlight-radius dark tunnel (dithered mask). Slow, strange, intimate.
- **Hook-up in the wall alcove**: they're not leaving. Walk through and pretend not to look, ask if they want a hand, or turn back.
- **The kid on the floor**: a bad trip. Sit with them, give water, find their friends, or call medics. Sober play makes the best calls.
- **The dealer** from Chapter 1, if you met them, or a new one.
- **"I know you from the sofa."**
- Exit: the smoking area. Steam, sky, cold air, a cigarette you didn't want.

### EPILOGUE — NIGHT REPORT
A plain-text receipt of the night. Friends kept together, strangers looked after, enemies made, VIBE. Ends with a teaser for the next night.

## 6. Sample scene: BROH (full branching)

**Setup.** The passage between the bar and the speaker stack is two people wide. Broh stands with legs apart, holding Sofi against his chest, scanning for threats. Sofi looks bored and a little high.

```
BROH:  "Brooo. Easy. You're in her space, bro."
  1. [CHILL]  "Sorry bro, just trying to get to my friends."
       → BROH: "Yeah, yeah. She's just… you know. A lot of guys."
           a. [SMOOTH] "You guys look great together."          → +1 VIBE, broh_friend. He steps aside.
           b. [BLUNT]  "Then let her breathe. I'm leaving."      → -1 VIBE, broh_hostile. He moves slowly.
  2. [SMOOTH] "Nice. Seems like a good night."                   → he bonds. broh_friend. Sofi rolls her eyes.
  3. [DIRECT] (to Sofi) "Hey, do you want to dance?"             → Sofi leaves his arms and laughs. Broh is insulted.
                                                                    +1 VIBE, broh_hostile. Sofi remembers you.
  4. [HUG]  (HIGH ≥ 2) "I love this energy, bro."               → The hug disarms him. He cries a bit. broh_friend,
                                                                    broh_hugged. Sofi mouths "thank you."
  5. [PUSH] Shoulder through.                                    → He shoves back. -2 VIBE, broh_hostile.
```

In ES the register is *"Weeey, tranqui, ¿qué onda con mi novia?"*. In PT it is *"Maaano, calma, tá no espaço dela."* Both need their own jokes.

## 7. Sample scene: TOBI (gesture mode)

**Setup.** Tobi stands in the middle of the path staring at a light. His speech is garbled and drifts:
*"…the… floor… is… a… door… you… are… also… a… door…"*

| Gesture | Result |
|---|---|
| 👋 Wave in his face | He waves back for ten seconds. Then a slow "hi." Nothing opens. |
| 👉 Point to the bar | He nods deeply and walks into the pillar. Funny, a bit mean. |
| 🫂 Hug him | He melts. 20 seconds of nothing. +1 VIBE. |
| 💧 Offer water | He drinks, blinks, becomes more present for a second. `tobi_water` and the water is gone. |
| 🆘 Find his people (SOBER only) | You read his wristband or phone, find his friends, and they take him. Best outcome, costs time. |

## 8. Dance gate: the details

- Each gate has a phrase (`['L','L','R','L','L']`), a BPM, and a window (default ±0.35 beat).
- Phase 1, **WATCH**: the group performs the phrase, with arrow glyphs lighting one per beat.
- Phase 2, **YOUR TURN**: you repeat it on the next beats. Hits get a bob, misses make the group wince.
- Pass → the group parts. Partial → they let you through with comments. Two fails → the BAIL OUT option appears.
- Shared beat clock: the same clock drives the game's own 4-on-the-floor kick, so what you hear is what you dance to.

## 9. Visual and audio direction (site rules apply)

- **Strict monochrome**: four values only. `#0A0A0A`, `#121212`, `#7F7F7F`, `#FFFFFF`. Shapes are told apart by silhouette, hair, hats and dither patterns, not colour. Genre-mode easter-egg themes on the host page do not carry into the game.
- **Zero radius** everywhere in the UI, 1–2px white borders, uppercase monospace labels, binary hover inversion.
- **Canvas 256×144**, integer-scaled, `image-rendering: pixelated`. Sprites are generated from small specs (head, hair, torso pattern, accessory), so a new NPC costs a few lines, not an art pass.
- **Dialogue lives in the DOM** under the canvas, not in the canvas: better for accessibility, translation and long text.
- **Light and motion safety**: nothing flashes faster than 3 Hz. Strobe-style lighting is dithering, not flashing. `prefers-reduced-motion` turns off sway and screen bob.
- **Audio**: raw Web Audio, framework-free, following the site's engine rules (look-ahead scheduling, synchronous `resume()` on the first key press, a limiter on the master, band-limited oscillators, seeded noise). One kick/hat/bass loop per chapter, passed through a low-pass filter that tracks where you are. Muffled in the toilets, closed in the stall, open in the main hall, long reverb in the tunnel.
- **Trilingual**: every string lives in the game's own `I18N` and content dictionaries in EN/ES/PT, including `aria-label`s. The game follows the host language (`?lang=`, `localStorage['preferred-lang']`, live `storage` event).
- **Dynamic height**: posts `{ type: 'resize-games-iframe', height }` to the host like the Techno Variants Engine does.

## 10. Content and data format

Dialogue is data, not code, so writing is separate from engineering:

```js
broh1: {
  speaker: 'BROH',
  start: 'a',
  nodes: {
    a: {
      text: T('Brooo. Easy. You\'re in her space, bro.', '…', '…'),
      choices: [
        { tone: 'CHILL', t: T('Sorry bro…', '…', '…'), next: 'b', do: { vibe: 0 } },
        { tone: 'HUG', t: T('I love this energy.', '…', '…'),
          req: { high: 2 }, do: { vibe: 1, flags: ['broh_friend', 'broh_hugged'] }, next: null, open: true }
      ]
    }
  }
}
```
- `req`: `{ high, vibe, flag, notFlag, item, withFriend }`
- `do`: `{ vibe, flags, unflags, item }`
- `open: true` clears the gate.
- Gesture nodes use the same schema with `mode: 'gesture'` and a `glyph` per choice.
- Dance gates: `{ type: 'dance', seq, bpm, onWin, onPartial, onFail }`.

Scene maps are ASCII grids, one character per 16px tile, with a legend for NPCs, spawn, exits and crowd density. A seeded RNG fills crowd cells so a scene looks the same on every play.

## 11. Site integration plan

Chosen: **a hub with game cards** on `/games`.
1. `#games-subsite` becomes a picker: one card per game (title, one-line trilingual blurb, tags, `[ OPEN ]`). Cards use the standard brutalist inversion hover.
2. Selecting a card sets the frame `src` from the card's `data-src` (still only when the Games view is open, so no hidden audio engines). Techno Variants Engine stays as card #1 and loses nothing.
3. The `message` listener that resizes the iframe is generalized to the *active* frame (it currently queries a single `.games-app-iframe`).
4. Games stay a hidden destination: not in the top bar, tab bar, footer, rail or sitemap. `/games`, `/juegos` and `/jogos` stubs only need their copy updated, since the page is no longer "just the synth".
5. `sw.js` already skips `/games/`. No change.
6. Optional later: deep links like `/games?game=excuse-me` so a single game can be shared.

## 12. Production roadmap

| Milestone | Contents |
|---|---|
| **M0 — this document** | Concept, systems, cast, chapter list. Review and edit. |
| **M1 — engine slice** | Canvas renderer, camera, collision, followers, DOM dialogue, flags, i18n, touch D-pad. One empty room. |
| **M2 — CH 01** | Broh, Tobi, stomp circle, Fernet, friends. Dance gate and gesture mode complete. |
| **M3 — CH 02–04** | The march, the queue, the stall, breathing mini-game, Rosa. Full callback system. |
| **M4 — hub** | Games page becomes a hub, second frame wiring, copy in 3 languages. |
| **M5 — CH 05–06 + report** | Fork, floor, tunnel, Night Report. Audio pass. |
| **M6 — polish** | Playtest with real ravers, accessibility pass, EN/ES/PT slang pass, performance profile. |

## 13. Encounter bank (for later chapters)

Mix and match for new levels. Each one is a person with a want:
- **The Bouncer**: you can't get your friend back in. Appeal to his professionalism, his kindness, or his boredom.
- **The Old Head**: *"I've been going since '94."* He's right about everything and has to say so. Dance gate with a strange, old-school phrase.
- **The DJ Stan**: stands in front of the booth filming. Politely moves, or doesn't.
- **The Jaw-Clencher**: talks for four minutes about their ex. Listen, interrupt, or hand them gum.
- **The Berlin Tourists**: only speak English. Everyone else is speaking three other languages. Gesture mode in reverse.
- **The Coat-check Kid**: lost your ticket. Honesty or bluff.
- **The Bar Queue**: the water line is 20 people long, the tap is free, nobody knows.
- **The Darkroom**: a threesome that gets very quiet when you walk in. The right move is also the funniest.
- **The Medic Tent**: the calm place nobody wants to admit they need.
- **Afterhours / The Walk Home**: the sun comes up, nobody wants to leave, and the last chapter is about getting everyone home.

## 14. Open questions for you

1. **Names.** Are Maru, Dani and Tato right, or do you want your actual friends' vibe? Same for Broh, Sofi, Tobi, Fernet and Rosa.
2. **Player character.** A blank "you", or someone with a defined identity and a history with these friends?
3. **Real venue.** Should the map echo the actual venue where Æ000.X happens, or stay fictional?
4. **Drugs.** Do you want a visible "harm-reduction ledger" in the Night Report (water given, friends looked after), or should the game stay silent on it and let the choices speak?
5. **Ending.** One Night Report, or distinct endings (the Sunrise, the Medic Tent, Kicked Out)?
6. **Language of the title.** Keep one international title (EXCUSE ME) or localize it (CON PERMISO / COM LICENÇA)?
