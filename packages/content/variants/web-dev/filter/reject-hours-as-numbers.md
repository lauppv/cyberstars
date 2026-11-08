```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Station Log</title>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js" defer></script>
  </head>
  <body>
    <nav>
      <a href="index.html">Home</a>
      <a href="crew.html">Crew</a>
      <a href="crew.html#duty">Duty</a>
      <a href="schedule.html">Schedule</a>
    </nav>
    <h1>Welcome aboard</h1>
    <img
      src="img/station.svg"
      alt="A gold station hub inside a blue ring, with a solar panel on each side"
      width="320"
      height="200"
    />
    <p>The station orbits the Earth every 92 minutes.</p>
    <p class="jumps"><a href="#today">Jump to today</a> · <a href="#visiting">Visiting hours</a></p>
    <p id="status"></p>
    <button type="button" id="wake">Wake the crew</button>
    <p id="shift"></p>
    <button type="button" id="next-shift">Next shift</button>

    <h2>About the Station</h2>
    <p>Six crew members live here, with a greenhouse full of tomatoes.</p>
    <p>Cargo ships dock twice a month, and <em>every</em> docking is logged on this page.</p>
    <p class="address">
      Orbital Station 7<br />
      Docking Ring B<br />
      Low Earth Orbit
    </p>
    <!-- <p><small>Docking fee: 20 credits a day.</small></p> -->
    <p>
      Curious how real stations work?
      <a href="https://en.wikipedia.org/wiki/Space_station" target="_blank" rel="noopener">
        Read about space stations
      </a>
    </p>

    <img src="img/divider.svg" alt="" width="600" height="24" />

    <!-- Today on Board: warnings, supplies and who works each shift -->
    <h2 id="today">Today on Board</h2>
    <p class="warning"><strong>Hatch 3 stays closed</strong> while the outer panels are repaired.</p>
    <p>Water left: 900 litres of H<sub>2</sub>O.</p>
    <p>Height: 4 × 10<sup>5</sup> metres above the Earth.</p>
    <h3>Morning Shift</h3>
    <p>Commander Vega and engineer Okafor.</p>
    <h3>Night Shift</h3>
    <p>Pilot Lindqvist, alone with the stars.</p>

    <!-- Visiting Hours: when guests may come aboard, and the badge rule -->
    <h2 id="visiting">Visiting Hours</h2>
    <p class="hours">
      Monday to Friday: 10:00 to 16:00<br />
      Saturday: 10:00 to 12:00<br />
      Sunday: closed
    </p>
    <p class="warning"><strong>Visitors must wear a badge</strong> at all times.</p>

    <p><a href="mailto:crew@station.example">Write to the crew</a></p>
  </body>
</html>
```

```image img/station.svg

```

```image img/divider.svg

```

