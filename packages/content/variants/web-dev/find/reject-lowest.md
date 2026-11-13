```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="The home page of Orbital Station 7: news from the station, visiting hours and the rules on board." />
    <title>Station Log</title>
    <link rel="stylesheet" href="style.css" />
    <script src="menu.js" defer></script>
  </head>
  <body>
    <header>
      <p class="site-name">Orbital Station 7</p>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav aria-label="Main menu">
        <a href="index.html">Home</a>
        <a href="crew.html">Crew</a>
        <a href="schedule.html">Schedule</a>
        <a href="boarding.html">Boarding</a>
        <a href="wiki.html">Wiki</a>
        <a href="dashboard.html">Dashboard</a>
      </nav>
    </header>
    <main>
    <h1>Welcome aboard</h1>
    <div class="welcome">
      <div class="photo">
        <img src="img/station.svg" alt="A gold station hub inside a blue ring, with a solar panel on each side"
          width="240"
          height="150"
        />
        <span class="caption">Seen from a supply ship</span>
      </div>
      <div class="welcome-text">
        <p>The station goes round the Earth every 92 minutes.</p>
        <p>Six people live here, with a greenhouse full of tomatoes.</p>
      </div>
    </div>
    <nav class="jumps" aria-label="On this page"><a href="#today">Jump to today</a> · <a href="#visiting">Visiting hours</a></nav>
    <p><a href="crew.html">Meet the crew</a></p>

    <h2>About the Station</h2>
    <p>Five space agencies built the station together in 2031, and <em>every</em> one of them still sends crew.</p>
    <p class="address">
      Orbital Station 7<br />
      Docking Ring B<br />
      Low Earth Orbit
    </p>
    <p>On board: <mark>a gym</mark>, <mark>a greenhouse</mark> and <mark>a telescope</mark>.</p>
    <p>Read more in the crew's wiki: <a href="wiki-greenhouse.html">the greenhouse</a> and <a href="wiki-airlock.html">the airlock</a>.</p>
    <p>
      Curious how real stations work?
      <a href="https://en.wikipedia.org/wiki/Space_station" target="_blank" rel="noopener">Read about space stations</a>
    </p>
    <h3>The Greenhouse</h3>
    <p>Tomatoes, beans and basil grow under blue lamps.</p>

    <img src="img/divider.svg" alt="" />

    <h2 id="today">Today on Board</h2>
    <p class="warning urgent"><strong>Hatch 3 stays closed</strong> while the outer panels are repaired.</p>
    <p>Water left: 900 litres of H<sub>2</sub>O.</p>
    <p>Height: 4 × 10<sup>5</sup> metres above the Earth.</p>
    <p>Next supply ship: <mark>Friday</mark>. <!-- <small>Docking fee: 20 credits a day.</small> --></p>
    <h3 class="shift">Morning Shift</h3>
    <p>Commander Vega and engineer Okafor.</p>
    <h3 class="shift">Night Shift</h3>
    <p>Pilot Lindqvist, alone with the stars.</p>

    <h2 id="visiting">Visiting Hours</h2>
    <p class="hours">
      Monday to Friday: 10:00 to 16:00<br />
      Saturday: 10:00 to 12:00<br />
      Sunday: closed
    </p>
    <p class="warning"><strong>Visitors must wear a badge</strong> at all times.</p>

    <h2>Station Rules</h2>
    <p>Wear your badge at all times.</p>
    <p>Close every hatch behind you.</p>
    <p>No running in the greenhouse.</p>

    <p><a href="mailto:crew@station.example">Write to the crew</a></p>
    </main>

    <footer>
      <p>Orbital Station 7 · Docking Ring B · Low Earth Orbit</p>
      <p>Written by the crew, for everyone on board and back on Earth.</p>
    </footer>
  </body>
</html>
```

```image img/station.svg

```

```image img/divider.svg

```

```image img/earth-small.jpg

```

```image img/earth-large.jpg

```

```image img/earth-square.jpg

```

```video video/launch.webm

```

```audio audio/countdown.mp3

```

```text video/launch.vtt
WEBVTT

00:00.000 --> 00:01.000
[The engines start: a low rumble]

00:01.000 --> 00:05.000
[The rumble grows as the rocket rises]
```

