# EXCUSE ME — Game Design Document (v0.2, as built)

Working title: **EXCUSE ME** / ES **CON PERMISO** / PT **COM LICENÇA**.
"Con permiso" is what you say to get through a crowd. It is also the question the whole game asks: who gets to take up space, and who asks before they do.

An 8-bit top-down RPG about one night in a club called **LA GRIETA** (22:00 to 08:00), played with the arrow keys. No combat. The obstacles are people, and every one of them is a conversation.

> Rating: R / 18+. Drugs, alcohol, sex, strong language. Written for people who have been there. Nothing is sanitized and nothing is glamorized. Consequences are social and bodily, never a lecture.

Files live in `games/excuse-me/`. It is embedded from the `/games` hub (a card per game); the frame loads only when its card is opened.

---

## 1. Pillars

1. **The crowd is the level.** Walls barely matter. Bodies, moods and egos are the geometry.
2. **Every obstacle is a person.** They want something, they are scared of something, or they are too high to say what they want.
3. **One night, one thread.** Everything you do in one room walks into another one later.
4. **No game over, only a different ending.** Eleven endings. The Night Report is the receipt.
5. **Care is a mechanic.** Giving someone water, sitting someone down, finding their people, asking before you touch: all of it moves your bars, quietly, and none of it is listed in the report as a score.
6. **Nightlife politics, lightly worn.** Consent, space, the no-photo rule, the cleaning lady, the "protective" boyfriend. Played as comedy and tenderness.

## 2. The four bars

| Bar | Drains | Refills | At zero / full |
|---|---|---|---|
| **FUN** | slowly over time; comedown | **dancing** on the glowing floor marks (arrow-key freestyle, 45 min cooldown per spot), peaks, good conversations | stays at zero for 45 minutes: ending **THE EARLY UBER** |
| **SOCIAL BATTERY** | every conversation (−1 per reply, more when you handle it badly or argue); wading through a crowd without saying *excuse me*; rolling on meth drains it faster | benches, the quiet room, the dark room couches, a talk with someone calm, **care** | zero: ending **THE STALL HERMIT**. Below 15, charming replies grey out ("TOO DRAINED") |
| **HEALTH** | alcohol, drugs, fights, dehydration (after about two hours without water), exertion | **water**, sitting, the quiet room, sleeping it off, a medic | zero: you pass out in the quiet room and lose about 80 minutes. A second time: ending **THE SECOND TIME** (ambulance) |
| **WEIRDNESS** | starts at 0. Rises with alcohol, drugs, bumping into people, shoving, filming people, pushing past a "no", lying to staff | slowly, only while sober; sitting; apologising; **care** (staff notice who looks after people) | **full: you are walked out.** Ending **THE LONG WALK TO THE DOOR**. At 70 security starts watching, at 88 you get a last warning |

### The care dividend
Any choice tagged `care` (water, sitting someone down, finding their people, a gentle ask) gives: SOCIAL +3, WEIRDNESS −5, FUN +2, a small sound, and a tally the game keeps privately. The Night Report does not list a care count. It only shows up as moments ("you sat with Juno until her friends found her") and, at the very top, as the condition for the **LEGEND** ending.

Water is deliberately scarce. You start with one bottle. Tobi, Tato, Rosa, Juno, Kiki, the Resident and your own thirst can each use it. Taps and the bar jug refill it.

## 3. Controls and interactions

- **Arrows / WASD** move. **Z / Enter / Space**: talk, use, or, in a crowd, say **EXCUSE ME**. **X / Esc**: walk away. **P / Tab**: menu. **M**: sound. Touch: D-pad + A / X.
- **EXCUSE ME (Z in a crowd)**: the crowd parts for a few seconds and the wading slowdown mostly goes away. Cost: a little social energy. Without it, wading through a dense crowd bumps people: −1 social and a little weirdness each time. It is the namesake mechanic.
- **Dialogue**: 2–5 replies per beat with tone tags (`[CHILL] [SMOOTH] [BLUNT] [HUG] [HONEST] [JOKE] [CARE] [BOLD] [SORRY] [LIE]…`). Effects are never shown in advance. Replies unlock or lock with your state: sober gets clear-headed options, rolling gets `[HUG]`, a drained battery greys out charm, a bad pill scrambles and garbles your options and sometimes says something else for you.
- **Gesture mode**: for people who cannot understand you (a k-holed stranger, German tourists). A grid of pixel-icon gestures. Some are misread.
- **Dance gates**: a group performs an arrow phrase (←←→←←) on the beat; you remember it and repeat it on the next beats. Forgiving window, two or three attempts. Optional **NO-RHYTHM MODE** ignores timing.
- **Freestyle dancing** at glowing floor marks: arrows on the beat for 16 beats; fills FUN.
- **Breathing**: ↑ ↓ ↑ ↓ at half speed to help someone through a panic.