```css style.css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  background-color: #0b1d3a;
  color: #f0f4ff;
  font-family: Verdana, Geneva, sans-serif;
  line-height: 1.6;
  font-size: 1.125rem;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 16px;
}

h1 {
  color: #ffd166;
  text-align: center;
  font-size: 2.5rem;
}

h2 {
  color: hsl(210, 70%, 75%);
  letter-spacing: 2px;
  font-size: 1.5rem;
}

h3 {
  color: rgb(200, 210, 230);
  text-transform: uppercase;
}

a {
  color: #8ecbff;
}

nav {
  background-color: #13294f;
  border-radius: 12px;
  text-align: center;
}

nav a {
  display: inline-block;
  padding: 8px 12px;
  border-bottom: 2px solid #ffd166;
}

.warning {
  color: #ffb3b3;
  background-color: rgba(255, 80, 80, 0.2);
}

#today {
  color: #7bd389;
}

.address {
  font-style: italic;
  font-size: 0.9em;
}

.jumps {
  text-align: center;
  font-size: 0.875rem;
}

.hours {
  background-color: #13294f;
  color: #ffd166;
  font-family: "Courier New", monospace;
  font-size: 1rem;
}

#visiting {
  color: #ffd166;
}

.card {
  background-color: #13294f;
  padding: 16px;
  border: 2px solid #2c4a7a;
  margin-bottom: 24px;
  width: 260px;
  min-height: 140px;
  display: inline-block;
  vertical-align: top;
  margin-right: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.bio {
  max-height: 6em;
  overflow-y: auto;
}

h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#flights,
#bays {
  width: 100%;
  border-collapse: collapse;
  font-family: "Courier New", monospace;
}

#flights td {
  color: #dbe4ff;
}

#flights tr.cancelled td {
  color: #8a94a8;
  text-decoration: line-through;
}

#flights td.status {
  font-weight: bold;
}

#flights tr.delayed td.status {
  color: #ffb3b3;
}

#flights tr.cancelled td.status::before {
  content: "✕ ";
}

#flights th {
  background-color: #13294f;
  background-image: linear-gradient(90deg, #13294f, #2c4a7a);
}

.banner {
  height: 160px;
  background-image: url("img/station.svg");
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  margin-bottom: 24px;
}

#flights th,
#flights td,
#bays th,
#bays td {
  padding: 8px 12px;
  border-bottom: 1px solid #2c4a7a;
}

#flights tbody tr:nth-child(even) {
  background-color: #13294f;
}

#flights tbody tr:hover {
  background-color: #1d3b6e;
}

nav a:hover {
  color: #ffd166;
}

a:focus-visible {
  outline: 3px solid #ffd166;
}

a[href^="https://"]::after {
  content: " ↗";
}

.warning::before {
  content: "⚠ ";
}

h2::after {
  content: "";
  display: block;
  width: 48px;
  height: 3px;
  margin-top: 6px;
  background-color: #ffd166;
}

h1 + p {
  font-size: 1.25rem;
}

a[href^="https://"] {
  color: #ffd166;
}

a[href^="mailto:"] {
  text-decoration-style: dotted;
}

th[scope="col"] {
  text-align: left;
}

td[colspan] {
  font-style: italic;
}

nav > a {
  font-weight: bold;
}

.duties {
  background-color: #13294f;
  padding: 16px 16px 16px 40px;
  border-left: 4px solid #ffd166;
  border-radius: 0 12px 12px 0;
  max-width: 600px;
  margin: 16px auto;
}

#cards {
  max-width: 900px;
  margin: 0 auto;
}

sub,
sup {
  color: #5fd3c6;
}
```

```js script.js
// A gold line along the top of the page
document.body.style.borderTop = "6px solid #ffd166";

// System check
console.log("Station Log online");
console.log(92);
console.log("Crew on board:", 6);

// Crew count
const minutesPerOrbit = 92;
let crewOnBoard = 6;
crewOnBoard = crewOnBoard + 2;
console.log("Crew on board:", crewOnBoard);
console.log("Minutes per orbit:", minutesPerOrbit);

// Greeting board
const stationName = "Station Log";
console.log(`Welcome aboard ${stationName}`);
console.log(stationName.length);
console.log(stationName.toUpperCase());
console.log(`One orbit takes ${minutesPerOrbit} minutes`);

// Live status, read from the biggest heading
const title = document.querySelector("h1");
console.log(title.textContent);
const status = document.querySelector("#status");
status.textContent = `${title.textContent}: all systems normal`;

// Wake-up call
const wake = document.querySelector("#wake");
wake.addEventListener("click", () => {
  status.textContent = "Crew awake";
  console.log("Wake-up call sent");
});

// Shift counter
let shiftNumber = 1;
const shift = document.querySelector("#shift");
shift.textContent = `Shift ${shiftNumber}`;

const nextShift = document.querySelector("#next-shift");
nextShift.addEventListener("click", () => {
  shiftNumber = shiftNumber + 1;
  shift.textContent = `Shift ${shiftNumber}`;
  console.log(`Shift ${shiftNumber} begins`);
});
```