```css style.css
body {
  background-color: #0b1d3a;
  box-sizing: border-box;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
  color: #f0f4ff;
  font-family: Verdana, Geneva, sans-serif;
}

h1 {
  color: #ffd166;
  font-family: Georgia, "Times New Roman", serif;
  margin-top: 0;
  text-align: center;
  font-size: 2.5rem;
}

h2 {
  color: #8ecbff;
  text-decoration: underline;
  letter-spacing: 2px;
}

a {
  color: #5fd3c6;
  text-decoration: none;
}

.warning {
  color: #ffb3b3;
  background-color: rgb(255, 80, 80, 0.2);
}

#today {
  color: #7bd389;
}

.shift {
  color: #a9c1dc;
  text-transform: uppercase;
  font-weight: normal;
}

.urgent {
  color: #ffd166;
}

p {
  color: #f0f4ff;
  line-height: 1.6;
  font-size: 1.125rem;
}

h3 {
  color: #c5e1a5;
}

.address {
  color: rgb(169, 193, 220);
  font-style: italic;
}

.jumps {
  text-align: center;
}

img {
  max-width: 100%;
  height: auto;
}

.hours {
  background-color: #13294f;
  color: #ffd166;
  font-family: "Courier New", monospace;
  text-align: center;
}

.card {
  background-color: #13294f;
  padding: 16px;
  border: 2px solid #2c4a7a;
  margin-bottom: 24px;
  width: 260px;
  box-sizing: border-box;
  min-height: 140px;
  display: inline-block;
  vertical-align: top;
  margin-right: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgb(0, 0, 0, 0.5);
}

.duties {
  background-color: #13294f;
  padding: 16px 16px 16px 40px;
  box-sizing: border-box;
  max-width: 600px;
  margin: 16px auto;
  border-left: 4px solid #ffd166;
  border-radius: 0 12px 12px 0;
}

nav {
  text-align: center;
}

nav a {
  display: inline-block;
  padding: 8px 12px;
}

.bio {
  max-height: 100px;
  overflow-y: auto;
}

.card h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role {
  background-color: #2c4a7a;
  color: #ffd166;
  padding: 2px 8px;
  border-radius: 6px;
}

#flights td {
  padding: 8px 12px;
  color: #c9d6ea;
}

#flights th {
  padding: 8px 12px;
  background-image: linear-gradient(90deg, #13294f, #2c4a7a);
}

.decks > li {
  margin-bottom: 12px;
}

h1 + p {
  font-style: italic;
}

#flights {
  border-collapse: collapse;
  font-family: "Courier New", monospace;
}

#flights td,
#flights th {
  border-bottom: 1px solid #2c4a7a;
}

a[target="_blank"] {
  text-decoration: underline;
}

#flights tbody tr:hover {
  background-color: #1e3a5f;
}

a:focus {
  outline: 3px solid #ffd166;
}

#flights tbody tr:nth-child(even) {
  background-color: #13294f;
}

#flights caption::before {
  content: "✈ ";
}

#crew li::marker {
  color: #ffd166;
}

h1 + p::first-letter {
  font-size: 2em;
}

#flights .delayed td {
  color: #ffd166;
}

#flights .cancelled td {
  color: #ff8a80;
}

.banner {
  background-image: url("img/station.svg");
  background-size: cover;
  background-position: center;
  height: 160px;
  border-radius: 12px;
}

#flights td.status::before {
  content: "● ";
}

#flights .boarding td.status {
  color: #7bd389;
}

#flights .on-time td.status {
  color: #8ecbff;
}

.hide-cancelled .cancelled {
  display: none;
}

input,
select,
textarea,
button {
  font: inherit;
}

label {
  display: block;
  margin-top: 16px;
  margin-bottom: 4px;
}

input[type="radio"] + label,
input[type="checkbox"] + label {
  display: inline;
}

textarea {
  display: block;
  margin-bottom: 24px;
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 3px solid #ffd166;
  outline-offset: 2px;
}

input:user-invalid,
select:user-invalid {
  border: 2px solid #ff8a80;
}

input:checked + label {
  color: #ffd166;
  font-weight: bold;
}

input:disabled + label {
  color: #8a9bb5;
}

input[type="checkbox"],
input[type="radio"] {
  accent-color: #ffd166;
}

fieldset {
  margin-top: 24px;
  margin-bottom: 24px;
}

button[type="submit"] {
  background-color: #ffd166;
  color: #0b1d3a;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
}

button[type="reset"] {
  background-color: transparent;
  color: #a9c1dc;
  padding: 8px 16px;
  border: 1px solid #2c4a7a;
  border-radius: 8px;
}

#booking {
  background-color: #13294f;
  max-width: 560px;
  margin: 0 auto 32px;
  padding: 8px 24px 24px;
  border-radius: 12px;
}

header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.wiki-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.wiki-list article {
  background-color: #13294f;
  padding: 0 16px;
  border-radius: 12px;
  width: 240px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.wiki-list h2 + p {
  flex-grow: 1;
}

.wiki-page {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.wiki-page article {
  flex-basis: 400px;
  flex-grow: 1;
}

.fact-box {
  flex-basis: 240px;
  align-self: flex-start;
  background-color: #13294f;
  padding: 0 16px;
  border-radius: 12px;
  order: -1;
}

.site-name {
  flex-shrink: 0;
}

header nav {
  margin-left: auto;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  background-color: #ffd166;
  color: #0b1d3a;
  font-size: 0.75rem;
  letter-spacing: normal;
  position: absolute;
  top: 8px;
  right: 8px;
}

.wiki-list article {
  position: relative;
}

.to-top {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 12px;
  background-color: #13294f;
  border: 2px solid #5fd3c6;
  border-radius: 8px;
  z-index: 10;
}

header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #0b1d3a;
}

.welcome {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
}

.welcome-text {
  flex-basis: 300px;
  flex-grow: 1;
}

.photo {
  position: relative;
}

.caption {
  position: absolute;
  left: 8px;
  bottom: 12px;
  padding: 2px 8px;
  border-radius: 6px;
  background-color: #2c4a7a;
  color: #f0f4ff;
  font-size: 0.875rem;
}

.picked {
  outline: 3px solid #ffd166;
  outline-offset: 4px;
}

header nav.closed {
  display: none;
}

#menu-button {
  margin-left: auto;
}

header nav {
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 8px;
  background-color: #13294f;
  border-radius: 0 0 12px 12px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  grid-template-rows: 200px;
  grid-auto-rows: 150px;
  gap: 16px;
}

.stat {
  background-color: #13294f;
  padding: 0 16px;
  border-radius: 12px;
  display: grid;
  justify-items: center;
  align-items: center;
}

.stat h2 {
  font-size: 1rem;
  text-decoration: none;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd166;
}

.panels {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "pad"
    "launch"
    "countdown"
    "duty";
  gap: 24px;
}

#pad-panel {
  grid-area: pad;
}

#launch-panel {
  grid-area: launch;
}

#countdown-panel {
  grid-area: countdown;
}

#duty-panel {
  grid-area: duty;
}

#on-duty {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  list-style: none;
}

#on-duty li {
  background-color: #13294f;
  padding: 4px 12px;
  border-radius: 16px;
}

.panels figure {
  margin: 0;
}

video {
  max-width: 100%;
  height: auto;
}

.week {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 0;
  list-style: none;
}

.week li {
  background-color: #13294f;
  padding: 12px 0;
  border-radius: 8px;
  text-align: center;
}

.earth {
  width: 100%;
}

.gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.gallery figure {
  display: grid;
  justify-items: center;
}

@media (min-width: 568px) {
  #crew-count {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
  }

  #next-launch {
    grid-column: span 2;
  }

  .week {
    grid-template-columns: repeat(7, 1fr);
  }
}

@media (min-width: 656px) {
  .gallery {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 776px) {
  .panels {
    grid-template-columns: 1fr minmax(300px, 1fr);
    grid-template-areas:
      "pad launch"
      "countdown duty";
  }
}
```

```html crew.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Meet the crew of Orbital Station 7: who they are, what they do and how many hours they work." />
    <title>Crew Directory</title>
    <link rel="stylesheet" href="style.css" />
    <script src="check.js" defer></script>
    <script src="crew.js" defer></script>
    <script src="countdown.js" defer></script>
    <script src="menu.js" defer></script>
  </head>
  <body>
    <header>
      <p class="site-name">Orbital Station 7</p>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav aria-label="Main menu">
        <a href="index.html">Home</a>
        <a href="crew.html">Crew</a>
        <a href="schedule.html">Schedule</a>
        <a href="boarding.html">Boarding</a>
        <a href="wiki.html">Wiki</a>
        <a href="dashboard.html">Dashboard</a>
      </nav>
    </header>
    <main>
    <h1>Crew Directory</h1>
    <p>Everyone who lives and works on the station, and where to find them.</p>
    <p id="status"></p>
    <button type="button" id="wake">Wake the crew</button>
    <button type="button" id="on-duty">Who's on duty?</button>
    <p id="duty-today"></p>
    <p>Oxygen tanks: <span id="tanks">7</span>, each lasting <span id="tank-hours">20</span> hours.</p>
    <p id="oxygen"></p>
    <p id="oxygen-days"></p>
    <button type="button" id="alarm">Sound the alarm</button>
    <p id="intercom"></p>
    <button type="button" id="call-dinner">Call to dinner</button>
    <button type="button" id="call-bridge">Call to the bridge</button>
    <p>Meet our commander, <a href="people/vega.html">Mara Vega</a>.</p>
    <p><a href="#duty">See today's duties</a></p>
    <p><a href="index.html">Back to the home page</a></p>

    <h2>Crew</h2>
    <ul id="crew">
      <li>Mara Vega</li>
      <li>Tomas Okafor</li>
      <li>Ines Lindqvist</li>
      <li>Kenji Arano</li>
    </ul>
    <p id="roster"></p>
    <p id="everyone"></p>
    <button type="button" id="add-rookie">Add a rookie</button>
    <button type="button" id="remove-last">Remove the last</button>
    <p id="latest"></p>
    <p id="welcome-list"></p>
    <button type="button" id="roll-call-button">Roll call</button>
    <ol id="roll-call"></ol>
    <p id="roll-summary"></p>

    <h2>Morning Routine</h2>
    <ol>
      <li>Check the oxygen readings</li>
      <li>Water the greenhouse</li>
      <li>Report to the commander</li>
    </ol>

    <h2>Decks</h2>
    <ul class="decks">
      <li>
        Upper Deck
        <ul>
          <li>Bridge</li>
          <li>Observatory</li>
        </ul>
      </li>
      <li>
        Living Deck
        <ul>
          <li>Galley</li>
          <li>Sleeping pods</li>
          <li>Gym</li>
        </ul>
      </li>
      <li>
        Lower Deck
        <ul>
          <li>Cargo bay</li>
          <li>Greenhouse</li>
        </ul>
      </li>
    </ul>

    <div id="cards">
      <div class="card">
        <h3>Mara Vega</h3>
        <p>Job: <span class="role">Commander</span></p>
        <p>Hours this week: <span class="worked">12</span></p>
        <p class="bio">Twenty years in orbit, three of them in charge of this station. Knows every bolt by its first name, still checks the airlocks herself before bed, and has never once been late for a docking.</p>
      </div>
      <div class="card">
        <h3>Tomas Okafor</h3>
        <p>Job: <span class="role">Engineer</span></p>
        <p>Hours this week: <span class="worked">18</span></p>
        <p class="bio">Keeps the power on and the water clean. Spends his free time building a clock out of spare parts that has never once shown the right time, and says that is the point.</p>
      </div>
      <div class="card">
        <h3>Ines Lindqvist</h3>
        <p>Job: <span class="role">Pilot</span></p>
        <p>Hours this week: <span class="worked">9</span></p>
        <p class="bio">Flies the supply runs and the rescue drills. Holds the station record for the softest docking, and reminds everyone of it at dinner, every dinner, without fail.</p>
      </div>
      <div class="card">
        <h3>Kenji Arano</h3>
        <p>Job: <span class="role">Botanist</span></p>
        <p>Hours this week: <span class="worked">22</span></p>
        <p class="bio">Grows the tomatoes, the beans and the only flowers for four hundred kilometres. Talks to the plants every morning, and claims that they answer.</p>
      </div>
    </div>
    <p id="hours-total"></p>

    <h2 id="duty">Duty Board</h2>
    <ol class="duties">
      <li>
        Inspect the solar panels
        <ul>
          <li>Tomas Okafor</li>
          <li>Ines Lindqvist</li>
        </ul>
      </li>
      <li>Harvest the greenhouse</li>
      <li>Log the day's dockings</li>
    </ol>
    </main>

    <footer>
      <p>Orbital Station 7 · Docking Ring B · Low Earth Orbit</p>
      <p>Written by the crew, for everyone on board and back on Earth.</p>
    </footer>
  </body>
</html>
```

