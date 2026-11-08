```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Launch Board</title>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js" defer></script>
  </head>
  <body>
    <h1>Launch Board</h1>
    <p id="summary"></p>
    <p id="next-launch"></p>
    <button type="button" id="hide-scrubbed" aria-pressed="false">Hide scrubbed</button>
    <table id="launches">
      <caption>Launches today</caption>
      <thead>
        <tr>
          <th scope="col">Rocket</th>
          <th scope="col">Pad</th>
          <th scope="col">Time</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="rocket">Kestrel</td>
          <td class="pad">Pad 1</td>
          <td class="time">11:40</td>
          <td class="status">Scheduled</td>
        </tr>
        <tr>
          <td class="rocket">Falcon</td>
          <td class="pad">Pad 2</td>
          <td class="time">09:15</td>
          <td class="status">Scheduled</td>
        </tr>
        <tr>
          <td class="rocket">Heron</td>
          <td class="pad">Pad 1</td>
          <td class="time">07:30</td>
          <td class="status">Launched</td>
        </tr>
        <tr>
          <td class="rocket">Albatross</td>
          <td class="pad">Pad 3</td>
          <td class="time">10:05</td>
          <td class="status">Scrubbed</td>
        </tr>
        <tr>
          <td class="rocket">Swift</td>
          <td class="pad">Pad 2</td>
          <td class="time">13:20</td>
          <td class="status">Scheduled</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
```

```css style.css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  font-family: Verdana, Geneva, sans-serif;
  background-color: #0b1d3a;
  color: #f0f4ff;
}

#launches {
  width: 100%;
  border-collapse: collapse;
}

#launches th,
#launches td {
  padding: 8px 12px;
  border-bottom: 1px solid #2c4a7a;
  text-align: left;
}

#launches tbody tr:nth-child(even) {
  background-color: #13294f;
}

#launches tbody tr:hover {
  background-color: #1d3b6e;
}

#launches td.status {
  font-weight: bold;
}

#launches tr.scrubbed td {
  text-decoration: line-through;
}

#launches.hide-scrubbed tr.scrubbed {
  display: none;
}
```

```js script.js
const rows = document.querySelectorAll("#launches tbody tr");
const launches = [];
for (const row of rows) {
  const launch = {
    rocket: row.querySelector(".rocket").textContent,
    time: row.querySelector(".time").textContent,
    status: row.querySelector(".status").textContent,
  };
  row.classList.add(launch.status.toLowerCase());
  launches.push(launch);
}

function countOf(status) {
  return launches.filter((launch) => launch.status === status).length;
}

document.querySelector("#summary").textContent =
  `${countOf("Scheduled")} scheduled, ${countOf("Scrubbed")} scrubbed, ${countOf("Launched")} launched`;

const scheduled = launches
  .filter((launch) => launch.status === "Scheduled")
  .sort((a, b) => a.time.localeCompare(b.time));
const nextLaunch = document.querySelector("#next-launch");
if (scheduled.length > 0) {
  nextLaunch.textContent = `Next launch: ${scheduled[0].rocket} at ${scheduled[0].time}`;
} else {
  nextLaunch.textContent = "No launch scheduled";
}

const hideScrubbed = document.querySelector("#hide-scrubbed");
hideScrubbed.addEventListener("click", () => {
  const table = document.querySelector("#launches");
  const hidden = table.classList.toggle("hide-scrubbed");
  hideScrubbed.setAttribute("aria-pressed", String(hidden));
  hideScrubbed.textContent = hidden ? "Show scrubbed" : "Hide scrubbed";
});
```