```html crew.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Crew Directory</title>
    <link rel="stylesheet" href="style.css" />
    <script src="crew.js" defer></script>
  </head>
  <body>
    <nav>
      <a href="index.html">Home</a>
      <a href="crew.html">Crew</a>
      <a href="crew.html#duty">Duty</a>
      <a href="schedule.html">Schedule</a>
    </nav>
    <h1>Crew Directory</h1>
    <p>Everyone who lives and works on the station, and where to find them.</p>

    <h2>Crew</h2>
    <ul id="crew">
      <li>Mara Vega</li>
      <li>Tomas Okafor</li>
      <li>Ines Lindqvist</li>
      <li>Kenji Arano</li>
    </ul>
    <p id="roster"></p>
    <button type="button" id="add-rookie">Add a rookie</button>
    <button type="button" id="remove-last">Remove the last</button>
    <p id="latest"></p>

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
        <p>Hours this week: <span class="worked">40</span></p>
        <p class="bio">Twenty years in orbit, three of them in charge of this station. Knows every bolt by its first name and still checks the airlocks herself before bed.</p>
      </div>
      <div class="card">
        <h3>Tomas Okafor</h3>
        <p>Job: <span class="role">Engineer</span></p>
        <p>Hours this week: <span class="worked">38</span></p>
        <p class="bio">Keeps the power on and the water clean. Spends his free time building a clock out of spare parts that has never once shown the right time.</p>
      </div>
      <div class="card">
        <h3>Ines Lindqvist</h3>
        <p>Job: <span class="role">Pilot</span></p>
        <p>Hours this week: <span class="worked">36</span></p>
        <p class="bio">Flies the supply runs and the rescue drills. Holds the station record for the softest docking, and reminds everyone of it at dinner.</p>
      </div>
      <div class="card">
        <h3>Kenji Arano</h3>
        <p>Job: <span class="role">Botanist</span></p>
        <p>Hours this week: <span class="worked">28</span></p>
        <p class="bio">Grows the tomatoes, the beans and the only flowers for four hundred kilometres. Talks to the plants, and claims they answer.</p>
      </div>
    </div>
    <p id="hours-total"></p>
    <p id="watch-time"></p>
    <button type="button" id="roll-call-button">Roll call</button>
    <ol id="roll-call"></ol>
    <p id="roll-summary"></p>
    <button type="button" id="call-dinner">Call to dinner</button>
    <button type="button" id="call-bridge">Call to the bridge</button>
    <p id="intercom"></p>

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

    <h2>Supplies</h2>
    <p>Oxygen tanks: <span id="tanks">13</span>, each lasting <span id="tank-hours">30</span> hours.</p>
    <p id="oxygen"></p>
    <p>Launch countdown from <span id="countdown-from">10</span></p>
    <p id="countdown"></p>
  </body>
</html>
```