```html people/vega.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Commander Mara Vega: twenty years in orbit, three of them in charge of Orbital Station 7." />
    <title>Mara Vega</title>
    <link rel="stylesheet" href="../style.css" />
    <script src="../menu.js" defer></script>
  </head>
  <body>
    <header>
      <p class="site-name">Orbital Station 7</p>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav aria-label="Main menu">
        <a href="../index.html">Home</a>
        <a href="../crew.html">Crew</a>
        <a href="../schedule.html">Schedule</a>
        <a href="../boarding.html">Boarding</a>
        <a href="../wiki.html">Wiki</a>
        <a href="../dashboard.html">Dashboard</a>
      </nav>
    </header>
    <main>
    <h1>Commander Mara Vega</h1>
    <img
      src="../img/station.svg"
      alt="The station she commands: a gold hub inside a blue ring"
      width="240"
      height="150"
    />
    <p>Twenty years in orbit, three of them in charge of this station.</p>
    <p><a href="../crew.html">Back to the crew directory</a></p>
    </main>

    <footer>
      <p>Orbital Station 7 · Docking Ring B · Low Earth Orbit</p>
      <p>Written by the crew, for everyone on board and back on Earth.</p>
    </footer>
  </body>
</html>
```

```js crew.js
// The crew directory's script: it greets the crew and reports to the console
// alert("Crew directory ready");
console.log("Crew directory loaded");
console.log(4);

const minutesPerOrbit = 92;
let crewCount = 4;
console.log("Minutes per orbit:", minutesPerOrbit);
console.log("Crew on board:", crewCount);

// A supply ship docks with two new crew members
crewCount = crewCount + 2;
console.log("Crew on board:", crewCount);

const oxygenTanks = 7;
const hoursPerTank = 20;
console.log("Oxygen tanks:", oxygenTanks);
console.log("Hours per tank:", hoursPerTank);

const newFirstName = "Lena";
const newLastName = "Park";
console.log("New arrival: " + newFirstName + " " + newLastName);

const crewNumber = 7;
console.log(`Welcome aboard, ${newFirstName} ${newLastName}! You are crew member ${crewNumber}.`);

const newFullName = `${newFirstName} ${newLastName}`;
console.log("Badge: " + newFullName.toUpperCase());
console.log("Letters in the name:", newFullName.length);

console.log(`Lena says: "Hi everyone, I'm so happy to be here!"`);

const crewList = document.querySelector("#crew");
console.log(crewList);
const dutyHeading = document.querySelector("#duty");
console.log(dutyHeading);

const status = document.querySelector("#status");
status.textContent = "Directory checked";
console.log(document.querySelector("h1").textContent);

const wakeButton = document.querySelector("#wake");
wakeButton.addEventListener("click", () => {
  status.textContent = "The crew is awake";
});

const onDutyButton = document.querySelector("#on-duty");
const dutyToday = document.querySelector("#duty-today");
onDutyButton.addEventListener("click", () => {
  const name = document.querySelector("#cards .card h3").textContent;
  dutyToday.textContent = `${name} is on duty today`;
});

const oxygenHours = oxygenTanks * hoursPerTank;
console.log(`Oxygen lasts ${oxygenHours} hours`);
console.log("Hours past the last full day:", oxygenHours % 24);
console.log("Full days of oxygen:", Math.floor(oxygenHours / 24));
console.log("Tanks for 31 days:", Math.ceil((31 * 24) / hoursPerTank));

const tanksOnPage = Number(document.querySelector("#tanks").textContent);
const hoursOnPage = Number(document.querySelector("#tank-hours").textContent);
document.querySelector("#oxygen").textContent = `Oxygen lasts ${tanksOnPage * hoursOnPage} hours`;

const shifts = ["Morning", "Day", "Night"];
console.log("First shift:", shifts[0]);
console.log("Last shift:", shifts[shifts.length - 1]);

shifts.push("Evening");
console.log("Shifts:", shifts.length);
const cancelled = shifts.pop();
console.log("Cancelled:", cancelled);
console.log("Shifts:", shifts.length);

function updateRoster() {
  const crewCountOnPage = document.querySelectorAll("#crew li").length;
  document.querySelector("#roster").textContent = `${crewCountOnPage} crew members on board`;
}

updateRoster();

for (let i = 5; i >= 1; i--) {
  console.log(i);
}
console.log("Liftoff!");

const crewItems = document.querySelectorAll("#crew li");
for (let i = 0; i < crewItems.length; i++) {
  console.log(`Present: ${crewItems[i].textContent}`);
}

let everyone = "";
for (let i = 0; i < crewItems.length; i++) {
  everyone = everyone + `${crewItems[i].textContent}. `;
}
document.querySelector("#everyone").textContent = everyone;

for (const role of document.querySelectorAll(".role")) {
  console.log(`Job: ${role.textContent}`);
}

function crewHours() {
  let total = 0;
  for (const worked of document.querySelectorAll(".worked")) {
    total = total + Number(worked.textContent);
  }
  return total;
}

document.querySelector("#hours-total").textContent = `Crew hours this week: ${crewHours()}`;

function soundAlarm() {
  document.querySelector("#intercom").textContent = "Alarm! All crew to the bridge";
  console.log("Alarm sounded");
}

document.querySelector("#alarm").addEventListener("click", soundAlarm);

function announce(message) {
  document.querySelector("#intercom").textContent = message;
}

document.querySelector("#call-dinner").addEventListener("click", () => {
  announce("Dinner is ready");
});
document.querySelector("#call-bridge").addEventListener("click", () => {
  announce("Report to the bridge");
});

function fullDays(hours) {
  return Math.floor(hours / 24);
}

document.querySelector("#oxygen-days").textContent = `Oxygen for ${fullDays(tanksOnPage * hoursOnPage)} full days`;

console.log("Average hours per crew member:", crewHours() / document.querySelectorAll(".worked").length);

let rookies = 0;
document.querySelector("#add-rookie").addEventListener("click", () => {
  rookies = rookies + 1;
  const rookie = document.createElement("li");
  rookie.textContent = `Rookie ${rookies}`;
  document.querySelector("#crew").append(rookie);
  updateRoster();
  document.querySelector("#latest").innerHTML = `<strong>Rookie ${rookies}</strong> just arrived`;
});

document.querySelector("#remove-last").addEventListener("click", () => {
  document.querySelector("#crew li:last-child").remove();
  updateRoster();
});

const welcomeList = document.querySelector("#welcome-list");
welcomeList.textContent = "Welcome: ";
for (const member of document.querySelectorAll("#crew li")) {
  const strong = document.createElement("strong");
  strong.textContent = member.textContent;
  welcomeList.append(strong, "! ");
}

function callRoll() {
  const rollCall = document.querySelector("#roll-call");
  rollCall.textContent = "";
  for (const member of document.querySelectorAll("#crew li")) {
    const answer = document.createElement("li");
    answer.textContent = `${member.textContent} - present`;
    rollCall.append(answer);
  }
  const answered = document.querySelectorAll("#roll-call li").length;
  document.querySelector("#roll-summary").textContent = `${answered} crew members answered`;
}

document.querySelector("#roll-call-button").addEventListener("click", callRoll);
```