## 4. The night clock
Minutes since 22:00. 0.4 game-minutes per real second while you walk; conversations cost a minute per reply; scenes cost more. Story beats pull the clock forward to fixed times. The DJ changes with the night (warm-up house, techno, hard, closing) and the crowd thins and swells (full from about 03:00 to 05:30). Sala 2 upstairs opens at 01:00. The roof opens at 05:30 for the closing set. Sunrise is the main goal. At 08:00 the house lights come on.

## 5. The venue (11 zones, all connected)

| Zone | What happens there |
|---|---|
| **Outside** | Queue (Kiki, Bruno, an arguing couple). **Dragan** at the door: name, phone sticker, "anything in you tonight?" (your honest answer sets your starting state) |
| **Foyer** | The hub. Coat check (Luca: tips), Fernet the seller, stairs to Sala 2, doors to everything |
| **Main floor** | Big dancefloor, DJ booth, bar (Nico), the pillar where your friends are. Three passages: **Broh + Sofi** (insecure boyfriend), **Tobi** (gesture), **the stomp circle** (dance gate). Hugo the old head, Tristan filming, a birthday table |
| **Toilets** | The queue, **Mika** the host (one person per stall), the stall, **Rosa** the cleaning lady, sinks, the STAFF door |
| **Dark room** | Dario's rules (ask first), a couple on a sofa, a trio, a nervous first-timer. Consent is the whole game here |
| **Tunnel** | Dark, lamp-lit. Juno (a bad trip), an alcove, Rico, Ximena painting the wall |
| **Smoking area** | Benches, fire barrels, a cat, German tourists, Pili, Dante, Sol, Ofelia (security) |
| **Quiet room** | **Isi** and the checking table, **Teo** the medic, mattresses. SOCIAL and HEALTH recharge faster here |
| **Sala 2 (attic)** | Harder, denser room: Hazel the purist, a trance-dance ring, Oz holding ice |
| **Backstage** | Beatriz the manager, **the Resident** (closing DJ), a water crate |
| **Roof** | Sunrise. The closing set. The ending |

## 6. The story spine
1. **Doors.** Get past Dragan. Your friends are inside.
2. **Find your people.** Cross the main floor (three gates; pick a route).
3. **Maru has to pee.** March the three of them back through the crowd. Broh returns if you made an enemy.
4. **Toilets, one stall.** Convince the host: honesty, charm, a lie, a favour, or split up.
5. **The stall.** Dani reveals a pill. Tato spirals (breathing). A knock.
6. **Rosa.** Explain yourselves. She is the moral centre of the night.
7. **The pill.** Take it to the quiet room's checking table. Isi tests it. See below.
8. **The drop (03:40).** Three nested dance gates. The best writing in the game.
9. **Nobody left behind.** The group scatters. Where Dani and Tato end up depends on the pill and on how you treated them. Search the venue.
10. **The closing set.** Everyone on the roof. Sunrise. Ending.

### The pill arc (your design, as built)
Dani buys a pale pill with a crown stamped on it from a stranger. The group goes to the quiet room to check it. A reagent test runs and reveals one of three results (decided silently per run):
- **Pure.** It reads as MDMA, "as far as this table can tell." Take it, take a small piece, skip it, or bin it.
- **MDMA plus a stimulant.** Does not match what he was told. Taking it: you are **ROLLING and WIRED**. More fun, much worse health, much more weirdness, more social drain, and a harder crash.
- **Fake.** Nothing like MDMA. If someone takes it anyway: a hidden second roll. **Faint** (you pass out and wake in the quiet room 80 minutes later), **Nothing** (a very expensive mint), or **Bad signal** (your replies get scrambled, garbled and sometimes replaced, and you stumble: "extreme disadvantage when interacting with other people").
You decide for yourself. Dani decides for himself. Your choice also changes where Dani is found later (dark room, attic, quiet room, tunnel or by the fire).

