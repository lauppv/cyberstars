```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Station Log</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Welcome aboard</h1>
    <img
      src="img/station.svg"
      alt="A gold station hub inside a blue ring, with a solar panel on each side"
      width="320"
      height="200"
    />
    <p>The station orbits the Earth every 92 minutes.</p>
    <p class="jumps"><a href="#today">Jump to today</a> · <a href="#visiting">Visiting hours</a></p>

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
body {
  background-color: #0b1d3a;
  color: #f0f4ff;
  font-family: Verdana, Geneva, sans-serif;
  line-height: 1.6;
  font-size: 1.125rem;
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
}

#visiting {
  color: #ffd166;
}

sub,
sup {
  color: teal;
}
```