```js check.js
// System check: each line reports one part of the station
console.log("Oxygen: OK");
console.log("Water: OK");
console.log("Power: OK");
console.log("Doors: OK");
console.log("All systems go");
```

```js countdown.js
// Engine cool-down: counts down from 3, then switches the engines off
for (let i = 3; i >= 1; i--) {
  console.log(`Cooling: ${i}`);
}
console.log("Engines off");
```

```html schedule.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Today's flights from Orbital Station 7, with where they go, when they leave and if they are on time." />
    <title>Flight Schedule</title>
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="board.css" />
    <script src="schedule.js" defer></script>
    <script src="menu.js" defer></script>
  </head>
  <body>
    <header>
      <p class="site-name">Orbital Station 7</p>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav aria-label="Main menu">
        <a href="index.html">Home</a>
        <a href="crew.html">Crew</a>
        <a href="schedule.html">Schedule</a>
        <a href="boarding.html">Boarding</a>
        <a href="wiki.html">Wiki</a>
        <a href="dashboard.html">Dashboard</a>
      </nav>
    </header>
    <main>
    <h1>Flight Schedule</h1>
    <p>Every departure from the station today.</p>
    <div class="banner"></div>
    <p>Station time: <span id="station-time">09:00</span></p>

    <button type="button" id="sort-by-time">Sort by time</button>
    <button type="button" id="hide-cancelled" aria-pressed="false">Hide cancelled</button>
    <table id="flights">
      <caption>Departures today</caption>
      <thead>
        <tr>
          <th scope="col">Flight</th>
          <th scope="col">Destination</th>
          <th scope="col">Departs</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr class="boarding">
          <td class="code">SL-101</td>
          <td class="destination">Moon Base</td>
          <td class="departs">08:30</td>
          <td class="status">Boarding</td>
        </tr>
        <tr class="on-time">
          <td class="code">SL-102</td>
          <td class="destination">Mars Relay</td>
          <td class="departs">09:45</td>
          <td class="status">On time</td>
        </tr>
        <tr>
          <td class="code">SL-103</td>
          <td class="destination">Europa Outpost</td>
          <td class="departs">07:15</td>
          <td class="status">Delayed</td>
        </tr>
        <tr>
          <td class="code">SL-104</td>
          <td class="destination">Lunar Gateway</td>
          <td class="departs">11:00</td>
          <td class="status">Cancelled</td>
        </tr>
        <tr class="on-time">
          <td class="code">SL-105</td>
          <td class="destination">Orbital Yard</td>
          <td class="departs">10:20</td>
          <td class="status">On time</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">All times in station time</td>
        </tr>
      </tfoot>
    </table>
    <p id="boarding-now"></p>
    <p id="gate-message"></p>
    <p id="flight-count"></p>
    <p>Fuel: <span id="fuel-start">100</span> units, burning <span id="burn-rate">15</span> a minute</p>
    <p id="fuel"></p>
    <p id="destinations"></p>
    <p id="reserve"></p>
    <p id="first-delay"></p>
    <p id="active-count"></p>
    <p id="on-time"></p>
    <p id="last-departure"></p>
    <p id="next-departure"></p>

    <h2>Docking Bays</h2>
    <table id="bays">
      <caption>Docking bays</caption>
      <thead>
        <tr>
          <th scope="col">Bay</th>
          <th scope="col">Time</th>
          <th scope="col">Ship</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowspan="2">Bay 1</td>
          <td>08:00</td>
          <td>Kestrel</td>
        </tr>
        <tr>
          <td>13:00</td>
          <td>Heron</td>
        </tr>
        <tr>
          <td>Bay 2</td>
          <td>10:30</td>
          <td>Albatross</td>
        </tr>
      </tbody>
    </table>
    </main>

    <footer>
      <p>Orbital Station 7 · Docking Ring B · Low Earth Orbit</p>
      <p>Written by the crew, for everyone on board and back on Earth.</p>
    </footer>
  </body>
</html>
```

```css board.css
#flights caption {
  font-style: italic;
}
```