```js crew.js
// Oxygen check
const tanks = Number(document.querySelector("#tanks").textContent);
const tankHours = Number(document.querySelector("#tank-hours").textContent);
const oxygenHours = tanks * tankHours;
console.log(oxygenHours);

function daysAndHours(hours) {
  const days = Math.floor(hours / 24);
  return `${days} days and ${hours % 24} hours`;
}

document.querySelector("#oxygen").textContent = `Oxygen for ${daysAndHours(oxygenHours)}`;

// Roster facts, from the crew list
const crewItems = document.querySelectorAll("#crew li");

function updateRoster() {
  const items = document.querySelectorAll("#crew li");
  const firstName = items[0].textContent;
  const lastName = items[items.length - 1].textContent;
  document.querySelector("#roster").textContent =
    `${items.length} crew members, from ${firstName} to ${lastName}`;

  // The last name is text from the page: never parsed as HTML
  const latest = document.querySelector("#latest");
  const name = document.createElement("strong");
  name.textContent = lastName;
  latest.textContent = "Latest arrival: ";
  latest.append(name);
}

updateRoster();

const shifts = ["Morning", "Day", "Night"];
shifts.push("Dawn");
console.log(shifts.join(", "));
console.log(shifts.length);

// Countdown
const countFrom = Number(document.querySelector("#countdown-from").textContent);
let countdown = "";
for (let i = countFrom; i >= 1; i--) {
  countdown += i + " ";
}
countdown += "Liftoff!";
document.querySelector("#countdown").textContent = countdown;

// Every crew member, numbered
for (let i = 0; i < crewItems.length; i++) {
  console.log(`Crew ${i + 1}: ${crewItems[i].textContent}`);
}

// Hours this week, from the cards
const hourSpans = document.querySelectorAll(".worked");
let totalHours = 0;
for (const span of hourSpans) {
  totalHours += Number(span.textContent);
}
const averageHours = Math.round(totalHours / hourSpans.length);
document.querySelector("#hours-total").textContent =
  `Hours this week: ${totalHours}, about ${averageHours} per crew member`;

// Intercom
function announce(message) {
  document.querySelector("#intercom").textContent = message;
  console.log(`Intercom: ${message}`);
}

document.querySelector("#call-dinner").addEventListener("click", () => {
  announce("Dinner is served in the galley");
});
document.querySelector("#call-bridge").addEventListener("click", () => {
  announce("All crew to the bridge");
});
document.querySelector("#watch-time").textContent = `Total watch time: ${daysAndHours(totalHours)}`;

// New arrivals
let rookies = 0;
document.querySelector("#add-rookie").addEventListener("click", () => {
  rookies++;
  const item = document.createElement("li");
  item.textContent = `Rookie ${rookies}`;
  document.querySelector("#crew").append(item);
  updateRoster();
});
document.querySelector("#remove-last").addEventListener("click", () => {
  document.querySelector("#crew li:last-child").remove();
  updateRoster();
});

// Roll call, from the cards
function presentText(count) {
  return `${count} present`;
}

document.querySelector("#roll-call-button").addEventListener("click", () => {
  const list = document.querySelector("#roll-call");
  list.textContent = "";
  const cards = document.querySelectorAll(".card");
  for (const card of cards) {
    const item = document.createElement("li");
    const name = card.querySelector("h3").textContent;
    const role = card.querySelector(".role").textContent;
    item.textContent = `${name} (${role})`;
    list.append(item);
  }
  document.querySelector("#roll-summary").textContent = presentText(cards.length);
});
```

```html schedule.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Flight Schedule</title>
    <link rel="stylesheet" href="style.css" />
    <script src="schedule.js" defer></script>
  </head>
  <body>
    <nav>
      <a href="index.html">Home</a>
      <a href="crew.html">Crew</a>
      <a href="crew.html#duty">Duty</a>
      <a href="schedule.html">Schedule</a>
    </nav>
    <h1>Flight Schedule</h1>
    <p>Every departure from the station today.</p>
    <div class="banner"></div>

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
        <tr>
          <td class="code">SL-101</td>
          <td class="destination">Moon Base</td>
          <td class="departs">08:30</td>
          <td class="status">Boarding</td>
        </tr>
        <tr>
          <td class="code">SL-102</td>
          <td class="destination">Mars Relay</td>
          <td class="departs">09:45</td>
          <td class="status">On time</td>
        </tr>
        <tr class="delayed">
          <td class="code">SL-103</td>
          <td class="destination">Europa Outpost</td>
          <td class="departs">07:15</td>
          <td class="status">Delayed</td>
        </tr>
        <tr class="cancelled">
          <td class="code">SL-104</td>
          <td class="destination">Lunar Gateway</td>
          <td class="departs">11:00</td>
          <td class="status">Cancelled</td>
        </tr>
        <tr>
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
    <p id="first-flight-note"></p>
    <p id="flight-count"></p>
    <p>Fuel: <span id="fuel-start">100</span> units, burning <span id="burn-rate">15</span> a minute</p>
    <p id="fuel"></p>
    <p id="first-delay"></p>
    <p id="active-count"></p>
    <p id="next-flight"></p>
    <p id="destinations"></p>
    <p id="on-time"></p>
    <p id="before-ten"></p>

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
  </body>
</html>
```

