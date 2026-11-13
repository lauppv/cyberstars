```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Live readings from the rover Lyra on Mars: battery, signal, temperature and more." />
    <title>Rover Status</title>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js" defer></script>
  </head>
  <body>
    <header>
      <h1>Rover Status</h1>
      <p id="clock"></p>
      <p>Landed on <span id="landing">2031-02-18</span>: <span id="days-on-mars"></span></p>
    </header>
    <main class="layout">
      <section class="readings" aria-label="Readings">
        <article class="reading" id="battery">
          <h2>Battery</h2>
          <p><span class="value">76</span> %</p>
        </article>
        <article class="reading">
          <h2>Solar panels</h2>
          <p><span class="value">58</span> %</p>
        </article>
        <article class="reading">
          <h2>Signal</h2>
          <p><span class="value">18</span> %</p>
        </article>
        <article class="reading">
          <h2>Dust filter</h2>
          <p><span class="value">64</span> %</p>
        </article>
        <article class="reading">
          <h2>Wheels</h2>
          <p><span class="value">91</span> %</p>
        </article>
      </section>
      <aside id="log">
        <h2>Today's log</h2>
        <ul>
          <li>08:00 Woke up and checked the wheels</li>
          <li>09:30 Drove 120 metres north</li>
          <li>11:15 Took photos of a red rock</li>
        </ul>
        <button type="button" id="refresh">Refresh</button>
        <p id="updated">Not updated yet</p>
      </aside>
    </main>
    <section id="checks">
      <h2>Checks</h2>
      <p id="warnings"></p>
      <p id="summary"></p>
    </section>
    <footer>
      <p>Rover team, Mission Control, Building 4</p>
    </footer>
  </body>
</html>
```

```css style.css
body {
  margin: 0 auto;
  max-width: 1100px;
  padding: 0 16px;
  background-color: #1b0f0a;
  color: #fbe9dd;
  font-family: Verdana, Geneva, sans-serif;
}

h1 {
  color: #ff9b5e;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "readings"
    "log";
  gap: 24px;
}

.readings {
  grid-area: readings;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.reading {
  background-color: #3a1f14;
  padding: 0 16px;
  border-radius: 12px;
  display: grid;
  justify-items: center;
}

.value {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd166;
}

#log {
  grid-area: log;
  background-color: #2a1610;
  padding: 0 16px 16px;
  border-radius: 12px;
}

#log ul {
  padding-left: 20px;
}

@media (min-width: 448px) {
  #battery {
    grid-column: span 2;
  }
}

@media (min-width: 900px) {
  .layout {
    grid-template-columns: 1fr 300px;
    grid-template-areas: "readings log";
  }
}
```

```js script.js
const readings = [];
for (const card of document.querySelectorAll(".reading")) {
  readings.push({
    name: card.querySelector("h2").textContent,
    value: Number(card.querySelector(".value").textContent),
  });
}

const low = readings.filter((reading) => reading.value < 20).map((reading) => reading.name);
document.querySelector("#warnings").textContent =
  low.length === 0 ? "All readings are fine" : `Check: ${low.join(", ")}`;

const highest = readings.reduce((top, reading) => (reading.value > top.value ? reading : top));
document.querySelector("#summary").textContent = `${readings.length} readings, highest: ${highest.name} (${highest.value})`;

const showClock = () => {
  document.querySelector("#clock").textContent = `Mission time: ${new Date().toLocaleTimeString("en-GB")}`;
};
showClock();
setInterval(showClock, 1000);

const landing = new Date(document.querySelector("#landing").textContent);
const days = Math.ceil((new Date() - landing) / (1000 * 60 * 60 * 24));
document.querySelector("#days-on-mars").textContent = `${days} days on Mars`;

document.querySelector("#refresh").addEventListener("click", () => {
  const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  document.querySelector("#updated").textContent = `Updated at ${time}`;
});
```