```js schedule.js
const firstDeparts = document.querySelector("#flights tbody tr .departs").textContent;
console.log("First flight leaves before 10:00:", firstDeparts < "10:00");

const firstStatus = document.querySelector("#flights tbody tr .status").textContent;
console.log("First flight boarding:", firstStatus === "Boarding");

const secondStatus = document.querySelector("#flights tbody tr:nth-child(2) .status").textContent;
const secondDeparts = document.querySelector("#flights tbody tr:nth-child(2) .departs").textContent;
console.log("Second flight ready:", secondStatus === "On time" && secondDeparts < "10:00");

const firstCode = document.querySelector("#flights tbody tr .code").textContent;
if (firstStatus === "Boarding") {
  document.querySelector("#boarding-now").textContent = `Now boarding: ${firstCode}`;
} else {
  document.querySelector("#boarding-now").textContent = "Nobody is boarding yet";
}

const gateMessage = document.querySelector("#gate-message");
if (firstStatus === "Boarding") {
  gateMessage.textContent = "Go to gate 3";
} else if (firstStatus === "Delayed") {
  gateMessage.textContent = "Please wait";
} else if (firstStatus === "Cancelled") {
  gateMessage.textContent = "Ask at the desk";
} else {
  gateMessage.textContent = "Check the board";
}

const cancelledTotal = document.querySelectorAll("#flights tbody tr.cancelled").length;
document.querySelector("#flight-count").textContent = `${cancelledTotal} ${cancelledTotal === 1 ? "flight" : "flights"} cancelled`;

const fuelStart = Number(document.querySelector("#fuel-start").textContent);
const burnRate = Number(document.querySelector("#burn-rate").textContent);
let fuelLeft = fuelStart;
let minutes = 0;
while (fuelLeft >= burnRate) {
  fuelLeft = fuelLeft - burnRate;
  minutes = minutes + 1;
}
document.querySelector("#fuel").textContent = `Enough fuel for ${minutes} minutes`;

let destinationList = "Destinations: ";
for (const cell of document.querySelectorAll("#flights tbody .destination")) {
  destinationList = destinationList + `${cell.textContent}. `;
}
document.querySelector("#destinations").textContent = destinationList;

let reserveFuel = fuelStart;
let reserveMinutes = 0;
while (reserveFuel >= 30) {
  reserveFuel = reserveFuel - burnRate;
  reserveMinutes = reserveMinutes + 1;
}
document.querySelector("#reserve").textContent = `Reserve reached after ${reserveMinutes} minutes`;

const statusCells = document.querySelectorAll("#flights tbody .status");
const codeCells = document.querySelectorAll("#flights tbody .code");
let firstDelay = "No delays";
for (let i = 0; i < statusCells.length; i++) {
  if (statusCells[i].textContent === "Delayed") {
    firstDelay = `First delay: ${codeCells[i].textContent}`;
    break;
  }
}
document.querySelector("#first-delay").textContent = firstDelay;

let stillFlying = 0;
for (const cell of statusCells) {
  if (cell.textContent === "Cancelled") {
    continue;
  }
  stillFlying = stillFlying + 1;
}
document.querySelector("#active-count").textContent = `${stillFlying} flights still flying`;

const nextFlight = {
  code: "SL-102",
  destination: "Mars Relay",
  departs: "09:45",
};
console.log(`Next flight: ${nextFlight.code} to ${nextFlight.destination} at ${nextFlight.departs}`);
nextFlight.departs = "10:05";
nextFlight.gate = 3;
console.log("New time:", nextFlight.departs);
console.log("Gate:", nextFlight.gate);

const tomorrow = [
  { code: "SL-201", destination: "Moon Base" },
  { code: "SL-202", destination: "Titan Dock" },
  { code: "SL-203", destination: "Mars Relay" },
];
for (const flight of tomorrow) {
  console.log(`Tomorrow: ${flight.code} to ${flight.destination}`);
}

const flights = [];
for (const row of document.querySelectorAll("#flights tbody tr")) {
  flights.push({
    code: row.querySelector(".code").textContent,
    destination: row.querySelector(".destination").textContent,
    departs: row.querySelector(".departs").textContent,
    status: row.querySelector(".status").textContent,
  });
}
console.log("Flights read:", flights.length);
const lastOnBoard = flights[flights.length - 1];
console.log(`Last on the board: ${lastOnBoard.code} to ${lastOnBoard.destination}`);

function isOnTime(flight) {
  return flight.status === "On time";
}

let onTimeText = "On time: ";
for (const flight of flights.filter(isOnTime)) {
  onTimeText = onTimeText + `${flight.code}. `;
}
document.querySelector("#on-time").textContent = onTimeText;

function byDeparture(a, b) {
  return a.departs < b.departs ? -1 : 1;
}

const byTime = flights.slice().sort(byDeparture);
const lastFlight = byTime[byTime.length - 1];
document.querySelector("#last-departure").textContent = `Last departure: ${lastFlight.code} at ${lastFlight.departs}`;
console.log("First on the board:", flights[0].code);
console.log("Earliest:", byTime[0].code);

function rowByTime(a, b) {
  return a.querySelector(".departs").textContent < b.querySelector(".departs").textContent ? -1 : 1;
}

document.querySelector("#sort-by-time").addEventListener("click", () => {
  const body = document.querySelector("#flights tbody");
  const rows = Array.from(body.querySelectorAll("tr"));
  rows.sort(rowByTime);
  for (const row of rows) {
    body.append(row);
  }
});

for (const row of document.querySelectorAll("#flights tbody tr")) {
  const code = row.querySelector(".code");
  const destination = row.querySelector(".destination").textContent;
  code.setAttribute("title", `Flight ${code.textContent} to ${destination}`);
}

for (const row of document.querySelectorAll("#flights tbody tr")) {
  const status = row.querySelector(".status").textContent;
  if (status === "Delayed") {
    row.classList.add("delayed");
  } else if (status === "Cancelled") {
    row.classList.add("cancelled");
  }
}

const hideButton = document.querySelector("#hide-cancelled");
hideButton.addEventListener("click", () => {
  const hidden = document.querySelector("#flights").classList.toggle("hide-cancelled");
  hideButton.setAttribute("aria-pressed", hidden);
  hideButton.textContent = hidden ? "Show cancelled" : "Hide cancelled";
});

const stationTime = document.querySelector("#station-time").textContent;

function leavesLater(flight) {
  return flight.departs > stationTime && flight.status !== "Cancelled";
}

const later = flights.filter(leavesLater).sort(byDeparture);
const nextDeparture = document.querySelector("#next-departure");
if (later.length > 0) {
  nextDeparture.textContent = `Next departure: ${later[0].code} to ${later[0].destination} at ${later[0].departs}`;
} else {
  nextDeparture.textContent = "No more departures today";
}
```

```html boarding.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Book a seat on a flight from Orbital Station 7: pick your flight, your date and your seat." />
    <title>Book a Seat</title>
    <link rel="stylesheet" href="style.css" />
    <script src="boarding.js" defer></script>
    <script src="menu.js" defer></script>
  </head>
  <body>
    <header>
      <p class="site-name">Orbital Station 7</p>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav aria-label="Main menu">
        <a href="index.html">Home</a>
        <a href="crew.html">Crew</a>
        <a href="schedule.html">Schedule</a>
        <a href="boarding.html">Boarding</a>
        <a href="wiki.html">Wiki</a>
        <a href="dashboard.html">Dashboard</a>
      </nav>
    </header>
    <main>
    <h1>Book a Seat</h1>
    <p>Pick a flight, tell us who you are, and we keep a seat for you.</p>

    <form id="booking" action="https://station.example/book" method="post">
      <label for="passenger">Full name</label>
      <input id="passenger" name="passenger" placeholder="e.g. Ida Moreau" required minlength="2" maxlength="40" aria-describedby="passenger-error" />
      <p id="passenger-error"></p>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="e.g. ida@example.com" required />
      <label for="badge-number">Badge number</label>
      <input id="badge-number" name="badge" placeholder="e.g. OS4821" required pattern="[A-Z]{2}\d{4}" aria-describedby="badge-error" />
      <p id="badge-error"></p>
      <label for="phone">Phone</label>
      <input type="tel" id="phone" name="phone" placeholder="e.g. +47 412 34 567" />
      <label for="flight">Flight</label>
      <select id="flight" name="flight" required>
        <option value="">Pick a flight</option>
        <option value="SL-101">SL-101 to Moon Base, 08:30</option>
        <option value="SL-102">SL-102 to Mars Relay, 09:45</option>
        <option value="SL-103">SL-103 to Europa Outpost, 07:15</option>
        <option value="SL-104">SL-104 to Lunar Gateway, 11:00</option>
        <option value="SL-105">SL-105 to Orbital Yard, 10:20</option>
      </select>
      <label for="travel-date">Travel date</label>
      <input type="date" id="travel-date" name="date" required />
      <label for="bags">Number of bags</label>
      <input type="number" id="bags" name="bags" min="0" max="3" />
      <fieldset>
        <legend>Where would you like to sit?</legend>
        <input type="radio" id="seat-window" name="seat" value="window" />
        <label for="seat-window">By the window</label>
        <input type="radio" id="seat-aisle" name="seat" value="aisle" />
        <label for="seat-aisle">On the aisle</label>
      </fieldset>
      <fieldset>
        <legend>Extras</legend>
        <input type="checkbox" id="extra-meal" name="extras" value="meal" />
        <label for="extra-meal">A hot meal</label>
        <input type="checkbox" id="extra-blanket" name="extras" value="blanket" />
        <label for="extra-blanket">A warm blanket</label>
        <input type="checkbox" id="extra-wifi" name="extras" value="wifi" checked />
        <label for="extra-wifi">Wi-Fi on board</label>
        <input type="checkbox" id="extra-spacewalk" name="extras" value="spacewalk" disabled />
        <label for="extra-spacewalk">A space walk (sold out this week)</label>
      </fieldset>
      <fieldset>
        <legend>Someone we can call on Earth</legend>
        <label for="contact-name">Their name</label>
        <input id="contact-name" name="contact-name" maxlength="40" />
        <label for="contact-phone">Their phone</label>
        <input type="tel" id="contact-phone" name="contact-phone" />
      </fieldset>
      <label for="notes">Anything we should know?</label>
      <textarea id="notes" name="notes" rows="4" maxlength="200"></textarea>
      <p id="notes-left">200 characters left</p>
      <button type="submit">Book my seat</button>
      <button type="reset">Clear the form</button>
      <p id="confirmation"></p>
    </form>

    <h2>Your boarding pass</h2>
    <p>Passenger: <span id="pass-name">No name yet</span></p>
    <p>Initials: <span id="pass-initials"></span></p>
    <p>Traveling as: <span id="pass-role">guest</span></p>
    <p>Badge: <span id="pass-badge">No valid badge yet</span></p>
    <p>Flight: <span id="pass-flight"></span></p>
    <p>Going to: <span id="pass-destination">No flight yet</span></p>
    <p>Seat: <span id="pass-seat"></span></p>
    <p>Hot meal: <span id="pass-meal">no</span></p>
    <p>Notes: <span id="pass-notes">No notes</span></p>
    <p>Help at the gate: <span id="pass-help">no</span></p>
    </main>

    <footer>
      <p>Orbital Station 7 · Docking Ring B · Low Earth Orbit</p>
      <p>Written by the crew, for everyone on board and back on Earth.</p>
    </footer>
  </body>
</html>
```