```js schedule.js
// Boarding check
const flightRows = document.querySelectorAll("#flights tbody tr");
const firstStatus = flightRows[0].querySelector(".status").textContent;
const isBoarding = firstStatus === "Boarding";
document.querySelector("#boarding-now").textContent = `First flight boarding: ${isBoarding}`;

console.log("Loose:", "7" == 7);
console.log("Strict:", "7" === 7);

// Gate message
const gateMessage = document.querySelector("#gate-message");
if (isBoarding) {
  const firstCode = flightRows[0].querySelector(".code").textContent;
  gateMessage.textContent = `Now boarding: ${firstCode}`;
} else {
  gateMessage.textContent = "No flight is boarding yet";
}

// Flight notes
let note;
if (firstStatus === "On time") {
  note = "On schedule";
} else if (firstStatus === "Boarding") {
  note = "Go to the gate";
} else if (firstStatus === "Delayed") {
  note = "Running late";
} else if (firstStatus === "Cancelled") {
  note = "Grounded";
} else {
  note = "Check the board";
}
document.querySelector("#first-flight-note").textContent = note;

const flightCount = flightRows.length;
const flightWord = flightCount === 1 ? "flight" : "flights";
document.querySelector("#flight-count").textContent = `${flightCount} ${flightWord} today`;

// Fuel gauge
let fuel = Number(document.querySelector("#fuel-start").textContent);
const burnRate = Number(document.querySelector("#burn-rate").textContent);
let minutes = 0;
while (fuel > 0) {
  fuel -= burnRate;
  minutes++;
}
document.querySelector("#fuel").textContent = `Fuel lasts ${minutes} minutes`;

// Board scan
let firstDelay = "none";
for (const row of flightRows) {
  if (row.querySelector(".status").textContent === "Delayed") {
    firstDelay = row.querySelector(".code").textContent;
    break;
  }
}
document.querySelector("#first-delay").textContent = `First delay: ${firstDelay}`;

let activeFlights = 0;
for (const row of flightRows) {
  if (row.querySelector(".status").textContent === "Cancelled") {
    continue;
  }
  activeFlights++;
}
document.querySelector("#active-count").textContent = `Active flights: ${activeFlights}`;

// Next flight, as an object
const firstRow = flightRows[0];
const firstFlight = {
  code: firstRow.querySelector(".code").textContent,
  destination: firstRow.querySelector(".destination").textContent,
  departs: firstRow.querySelector(".departs").textContent,
  status: firstRow.querySelector(".status").textContent,
};
document.querySelector("#next-flight").textContent =
  `${firstFlight.code} to ${firstFlight.destination} at ${firstFlight.departs}`;
console.log("Status:", firstFlight["status"]);

// Every flight, as an array of objects
function readFlights() {
  const list = [];
  for (const row of document.querySelectorAll("#flights tbody tr")) {
    list.push({
      code: row.querySelector(".code").textContent,
      destination: row.querySelector(".destination").textContent,
      departs: row.querySelector(".departs").textContent,
      status: row.querySelector(".status").textContent,
    });
  }
  return list;
}

const flights = readFlights();
console.log(`${flights.length} flights read`);

const destinations = [];
for (const flight of flights) {
  destinations.push(flight.destination);
}
document.querySelector("#destinations").textContent = `Destinations: ${destinations.join(", ")}`;

// On time
const onTime = flights.filter((flight) => flight.status === "On time");
const onTimeCodes = [];
for (const flight of onTime) {
  onTimeCodes.push(flight.code);
}
document.querySelector("#on-time").textContent =
  `On time: ${onTimeCodes.length > 0 ? onTimeCodes.join(", ") : "none"}`;

// Before 10:00: HH:MM times compare as text, digit by digit
const beforeTen = flights
  .filter((flight) => flight.status !== "Cancelled" && Number(flight.departs) < 10)
  .map((flight) => `${flight.code} to ${flight.destination}`);
document.querySelector("#before-ten").textContent =
  `Before 10:00: ${beforeTen.length > 0 ? beforeTen.join(", ") : "none"}`;
```
