```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Station Log</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <nav>
      <a href="index.html">Home</a>
      <a href="crew.html">Crew</a>
      <a href="schedule.html">Schedule</a>
    </nav>
    <h1>Welcome aboard</h1>
    <img src="img/station.svg" alt="A gold station hub inside a blue ring, with a solar panel on each side"
      width="240"
      height="150"
    />
    <p>The station goes round the Earth every 92 minutes.</p>
    <p>Six people live here, with a greenhouse full of tomatoes.</p>
    <p class="jumps"><a href="#today">Jump to today</a> · <a href="#visiting">Visiting hours</a></p>
    <p><a href="crew.html">Meet the crew</a></p>

    <h2>About the Station</h2>
    <p>Five space agencies built the station together in 2031, and <em>every</em> one of them still sends crew.</p>
    <p class="address">
      Orbital Station 7<br />
      Docking Ring B<br />
      Low Earth Orbit
    </p>
    <p>On board: <mark>a gym</mark>, <mark>a greenhouse</mark> and <mark>a telescope</mark>.</p>
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
  </body>
</html>
```

```image img/station.svg

```

```image img/divider.svg

```

```css style.css
body {
  background-color: #0b1d3a;
  box-sizing: border-box;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
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
```

```html crew.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Crew Directory</title>
    <link rel="stylesheet" href="style.css" />
    <script src="check.js" defer></script>
    <script src="crew.js" defer></script>
    <script src="countdown.js" defer></script>
  </head>
  <body>
    <nav>
      <a href="index.html">Home</a>
      <a href="crew.html">Crew</a>
      <a href="schedule.html">Schedule</a>
    </nav>
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
  </body>
</html>
```

```html people/vega.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Mara Vega</title>
    <link rel="stylesheet" href="../style.css" />
  </head>
  <body>
    <nav>
      <a href="../index.html">Home</a>
      <a href="../crew.html">Crew</a>
      <a href="../schedule.html">Schedule</a>
    </nav>
    <h1>Commander Mara Vega</h1>
    <img
      src="../img/station.svg"
      alt="The station she commands: a gold hub inside a blue ring"
      width="240"
      height="150"
    />
    <p>Twenty years in orbit, three of them in charge of this station.</p>
    <p><a href="../crew.html">Back to the crew directory</a></p>
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
    <title>Flight Schedule</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <nav>
      <a href="index.html">Home</a>
      <a href="crew.html">Crew</a>
      <a href="schedule.html">Schedule</a>
    </nav>
    <h1>Flight Schedule</h1>
    <p>Every departure from the station today.</p>

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
          <td>SL-101</td>
          <td>Moon Base</td>
          <td>08:30</td>
          <td>Boarding</td>
        </tr>
        <tr>
          <td>SL-102</td>
          <td>Mars Relay</td>
          <td>09:45</td>
          <td>On time</td>
        </tr>
        <tr>
          <td>SL-103</td>
          <td>Europa Outpost</td>
          <td>07:15</td>
          <td>Delayed</td>
        </tr>
        <tr>
          <td>SL-104</td>
          <td>Lunar Gateway</td>
          <td>11:00</td>
          <td>Cancelled</td>
        </tr>
        <tr>
          <td>SL-105</td>
          <td>Orbital Yard</td>
          <td>10:20</td>
          <td>On time</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">All times in station time</td>
        </tr>
      </tfoot>
    </table>

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
          <td>Bay 1</td>
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