```js boarding.js
const passenger = document.querySelector("#passenger");
const passName = document.querySelector("#pass-name");
const passInitials = document.querySelector("#pass-initials");

function initialsOf(name) {
  const space = name.indexOf(" ");
  if (space === -1) {
    return name.slice(0, 1);
  }
  return name.slice(0, 1) + name.slice(space + 1, space + 2);
}

passenger.addEventListener("input", () => {
  const name = passenger.value.trim();
  if (name) {
    passName.textContent = name;
  } else {
    passName.textContent = "No name yet";
  }
  passInitials.textContent = initialsOf(name);
});

const email = document.querySelector("#email");
const passRole = document.querySelector("#pass-role");

email.addEventListener("input", () => {
  if (email.value.endsWith("@station.example")) {
    passRole.textContent = "crew";
  } else {
    passRole.textContent = "guest";
  }
});

const badgeNumber = document.querySelector("#badge-number");
const badgeError = document.querySelector("#badge-error");
const passBadge = document.querySelector("#pass-badge");
const badgeRule = /^[A-Z]{2}\d{4}$/;

badgeNumber.addEventListener("input", () => {
  if (badgeRule.test(badgeNumber.value)) {
    passBadge.textContent = badgeNumber.value;
  } else {
    passBadge.textContent = "No valid badge yet";
  }
});

badgeNumber.addEventListener("change", () => {
  if (badgeRule.test(badgeNumber.value)) {
    badgeError.textContent = "";
    badgeNumber.setAttribute("aria-invalid", "false");
  } else {
    badgeError.textContent = "Two capital letters and four digits, like OS4821";
    badgeNumber.setAttribute("aria-invalid", "true");
  }
});

const passSeat = document.querySelector("#pass-seat");

function showSeat(event) {
  passSeat.textContent = event.target.value;
}

document.querySelector("#seat-window").addEventListener("click", showSeat);
document.querySelector("#seat-aisle").addEventListener("click", showSeat);

const notes = document.querySelector("#notes");
const notesLeft = document.querySelector("#notes-left");
const passNotes = document.querySelector("#pass-notes");
const passHelp = document.querySelector("#pass-help");

function updateNotes() {
  notesLeft.textContent = `${200 - notes.value.length} characters left`;
  passNotes.textContent = notes.value || "No notes";
  passHelp.textContent = /wheelchair/i.test(notes.value) ? "yes" : "no";
}

notes.addEventListener("input", updateNotes);

notes.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    notes.value = "";
    updateNotes();
  }
});

const flight = document.querySelector("#flight");
const passFlight = document.querySelector("#pass-flight");
const passDestination = document.querySelector("#pass-destination");

flight.addEventListener("change", () => {
  passFlight.textContent = flight.value;
  switch (flight.value) {
    case "SL-101":
      passDestination.textContent = "Moon Base";
      break;
    case "SL-102":
      passDestination.textContent = "Mars Relay";
      break;
    case "SL-103":
      passDestination.textContent = "Europa Outpost";
      break;
    case "SL-104":
      passDestination.textContent = "Lunar Gateway";
      break;
    case "SL-105":
      passDestination.textContent = "Orbital Yard";
      break;
    default:
      passDestination.textContent = "No flight yet";
  }
});

const meal = document.querySelector("#extra-meal");
const passMeal = document.querySelector("#pass-meal");

meal.addEventListener("change", () => {
  passMeal.textContent = meal.checked ? "yes" : "no";
});

const contactName = document.querySelector("#contact-name");
const contactPhone = document.querySelector("#contact-phone");

function checkContact() {
  if (contactName.value.trim() && !contactPhone.value) {
    contactPhone.setCustomValidity("Please add their phone number, so we can call them");
  } else {
    contactPhone.setCustomValidity("");
  }
}

contactName.addEventListener("input", checkContact);
contactPhone.addEventListener("input", checkContact);

const booking = document.querySelector("#booking");
const confirmation = document.querySelector("#confirmation");
const passengerError = document.querySelector("#passenger-error");

booking.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = passenger.value.trim();
  if (name) {
    passengerError.textContent = "";
    passenger.setAttribute("aria-invalid", "false");
    console.log(`Sending the booking for ${name}`);
    confirmation.textContent = `Seat booked for ${name} on ${flight.value}`;
  } else {
    passengerError.textContent = "Please write your name";
    passenger.setAttribute("aria-invalid", "true");
    confirmation.textContent = "";
  }
});
```

```html wiki-greenhouse.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="How the greenhouse of Orbital Station 7 grows fresh food under lamps, with clean water." />
    <title>The Greenhouse</title>
    <link rel="stylesheet" href="style.css" />
    <script src="menu.js" defer></script>
  </head>
  <body>
    <header>
      <p class="site-name">Orbital Station 7</p>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav aria-label="Main menu">
        <a href="index.html">Home</a>
        <a href="crew.html">Crew</a>
        <a href="schedule.html">Schedule</a>
        <a href="boarding.html">Boarding</a>
        <a href="wiki.html">Wiki</a>
        <a href="dashboard.html">Dashboard</a>
      </nav>
    </header>
    <main class="wiki-page">
    <article>
      <h1>The Greenhouse</h1>
      <p>The greenhouse is the only green room on the station. It gives the crew fresh food, and a little fresh air too.</p>

      <section>
        <h2>What grows here</h2>
        <p>Tomatoes, beans, basil and lettuce. Kenji Arano, the station's botanist, looks after them and picks something for dinner every day.</p>
      </section>

      <section>
        <h2>Light</h2>
        <p>There is no sun inside the station. Blue and red lamps shine on the plants for 16 hours a day, then switch off so the plants can rest.</p>
      </section>

      <section>
        <h2>Water</h2>
        <p>Nothing is wasted. The station cleans the water the crew has used, and the plants drink 60 liters of it every day.</p>
      </section>
    </article>

    <aside class="fact-box">
      <h2>Facts</h2>
      <ul>
        <li>Plants: 4 kinds</li>
        <li>Light: <span class="measure">16&nbsp;hours</span> a day</li>
        <li>Water: <span class="measure">60&nbsp;liters</span> a day</li>
        <li>Warmth: <span class="measure">24&nbsp;°C</span></li>
      </ul>
    </aside>
    </main>

    <footer>
      <p>Orbital Station 7 · Docking Ring B · Low Earth Orbit</p>
      <p>Written by the crew, for everyone on board and back on Earth.</p>
      <a class="to-top" href="#top">Back to top</a>
    </footer>
  </body>
</html>
```

