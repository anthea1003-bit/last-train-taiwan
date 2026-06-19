# Product Specification

## Title

Traditional Chinese: `最後一班不存在的環島列車`

English: `The Last Impossible Round-Island Train`

## Premise

The player is a traveler who has lost their identity. They board a mysterious
night train that does not appear on any timetable. Taiwan's landmarks have
been displaced by a parallel-world disturbance. Each repaired region returns
a fragment of the player's memory and reveals why they boarded the train.

The player is always human. The emotional arc is about recovering identity,
finishing an unfulfilled journey, and choosing what to do with the truth.

## Audience And Session

- General public, including local players and international visitors.
- Traditional Chinese and English.
- Target first-play duration: 15 minutes.
- Responsive browser experience for mobile and desktop.

## Tone

Magical and healing rather than frightening. The train is mysterious but
protective. Mistakes should lead to gentle consequences, not punishment.

## World And Route

The main journey has six fixed regions:

1. North: Jiufen and the Pingxi Line.
2. Taoyuan-Hsinchu-Miaoli: Neiwan Old Street and Hakka mountain-town culture.
3. Central: Sun Moon Lake.
4. Yunlin-Chiayi-Tainan: Anping Fort and Chihkan Tower.
5. Kaohsiung-Pingtung: Pier-2 Art Center and Cijin.
6. East: Taroko Gorge.

Hidden seventh station:

7. Penghu: basalt landscapes, Penghu Great Bridge, and Magong Old Street.
   It has no railway connection and appears only when memory makes an
   impossible route real.

## Core Loop

```text
Arrive at a landmark
-> discover a parallel-world displacement
-> solve a visual puzzle, dialogue mystery, or travel decision
-> repair the region
-> receive a ticket stamp and possibly a memory fragment
-> return to the carriage for deduction
-> travel to the next station
```

## Play Modes Within One Journey

- Scene anomaly: identify misplaced objects or cultural details.
- Passenger dialogue: compare testimony from travelers from different eras.
- Travel decision: choose transport, food, or exploration using time and fare.
- Carriage deduction: review clues and decide which memory belongs to the
  player.
- Small random events: select one of two or three variants per region to
  improve replay value without breaking the fixed story.

## Resources

- Time: starts at 15.
- Fare: starts at NT$1,500.
- Memory fragments: 0 of 6.
- Ticket stamps: 0 of 6.
- Helped passengers: tracked for ending selection.
- Secret ticket: hidden boolean required for the true ending.

Resources never cause a hard game over:

- Low time removes optional clues.
- Low fare unlocks a basic route supplied by the conductor.
- Incorrect answers cost a small amount of time and reveal a gentle hint.
- Missing memories still permits a normal ending.

## Endings

Normal endings:

- Return Home: the player accepts their recovered past.
- Keep Traveling: the player releases the past and chooses a new journey.
- Train Guardian: the player stays to help other lost travelers.

Hidden true ending:

- Penghu Seventh Station: requires six memory fragments and the secret ticket.
  At dawn, the train crosses the sea so the player can complete a final
  promise and return with an integrated memory.

## Interface

- Main screen resembles an open watercolor travel journal.
- Route map shows stations, rail line, stamps, and current location.
- Landmark scenes contain inspectable objects.
- Carriage dialogue uses illustrated portraits and explicit choices.
- Event cards display time and fare consequences before confirmation.
- Ticket status remains visible but compact.
- Travel journal stores landmark facts, passenger stories, and clues.

Agent-like in-game roles use deterministic rules, not models:

- Conductor: missions and gentle hints.
- Travel Planner: compares time and fare.
- Memory Detective: organizes testimony and clues.

## Visual Direction

- Japanese animated-film framing.
- Vintage Taiwan railway tickets, stamps, signage, and carriage details.
- Hand-painted watercolor landscapes and paper texture.
- Night indigo, oxidized railway green, warm station-lamp gold, and restrained
  coral accents.
- Lightweight watercolor blooms, ticket stamping, train movement, and lamp
  flicker animations.
- Reduced-motion setting.

## Privacy And Cost

- No account.
- No geolocation.
- No personal information collection.
- No advertising or analytics in the first release.
- No runtime model or paid API calls.
- Progress stored in versioned `localStorage`.
- Free static hosting target: GitHub Pages.

## Non-Goals For Version 1

- Multiplayer.
- Cloud save.
- Leaderboards.
- Real-time AI chat.
- Visual level editor.
- Google Cloud deployment.