Alcohol (bar, Kiki's shots, Clara's birthday) is a separate stack: fun and boldness up, health and weirdness up, vomiting at about six drinks.

## 7. The cast
Friends: **Maru** (organiser), **Dani** (hug-first), **Tato** (anxious, kind). They follow you, bark one-liners, and have needs. Everyone else is a person with a want: Broh and Sofi, Tobi, Tristan, Hugo, Nico, Luca, Fernet, Rico, Kiki, Bruno, Mika, Marga, Ezra, Rosa, Dario, Juno, Ximena, Jonas and Ida, Pili, Dante, Sol, Ofelia, Mateo (Tato's ex), Isi, Teo, Hazel, Oz, Beatriz, the Resident. Many of them come back later: Bruno, Sofi, Broh, Kiki, Tobi, Tristan.

## 8. Endings (eleven)
Forced by a bar: **The Long Walk to the Door** (weirdness full), **The Second Time** (passed out twice), **The Stall Hermit** (social zero), **The Early Uber** (bored too long), **House Lights** (08:00 without sunrise), **The Walk to the Taxi** (you leave on purpose).
On the roof, by state: **The Legend of La Grieta** (everyone, healthy, cared a lot, calm), **Barely, Beautifully** (made it in ruins), **Two Coffees** (Sol), **All of You, Still**, **An Empty Spot at the Rail** (someone is missing).
The Night Report lists your people and how they are, the ten most important moments of the night (from about fifty possible lines), and your final bars. It has no harm-reduction tally.

## 9. Look, sound, safety
- **Strictly monochrome** (#0A0A0A, #121212, #7F7F7F, #FFFFFF). Skin tones are four dither patterns. Zero radius, uppercase mono labels, binary hover.
- 256×144 canvas, 16 px tiles, procedural sprites (a character is one small spec), dithered darkness in the tunnel and dark room.
- **Audio**: raw Web Audio, look-ahead scheduler in a worker, limiter, per-room low-pass and reverb (muffled toilets, wet tunnel). Offline render check of all four styles: peak about −2.4 dBFS, RMS about −18.7 dBFS, crest about 16 dB, zero clipped samples. No fast flashing; calm mode removes sway and shake.
- **Trilingual** (EN/ES/PT), including aria-labels. The player's grammar can be neutral, masculine or feminine; the default is neutral and the writing avoids gendered adjectives for the player.
- Keyboard-first, with a touch D-pad. All timing minigames have a no-rhythm option.

## 10. How to extend
- **Dialogue** is data in `story_*.js`: `D.id = { who, start, nodes: { a: { text: T(en,es,pt) | [pages], choices: [{ tone, t, req, do, next, react, call }], branch: [{ req, to }] } } }`. `do` supports `fun soc hp weird care drink water time at flag unflag item bond fx quest open join leave goto call end say`.
- **Zones** are built with a small DSL in `world.js` (`room fill crowdRect door npc obj trig sign light`).
- **Callbacks**: set a flag in one place, read it in `when` or `req` somewhere else.
- **Scripts** (`EM.scripts.*`) are the glue for minigames, pill effects, pass-outs and endings.

## 11. Known gaps and ideas for next
- Real playtest on real people. Balance numbers are first-pass.
- The tunnel and Sala 2 could take more encounters. A medic-tent chapter, an after-hours walk home, a second night.
- Deep links to a single game (`/games?game=excuse-me`).
- Gamepad support. Save slots.
- Optional: the closing DJ as a cameo of the real ÆRIEL.


## v0.3 changes
- **Colour**: black-dominant world with neon trim and per-zone themes; colourful characters (6 skin tones, 9 hair styles, 10 hair colours, 11 tops, 6 bottoms, accents). Brutalist frame unchanged. Documented as an exception in AGENTS.md.
- **Taller characters**: 16x32 sprites (18x34 with outline), with face, hair, clothes and accessories visible; the canvas is 320x180 with 16px tiles.
- **Crowd attitude**: yielders (~80%), stubborn (~12%, hold their ground and slow you), hostile (~8%, antagonistic when you say "excuse me"; four handled dialogues).
- **Hard reset**: ban, ambulance (second faint) and `fedup` (bad-decision counter >= 11) offer BEGIN AGAIN: IT IS 22:00 with the same player and seed; lessons are shown at the start of the next night. The first faint is a soft fail (wake in the welfare room).
- **Dark room**: blind navigation with a Z reach (torch radius), spatial murmurs and tap cues, embers and a curtain thread; touching unseen people costs weirdness.
- **ÆRIEL** is the resident DJ, with Æ000.X jokes on the list, the rules and the vibe.
- **Weirdness**: decays -0.03/min always, -0.05/min extra after 12 game-minutes without misbehaving.
- **Links**: own link per game (see AGENTS.md section 11).
- Deferred: own music, further chapters.


## v0.4 changes
- **Bar colours**: HEALTH red, FUN blue, WEIRDNESS green, SOCIAL yellow. The low-bar alert inverts to white.
- **Consequences**: every non-free choice costs SOCIAL and a minute. Rude (`bad`) choices raise crowd reputation `s.rep`; care, apology and hugs lower it. Reputation shifts the share of stubborn and hostile dancers (rep 8: about 24% hostile; rep -4: none) when a zone is entered. Nagging a stubborn dancer three times turns them hostile. Hostile outcomes also move friends' bonds (`pb`) and set flags used by the morning-after messages.
- **Drugs**:
  - MDMA: dialogue pays more (SOCIAL gains x1.5, FUN x1.25, bonds x1.5); weirdness +0.12/min.
  - MDMA with a stimulant (meth, cocaine): weirdness +0.07/min (less than MDMA alone); dancing costs HEALTH.
  - Cocaine: dancing costs HEALTH; weirdness +0.04/min; you keep the same lessons a sober character would, even if you also drank (no extra payoff).
  - Ketamine: 50% faint (a passout; the second is the ambulance) or 50% boost (+SOCIAL, +FUN, dialogue boost); weirdness +0.12/min, the same as MDMA.
  - White powders: told cocaine or told ketamine, about 1 in 5 times it is the other one. Sources: Dragan (honest label, loose labels), Rico (K) and Hugo (his tin).
- **Lessons**: only a clear-headed night teaches. If you drank or took MDMA, meth, ketamine or a fake pill, this night's lesson is lost (earlier lessons stay). Cocaine overrides that.
- **Running gags** escalate (`s.gags`, carried across nights): ÆRIEL, Dragan, Luca, Hugo, and the friends' déjà vu barks.
- **The morning after**: a phone thread on the ending card for non-reset endings. Each friend takes someone home, checks in, says thanks, was lost, or needs to talk (low bond), plus up to four messages that reference your choices.


## v0.5 changes
- **Venue choice** (creator, carried through BEGIN AGAIN): ESTABLISHED CLUB or ILLEGAL RAVE.
  - Club: guards in the doors, foyer, main floor and courtyard notice strangeness (WEIRDNESS >= 35 climbs there; quiet rooms are not watched); buying from a dealer costs WEIRDNESS and about half the time a guard sees it (extra WEIRDNESS and a bad-decision point); full WEIRDNESS is a ban.
  - Rave: no security. Drug-related WEIRDNESS is x0.4, dealers carry no consequence, freestyle dancing gives +4 FUN and a small HEALTH gain (+1.5) instead of costing health. Full WEIRDNESS is the `frozenout` ending (the crowd closes up), also a reset.
- **Cocaine** is no longer a reward: it keeps the same lessons a sober character would keep, nothing more (no recap). It still costs health when dancing.
- **Morning thread**: about a third of mornings, one friend answers another's message.
- Ketamine is unchanged.


## v0.6 changes
- **Layout**: HUD and the stage (560px canvas) on the left, a persistent NIGHT LOG on the right (below 900px it sits under the stage). The dialogue panel is compact (max 232px, scrolls). With a dialogue open the page is about 720px tall.
- **Night log** (`U.logAdd` / `U.renderLog`, stored in `s.log`, 160 entries, newest first, saved with the run): every toast (consequences such as the bitter drip, status changes, guard sightings), the narrative reaction after each choice, and one line of stat/bond deltas per choice. Self-barks are not logged.
- **Making out** (`makeout` tone, effect `makeout:{p,time}`, `L.makeOut`): always after asking, and an honest "no" is free. Success: FUN +10 to +14, SOCIAL +3, WEIRDNESS -1. Failure: FUN -7 to -10, and 50% of the time WEIRDNESS +8. Chance = base (0.68 after warming up, 0.4 cold) adjusted by MDMA/ketamine (+), a drink or two (+), three or more drinks (-), WEIRDNESS >= 60 (-), SOCIAL < 25 (-), FUN >= 70 (+), being fresh (mint, mirror, glitter) (+), Dani as wingman (+).
- **New people** (`story_v5.js`): Kai (busker), Paula (lighter loan), Pia and Moe (a missing-friend chain), Bruce (guard, club only), Gus (air DJ), Ana-Lu (line dance), Wen and Zhao, Lupe, Otto, Yui (rock paper scissors), Sia (poems), Ruth (quiet room tea), Cleo (a note for ÆRIEL), and six flirts: Vera, Ines, Rafa, Mina, Nox (the dark room, consent by words and taps) and Ludo (the roof).
- **Things** (`story_v6.js`): photo booth, vending machine, lost phone, long mirror, the DJ's tracklist. Five **moments your friends bring you** (a dare, a selfie, a quiet minute, a crush, a pastry, a water toast), and twelve more ambient events.
- **Morning thread**: sixteen more reference messages; the night's seed picks which are shown (up to five).


## v0.7 changes
- **Layout**: HUD, then a slim NIGHT LOG strip (66px, newest first, scrolls), then the stage at full width (about 880x495 at the 900px container, roughly 70% of a 720px window). Dialogue is drawn over the lower part of the stage (max 64% of it, scrolls) instead of below it, so the page stays about 720px tall in every mode.
- **Tutorial** (`tutorial.js`): five cards after the intro, first time only (localStorage `excuse-me-tutorial`), replay from MENU > SETTINGS > HOW TO PLAY. Cards: move and talk; choosing words; crowds (excuse me); dancing (a floor mark, arrows on the beat, group phrases, NO-RHYTHM); the four bars and the log. Keys: Z/Enter next, X/Esc skip, arrows back/next; touch pad A/B; buttons.
- **Kisses are remembered** (`makeout` effect takes `who`): friends react a couple of seconds later (three lines per friend per outcome, plus strangers). About 90 game-minutes later the person turns up again somewhere else (a dialogue for a good kiss: round two, trade numbers, a slow dance, goodnight; a different one for a flop: laugh it off, try again, apologise, trade numbers). Trading numbers sends a morning message from them. Two or more kisses earns a spreadsheet joke from Dani.
- **Payoffs with variety** (`story.pays`): Cleo's note, Pia and Moe, the lost phone (returned or snooped), Lupe, Kai, Bruce (club), Sia's poem and Yui each pay off after a delay, and the night's seed picks one of three shapes: later tonight (a toast with an effect), only in the morning, or both.


## v0.8 changes
- **Tutorial prompt**: the full tutorial plays on the first run in a browser. Every later run opens with a pop-up question ("WANT THE TUTORIAL AGAIN?", Z yes / X no) after the intro.
- **Dancing with a person** (`dance.js`): a set of eight named four-arrow combos (`EM.MOVES`: shuffle, spiral, elevator, wave, drop, sway, apology, bassline). A partner dance is four rounds inside the dialogue panel (one move, one move, two chained, three chained). Their arrows appear one at a time on a tempo set by the person (Nox slow, Dani fast), and you copy each with the same arrow within the window. NO-RHYTHM waits for each press. Result: win (85%+ hits and three perfect rounds), partial, fail, or bow out. A win gives FUN, SOCIAL, friend bond, or warms up a flirt (raising the kiss chance). Used by the six flirts (the dance choice), Maru, Dani and Tato (new moments), and Hugo ("teach me a step").
- **Being pushy**: after a flop the person stays for a while. Asking again within 45 game-minutes gets a firm no: reputation +1.5, FUN -5, WEIRDNESS +4, SOCIAL -2, a bad-decision point, and they leave. Two flops with the same person ends it. A kiss that works also ends the conversation.

- **A dance win is permission**: winning a partner dance with a flirt raises the kiss chance to 0.82 (0.68 after other warming up, 0.4 cold).


## v0.9 changes
- **Crowd**: 90% of dancers yield, 7% are stubborn, 3% hostile. Only about half of hostile glares escalate to a dialogue, and no more than one per 45 seconds. Nagging a stubborn dancer turns them after four asks.
- **One dance rule**: every dance, solo, group or partner, now works the same way: arrows come to you on the beat (or one by one in a partner's dialogue) and you press the matching one. The watch-then-repeat memory gates are gone (`U.danceGate` is a thin wrapper over the follow mechanic, window 0.55 beat; win at 65% of arrows, partial at 35%). Partner dances are 10% slower with a wider window.
- **Music**: 10 variants in four pools (warm: warm/house/disco; techno: techno/acid/minimal; hard: hard/trance/techno/dub; attic: trance/house/acid/disco). Eight-bar phrases breathe (full, groove, break with a pad and a fill, crash after a break), the root moves every 32 bars, and every 4 to 7 phrases the DJ moves to another variant (never while you dance). A rare dub phrase makes ISI whisper "FINALLY". Offline renders: peaks -2.2 to -2.4 dBFS, no clipping.
- **Isi** (was Nuri) runs the checking table: kind, loves seafood and tattoos, thinks the DJ does not play enough dubstep (a complaint that escalates across nights). She draws a temporary octopus (Gerard).
- **The queue has a dealer** (Tico): MDMA, cocaine, ketamine (never meth: meth only ever appears as something mixed into MDMA). A purchase goes into your pockets (MENU > STATUS > TAKE IT) and its real contents are hidden: MDMA is 70% MDMA / 15% spiked with meth / 15% not what it says; coke and ketamine swap 20%. Isi tests each kind for free (reagent animation), tells you what it looks like, and offers the bin.
- **Errand web** (`story_v9.js`): ROSA'S LIST (an unwell person via Teo, the closet key via Luca, a bucket from the quiet room) ends with a lanyard (guards ignore you) and the staff corridor; BISCUIT'S PHONE (courtyard to Luca, which also unlocks the key); THE NAPKIN (Cleo to ÆRIEL, needs the staff corridor); KAI'S BATTERY (Bruce or Mina); THE HEADLAMP (Dani's crush: the gel is backstage); SIA'S LAST LINE (three words from Ruth, a voice in the dark and Gus); ISI'S SNACK RUN (the vending machine and Ines, ends with a TESTED OK wristband that removes dealer risk). The menu LOG shows live checklists.
- **Rosa tightened**: confrontation outcomes are now real branches. Ally or ok gets the list, cold gets a one-task probation, angry is cold until you have looked after three people (about 90 minutes). Rosa reports back, rewards by how many errands you did, and offers coffee afterward.
- **Dark room**: seven more people: Pau (consent-first massage, with a slow fade if you ask for more), the blindfold guessing game, Lyra reading (tender, funny, and the one you need water after), a couple looking for a third (rules first, 85% lovely and 15% an elbow problem), a slow dancer who wants to be led, the confession corner, and grapes by hand. Seven new sound cues. Adult, warm and never crass; every step is asked and a no is complete.
- **More copy**: four voices per friend per kind of text (home, safe, thanks, lost, cool), more answers between friends, and four closing paragraphs per ending chosen by the night's seed.

- **Pills have a shape and a stamp.** Buying MDMA, you pick the shape (round, heart, square, star, diamond) and the stamp (crown, heart, bolt, skull, smiley, Æ). Stamps lean the odds without ever being a guarantee: crown 80% MDMA but strong (extra FUN, WEIRDNESS and a little health cost); heart 80/10/10; bolt only 45% MDMA with a 40% chance of meth; skull a 30% chance it is fake; smiley and Æ are the baseline. Isi comments on the stamp when she tests it and reminds you a stamp is a story, not a lab report. The pocket list in MENU > STATUS draws a tiny pill with its stamp.

## v1.0 notes: cruising, the political rave, the pickpocket
- **Cruising** (`story_v12.js`): Diego, Marco, Elias, Ingrid, Nadia and Leila in the dark room. Four rolls (approach .88, eyes .84, touch .80, direct .90, all shifted by `L.makeoutChance`), a verbal-consent branch (+5 HEALTH/SOCIAL), and a rotating pool of three courteous refusals. Success HEALTH +25, SOCIAL +25, FUN +8; failure HEALTH −6, FUN −8. Morning texts from Dani (win) and Tato (miss).
- **The rave** (`story_v13.js`): no door and no guards, so everything is politics. Maya's clipboard starts two storylines. THE PETITION needs three of five signatures (Bea, Klaus, Madison, Juniper's committee, Sub). THE RAID resolves at minute 270: two preparations out of rights cards (Bea), power cut (Sub), lookout (Pip) and calm assembly (Juniper) averts it, and the petition counts as one more. The committee, Klaus and Madison carry the SJW and Berlin/Brooklyn jokes, each of whom signs or helps in the end.
- **Dealers**: four new rave dealers (Mambo, Spoke, Pixi, Doc) share Tico's menu and pill picker.
- **Pickpocket**: `EM.PICK_ODDS = 1500`. Hooks `U.startDialogue` (NPC encounters only). Effects in `S.pp_apply`; friends are locked into the party by wrapping `L.leave`, and `L.makeoutChance` gets +0.10.

## Pending
- **More political missions at the rave**: neighbours (noise complaint and a mediated truce), the owner (a phone call or visit before the sale), and a mutual-aid table (food and water collection) tied to the petition.
- **THE RAID (switched off)**: the 03:30 police scout at the rave, with its four preparations (rights cards from Bea, power cut with Sub, lookout with Pip, calm assembly with Juniper) and averted/hit outcomes. It is disabled with `RAID = false` in `story_v13.js`, with the code and texts kept. To bring it back: flip the switch, restore Maya's two-task briefing, and give it a visible cue (the music dropping and the lights changing at 03:30, not only a toast).
- Own music and next chapters (deferred by the user).
- Playtest passes: ES/PT strings read in-game, audio listened to.

## v1.1 notes: a bigger entourage
- **Five friends**: Maru, Benjamin (id `dani`), Fernando/Feña (id `tato`), plus **Vale** (a woman) and **Alex** (non-binary, -e forms in ES/PT). `EM.FRIENDS` is the full list; the plot checks (`allthree`, `together`, `need3`) use `EM.coreCount` so they still mean the first three. Vale hands out water every ~45 min; Alex starts the occasional slow dance.
- **Feña and the dark room**: very excited on entering; 50% of nights he stays in the dark room (found in a tasteful, implied threesome with two guys; thumbs up, wait for him, or call him out) and comes back by himself after 75 min. He only kisses men; his ex Mateo is a man.
- **Benjamin the capybara**: once per game hour, 25% chance (never during the pill/drop/regroup chapters, never after a pickpocket) he wanders off to meet people and returns 2 hours later, or when found, with a story where he explains he is a capybara and gets along with everyone.
- **Rave door code**: "el amanecer es un abrazo", asked by a voice through a slot; the right answer is always among four choices, the other three are jokes (nine in rotation, three rounds).

- **Pickpocket odds revised**: 1 in 1500 per conversation with a character (no crowd presses), only after `q1` is done and 8+ characters met. About 4% for a thorough night, so most people never see it.
- **Reduciendo Daño stand** (v15): proper name in all languages; Isi in a black RD T-shirt, crew in black-and-neon RD shirts (non-interactive), Camilo O. (founder of the real foundation, Chile) with the reduciendodano.cl Instagram line, club-wide overheard lines sending people to the stand. Sprites gained `look.tee` / `look.teeC` for chest lettering; the pixel font gained Ñ.

## UI cleanup pass: phones and short windows
- **Phones (≤700px)**: the HUD is one line (clock, place, water) plus one row of five buttons; the `[C] [I] [O] [L]` key hints are dropped on touch devices (`stripKeyHints()` in `hud2.js`; keyboards still see them). HUD went from about 221px to 153px tall. Menu, tutorial and pause are full-screen `position: fixed` sheets (`100dvh`, safe-area padding, sticky menu tabs) because inside the ~200px stage their buttons ended up off-screen.
- **Desktop and tablets (>700px)**: `fit()` in `hud2.js` measures everything around the stage into `--chrome`, and `#screen-game` is sized so the page fits `100dvh` (never narrower than 560px). At 1280x720 the page is exactly 720px tall instead of 743px and no longer scrolls.
- **Touch targets**: FULL LOG, the SIDE QUESTS chip and the menu tabs are 44px on `pointer: coarse`.
- **Narration** has no speaker, so the empty portrait box is hidden.
- **Taller portrait view**: the engine view is 320 wide and normally 180 tall. On phones `fit()` calls `E.setView(h)` (`engine.js`) with the height that fills the spare screen under the HUD, clamped to 180-270 (about 195 on a short 664px Safari viewport, 264-270 on an iPhone 14). The canvas aspect ratio follows (`style.aspectRatio`), the lighting mask is rebuilt, and the camera puts the player a little above centre (`camBias`, 30% of the extra height) so the dialogue panel, capped at 50% of the stage on phones, never covers them. Landscape and desktop go back to 180. Zones shorter than the view (tunnel 160px, backstage 192px) are centred with dark bars, as the tunnel already was.
- **Pending**: landscape phones narrower than 700px (for example an iPhone SE turned sideways) still scroll, because the fit-to-height rule only applies above 700px.
- **Dialogue sheet on phones**: ordinary dialogue is no longer an overlay on phones. The log strip moves under the controls (CSS `order`), and while a dialogue is open the D-pad, hint bar and log strip are hidden and the dialogue takes their place (`--dlg-room`, measured in `fit()`, about 211px; longer choice lists scroll inside it). X and Z sit in the dialogue header. Dance dialogues keep the overlay and the arrow pad. The game view height is frozen while a sheet is open so the stage never resizes mid-conversation.
- **Embedded height bug (fixed)**: in the Games hub the game's page grew to about 1400px on phones, with a black void under it and menu/pause sheets taller than the screen. Cause: the iframe height was reported from `documentElement.scrollHeight`, which can never be smaller than the iframe (a one-way ratchet), and `innerHeight`/`100dvh` inside the iframe are the iframe's own height. Now `postHeight()` measures `#app`, `realH()` asks the parent for the screen height (`--real-h`), the full-screen sheets use `min(100dvh, var(--real-h))`, and the host scrolls the frame under the header on phones.
- **Spent characters**: finishing a conversation with nothing new left no longer lets Z reopen the "we already talked" scene; Z becomes EXCUSE ME (and the hint shows it). See the AGENTS.md bullet for the exact rule and exemptions. Tune `SERVICE_DO` in `ui.js` if a repeatable character gets suppressed, or set a flag from the dialogue if they should react to something new.
- **Pace**: the night was running out before the missions did, so time now goes half as fast (`EM.PACE = 0.5` in `logic.js`). It scales the real-time clock and the time cost of conversations, kisses and partner dances (`L.spend`), not story skips or fixed-hour events, so the sunrise (roof opens at minute 450, close at 600) arrives about twice as late in real time. Per-minute drains (FUN, HEALTH, thirst, drug timers) are unchanged per game minute, so they drain half as fast per real second. If the night now feels too easy or too long, change PACE (0.7 is a middle value); if you add many more missions, lower it again.
- **Harder night, v2** (staff, FUN, HEALTH): FUN now starts at 5-25. Rudeness to staff is a hard line (`EM.STAFF`, `L.staffRude`): +30 WEIRDNESS, then ejection on the second offence; rude options were added to the coat check, the bar, the door and Rosa's toilets (`story_v19.js`). HEALTH losses are doubled, and under 40 HEALTH the picture blurs and words slip (see the AGENTS.md bullet for the numbers). Tuning knobs: `EM.HP_LOSS`, `EM.LOW_HP`, the 15%-60% curve in `L.misspeakP`, the 30/50 weirdness in `L.staffRude`, and the start range in `core.js`. With PACE at 0.5 the per-real-second HEALTH drain is about the same as before; per game minute it is doubled.