```html wiki-airlock.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="How the airlock of Orbital Station 7 works, and how the crew get ready for a space walk." />
    <title>The Airlock</title>
    <link rel="stylesheet" href="style.css" />
    <script src="menu.js" defer></script>
  </head>
  <body>
    <header>
      <p class="site-name">Orbital Station 7</p>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav aria-label="Main menu">
        <a href="index.html">Home</a>
        <a href="crew.html">Crew</a>
        <a href="schedule.html">Schedule</a>
        <a href="boarding.html">Boarding</a>
        <a href="wiki.html">Wiki</a>
        <a href="dashboard.html">Dashboard</a>
      </nav>
    </header>
    <main class="wiki-page">
    <article>
      <h1>The Airlock</h1>
      <p>The airlock is a small room between the station and space. The crew go through it for every space walk.</p>

      <section>
        <h2>How it works</h2>
        <p>It has two doors: one to the station and one to space. Only one door can open at a time, so the air stays inside the station.</p>
      </section>

      <section>
        <h2>Before a space walk</h2>
        <p>The crew put on their space suits in the airlock and close the door to the station. Then pumps take the air out, which takes 15 minutes.</p>
      </section>

      <section>
        <h2>Safety</h2>
        <p>Nobody goes out alone. Commander Vega checks every suit and both doors before a walk.</p>
      </section>
    </article>

    <aside class="fact-box">
      <h2>Facts</h2>
      <ul>
        <li>Doors: 2</li>
        <li>Space suits: 4</li>
        <li>Time to take the air out: <span class="measure">15&nbsp;minutes</span></li>
        <li>Length: <span class="measure">3&nbsp;m</span></li>
      </ul>
    </aside>
    </main>

    <footer>
      <p>Orbital Station 7 · Docking Ring B · Low Earth Orbit</p>
      <p>Written by the crew, for everyone on board and back on Earth.</p>
      <a class="to-top" href="#top">Back to top</a>
    </footer>
  </body>
</html>
```

```html wiki.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="The station wiki: what the crew of Orbital Station 7 knows about life on board." />
    <title>Station Wiki</title>
    <link rel="stylesheet" href="style.css" />
    <script src="wiki.js" defer></script>
    <script src="menu.js" defer></script>
  </head>
  <body>
    <header>
      <p class="site-name">Orbital Station 7</p>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav aria-label="Main menu">
        <a href="index.html">Home</a>
        <a href="crew.html">Crew</a>
        <a href="schedule.html">Schedule</a>
        <a href="boarding.html">Boarding</a>
        <a href="wiki.html">Wiki</a>
        <a href="dashboard.html">Dashboard</a>
      </nav>
    </header>
    <main>
    <h1>Station Wiki</h1>
    <p>What the crew knows about life on board, written down for everyone.</p>
    <p id="article-count"></p>
    <p>Text size: <button type="button" id="text-smaller">Smaller</button> <button type="button" id="text-bigger">Bigger</button></p>

    <p>Next to read: <span id="picked">nothing yet</span></p>

    <div class="wiki-list">
      <article>
        <h2>The Greenhouse</h2>
        <p>Where our food grows, under blue and red lamps.</p>
        <p><a href="wiki-greenhouse.html">Read about the greenhouse</a></p>
      </article>
      <article>
        <h2>The Airlock</h2>
        <p>The small room between the station and space.</p>
        <p><a href="wiki-airlock.html">Read about the airlock</a></p>
      </article>
      <article>
        <h2>Tools &amp; Spare Parts <span class="badge">New</span></h2>
        <p>Everything we need to fix the station, and where to find it.</p>
        <p><a href="wiki-tools.html">Read about tools &amp; spare parts</a></p>
      </article>
    </div>

    <p>To add a page to the wiki, copy an entry from &lt;article&gt; to &lt;/article&gt; and change its words.</p>
    <button type="button" id="thank">Thank the writers</button>
    <p id="wiki-message"></p>
    <p id="thanks-count">Thanks: 0</p>
    </main>

    <footer>
      <p>Orbital Station 7 · Docking Ring B · Low Earth Orbit</p>
      <p>Written by the crew, for everyone on board and back on Earth.</p>
      <a class="to-top" href="#top">Back to top</a>
    </footer>
  </body>
</html>
```

```html wiki-tools.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Where the tools and spare parts of Orbital Station 7 are kept, and how the crew stop them from floating away." />
    <title>Tools &amp; Spare Parts</title>
    <link rel="stylesheet" href="style.css" />
    <script src="menu.js" defer></script>
  </head>
  <body>
    <header>
      <p class="site-name">Orbital Station 7</p>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav aria-label="Main menu">
        <a href="index.html">Home</a>
        <a href="crew.html">Crew</a>
        <a href="schedule.html">Schedule</a>
        <a href="boarding.html">Boarding</a>
        <a href="wiki.html">Wiki</a>
        <a href="dashboard.html">Dashboard</a>
      </nav>
    </header>
    <main class="wiki-page">
    <article>
      <h1>Tools &amp; Spare Parts</h1>
      <p>A broken pump can't wait for the next supply ship. So the station keeps its own tools and spare parts on board.</p>

      <section>
        <h2>Where they are</h2>
        <p>Everything is in the cargo bay, on the lower deck. Tomas Okafor, the engineer, keeps a list of every part and where it is.</p>
      </section>

      <section>
        <h2>Nothing floats away</h2>
        <p>On the station, nothing falls: it floats. So every tool is tied to a belt, and every box of parts closes with a lid.</p>
      </section>
    </article>

    <aside class="fact-box">
      <h2>Facts</h2>
      <ul>
        <li>Spare parts: 1,200</li>
        <li>Heaviest tool: <span class="measure">12&nbsp;kg</span></li>
        <li>Longest cable: <span class="measure">30&nbsp;m</span></li>
      </ul>
    </aside>
    </main>

    <footer>
      <p>Orbital Station 7 · Docking Ring B · Low Earth Orbit</p>
      <p>Written by the crew, for everyone on board and back on Earth.</p>
      <a class="to-top" href="#top">Back to top</a>
    </footer>
  </body>
</html>
```

```js wiki.js
const countLine = (count) => `${count} articles in the wiki`;

const articles = document.querySelectorAll(".wiki-list article");
document.querySelector("#article-count").textContent = countLine(articles.length);

const wikiMessage = document.querySelector("#wiki-message");

const showMessage = (text = "Happy reading!") => {
  wikiMessage.textContent = text;
};

showMessage();

const thanksCount = document.querySelector("#thanks-count");
let thanks = 0;

document.querySelector("#thank").addEventListener("click", () => {
  showMessage("Thank you! The writers will be glad.");
  thanks = thanks + 1;
  thanksCount.textContent = `Thanks: ${thanks}`;
});

const page = document.querySelector("html");
let textSize = 16;

document.querySelector("#text-bigger").addEventListener("click", () => {
  textSize = textSize + 2;
  page.style.fontSize = `${textSize}px`;
});

document.querySelector("#text-smaller").addEventListener("click", () => {
  textSize = textSize - 2;
  page.style.fontSize = `${textSize}px`;
});

const picked = document.querySelector("#picked");
const wikiList = document.querySelector(".wiki-list");

wikiList.addEventListener("click", (event) => {
  const card = event.target.closest("article");
  if (card) {
    const before = wikiList.querySelector(".picked");
    if (before) {
      before.classList.remove("picked");
    }
    card.classList.add("picked");
    picked.textContent = card.querySelector("h2").textContent;
  }
});
```

```js menu.js
const menuButton = document.querySelector("#menu-button");
const menu = document.querySelector("header nav");

const closeMenu = () => {
  menu.classList.add("closed");
  menuButton.setAttribute("aria-expanded", "false");
};

if (menuButton) {
  closeMenu();

  menuButton.addEventListener("click", () => {
    const closed = menu.classList.toggle("closed");
    menuButton.setAttribute("aria-expanded", !closed);
  });

  const page = document.querySelector("body");

  page.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  page.addEventListener("click", (event) => {
    if (!event.target.closest("header")) {
      closeMenu();
    }
  });
}
```

