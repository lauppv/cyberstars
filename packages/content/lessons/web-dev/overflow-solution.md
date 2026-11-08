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

nav a {
  display: inline-block;
  padding: 8px 12px;
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
  </head>
  <body>
    <nav>
      <a href="index.html">Home</a>
      <a href="crew.html">Crew</a>
      <a href="crew.html#duty">Duty</a>
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
        <p class="bio">Twenty years in orbit, three of them in charge of this station. Knows every bolt by its first name and still checks the airlocks herself before bed.</p>
      </div>
      <div class="card">
        <h3>Tomas Okafor</h3>
        <p>Job: <span class="role">Engineer</span></p>
        <p class="bio">Keeps the power on and the water clean. Spends his free time building a clock out of spare parts that has never once shown the right time.</p>
      </div>
      <div class="card">
        <h3>Ines Lindqvist</h3>
        <p>Job: <span class="role">Pilot</span></p>
        <p class="bio">Flies the supply runs and the rescue drills. Holds the station record for the softest docking, and reminds everyone of it at dinner.</p>
      </div>
      <div class="card">
        <h3>Kenji Arano</h3>
        <p>Job: <span class="role">Botanist</span></p>
        <p class="bio">Grows the tomatoes, the beans and the only flowers for four hundred kilometres. Talks to the plants, and claims they answer.</p>
      </div>
    </div>

    <h2 id="duty">Duty Board</h2>
    <ol>
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
