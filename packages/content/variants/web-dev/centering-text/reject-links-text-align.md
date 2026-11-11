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
}

.duties {
  background-color: #13294f;
  padding: 16px 16px 16px 40px;
  box-sizing: border-box;
  max-width: 600px;
  margin: 16px auto;
}

nav a {
  text-align: center;
}
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
    </nav>
    <h1>Crew Directory</h1>
    <p>Everyone who lives and works on the station, and where to find them.</p>
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
      </div>
      <div class="card">
        <h3>Tomas Okafor</h3>
        <p>Job: <span class="role">Engineer</span></p>
      </div>
      <div class="card">
        <h3>Ines Lindqvist</h3>
        <p>Job: <span class="role">Pilot</span></p>
      </div>
      <div class="card">
        <h3>Kenji Arano</h3>
        <p>Job: <span class="role">Botanist</span></p>
      </div>
    </div>

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