```html dashboard.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="The station at a glance: the last launch, and what the crew checks every day." />
    <title>Mission Dashboard</title>
    <link rel="stylesheet" href="style.css" />
    <script src="menu.js" defer></script>
    <script src="dashboard.js" defer></script>
  </head>
  <body>
    <header>
      <p class="site-name">Orbital Station 7</p>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav aria-label="Main menu">
        <a href="index.html">Home</a>
        <a href="crew.html">Crew</a>
        <a href="schedule.html">Schedule</a>
        <a href="boarding.html">Boarding</a>
        <a href="wiki.html">Wiki</a>
        <a href="dashboard.html">Dashboard</a>
      </nav>
    </header>
    <main>
    <h1>Mission Dashboard</h1>
    <p>The station at a glance, for the crew and for everyone back on Earth.</p>

    <section class="stats" aria-label="The station in numbers">
      <article class="stat" id="crew-count">
        <h2>Crew on board</h2>
        <p class="stat-value">6</p>
      </article>
      <article class="stat">
        <h2>Oxygen</h2>
        <p class="stat-value">98%</p>
      </article>
      <article class="stat">
        <h2>Water</h2>
        <p class="stat-value">1,240 litres</p>
      </article>
      <article class="stat" id="next-launch">
        <h2>Next launch</h2>
        <p class="stat-value">Friday</p>
      </article>
      <article class="stat">
        <h2>Power</h2>
        <p class="stat-value">87%</p>
      </article>
      <article class="stat">
        <h2>Days in orbit</h2>
        <p class="stat-value">412</p>
      </article>
    </section>

    <h2>This week</h2>
    <ol class="week">
      <li>Mon</li>
      <li>Tue</li>
      <li>Wed</li>
      <li>Thu</li>
      <li>Fri</li>
      <li>Sat</li>
      <li>Sun</li>
    </ol>

    <div class="panels">
      <section id="pad-panel">
        <h2>The launch pad, live</h2>
        <figure>
          <video id="pad-camera" src="video/launch.webm" autoplay muted loop controls></video>
          <figcaption>Pad 2, live. The camera films the launch tower all day.</figcaption>
        </figure>
      </section>
      <section id="launch-panel">
        <h2>The last launch</h2>
        <figure>
          <video id="launch-video" src="video/launch.webm" controls>
            <track src="video/launch.vtt" kind="captions" srclang="en" label="English" default />
          </video>
          <figcaption>Flight SL-101 leaves the pad for Moon Base, filmed from the launch tower.</figcaption>
        </figure>
      </section>
      <section id="countdown-panel">
        <h2>The countdown</h2>
        <audio id="countdown" src="audio/countdown.mp3" controls></audio>
      </section>
      <section id="duty-panel">
        <h2>On duty today</h2>
        <ul id="on-duty">
          <li>Vega</li>
          <li>Orion</li>
          <li>Lyra</li>
          <li>Altair</li>
          <li>Nova</li>
          <li>Rigel</li>
        </ul>
        <p id="duty-line"></p>
        <p id="duty-check"></p>
        <p id="shift-leads"></p>
        <p id="duty-count"></p>
        <p id="call-signs"></p>
      </section>
    </div>

    <section id="wishes-panel">
      <h2>For the next supply ship</h2>
      <p id="wish-list">spare filters, coffee, warm socks, a football</p>
      <ul id="wishes"></ul>
      <p id="wish-count"></p>
    </section>

    <section id="supplies-panel">
      <h2>Supplies</h2>
      <table id="supplies">
        <thead>
          <tr>
            <th>Supply</th>
            <th>Level (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="item">Water</td>
            <td class="level">72</td>
          </tr>
          <tr>
            <td class="item">Oxygen</td>
            <td class="level">18</td>
          </tr>
          <tr>
            <td class="item">Food</td>
            <td class="level">55</td>
          </tr>
          <tr>
            <td class="item">Fuel</td>
            <td class="level">22</td>
          </tr>
          <tr>
            <td class="item">Filters</td>
            <td class="level">90</td>
          </tr>
          <tr>
            <td class="item">Medicine</td>
            <td class="level">40</td>
          </tr>
        </tbody>
      </table>
      <p id="low-supplies"></p>
      <p id="supplies-average"></p>
      <p id="first-refill"></p>
    </section>

    <div class="gallery">
      <section>
        <h2>The station from outside</h2>
        <figure>
          <img src="img/station.svg" alt="A gold station hub inside a blue ring, with a solar panel on each side" width="240" height="150" />
          <figcaption>Orbital Station 7, seen from a supply ship.</figcaption>
        </figure>
      </section>
      <section>
        <h2>Earth from the station</h2>
        <figure>
          <picture>
            <source media="(max-width: 600px)" srcset="img/earth-square.jpg" />
            <img
              class="earth"
              src="img/earth-small.jpg"
              srcset="img/earth-small.jpg 640w, img/earth-large.jpg 1280w"
              sizes="100vw"
              alt="The blue curve of the Earth under a black sky, with a satellite in the top corner"
              width="640"
              height="400"
            />
          </picture>
          <figcaption>The Earth from the station's window, over the ocean at noon.</figcaption>
        </figure>
      </section>
    </div>
    </main>

    <footer>
      <p>Orbital Station 7 · Docking Ring B · Low Earth Orbit</p>
      <p>Written by the crew, for everyone on board and back on Earth.</p>
    </footer>
  </body>
</html>
```

```js dashboard.js
const onDuty = [];
for (const item of document.querySelectorAll("#on-duty li")) {
  onDuty.push(item.textContent);
}

document.querySelector("#duty-line").textContent = `On duty: ${onDuty.join(", ")}`;

const dutyCheck = document.querySelector("#duty-check");
if (onDuty.includes("Vega")) {
  dutyCheck.textContent = `Commander Vega is on duty, number ${onDuty.indexOf("Vega") + 1} on the list.`;
} else {
  dutyCheck.textContent = "Commander Vega is off duty today.";
}

document.querySelector("#shift-leads").textContent = `Shift leads: ${onDuty.slice(0, 2).join(" and ")}`;

document.querySelector("#duty-count").textContent = `${onDuty.length} on duty today`;

const callSigns = onDuty.map((name) => name.toUpperCase());
document.querySelector("#call-signs").textContent = `Call signs: ${callSigns.join(" / ")}`;

const wishes = document.querySelector("#wish-list").textContent.split(", ");
for (const wish of wishes) {
  const item = document.createElement("li");
  item.textContent = wish;
  document.querySelector("#wishes").append(item);
}
document.querySelector("#wish-count").textContent = `Wishes: ${wishes.length}`;

const supplies = [];
for (const row of document.querySelectorAll("#supplies tbody tr")) {
  supplies.push({
    item: row.querySelector(".item").textContent,
    level: Number(row.querySelector(".level").textContent),
  });
}

const lowSupplies = supplies.filter((supply) => supply.level < 25).map((supply) => supply.item);
document.querySelector("#low-supplies").textContent =
  lowSupplies.length === 0 ? "Running low: nothing" : `Running low: ${lowSupplies.join(", ")}`;

const totalLevel = supplies.reduce((total, supply) => total + supply.level, 0);
document.querySelector("#supplies-average").textContent =
  `Supplies at ${Math.round(totalLevel / supplies.length)}% on average`;

let firstLow;
for (const supply of supplies) {
  if (supply.level < 25 && (!firstLow || supply.level < firstLow.level)) {
    firstLow = supply;
  }
}
document.querySelector("#first-refill").textContent = firstLow
  ? `Refill first: ${firstLow.item}`
  : "Nothing to refill";
```
