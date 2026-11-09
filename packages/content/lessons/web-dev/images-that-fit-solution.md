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
    <img src="img/station.svg" alt="A gold station hub inside a blue ring, with a solar panel on each side"
      width="240"
      height="150"
    />
    <p>The station goes round the Earth every 92 minutes.</p>
    <p>Six people live here, with a greenhouse full of tomatoes.</p>
    <p class="jumps"><a href="#today">Jump to today</a> · <a href="#visiting">Visiting hours</a></p>

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
    <p>
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
  font-family: Verdana, Geneva, sans-serif;
}

h1 {
  color: #ffd166;
  font-family: Georgia, "Times New Roman", serif;
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
```
