```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Crew Profile</title>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js" defer></script>
  </head>
  <body>
    <h1>Ada Okafor</h1>
    <p class="role">Chief engineer, Docking Ring B</p>

    <h2>Skills</h2>
    <p>Fixes solar panels in the dark, speaks four languages and bakes bread in orbit.</p>

    <h2>Last Mission</h2>
    <p><strong>Forty hours outside the station</strong> to replace a cracked antenna.</p>

    <p><a href="mailto:ada@station.example">Write to Ada</a></p>

    <button type="button" id="salute">Salute</button>
    <p id="greeting"></p>
  </body>
</html>
```

```css style.css
body {
  background-color: #10172b;
  color: #eef2ff;
  font-family: Verdana, Geneva, sans-serif;
  font-size: 1.125rem;
  line-height: 1.6;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #ffd166;
}

h2 {
  font-size: 1.5rem;
  color: #8ecbff;
}

a {
  color: #8ecbff;
}

.role {
  font-style: italic;
  text-align: center;
}
```

```js script.js
const name = document.querySelector("h1").textContent;
const greeting = document.querySelector("#greeting");
const salute = document.querySelector("#salute");

salute.addEventListener("click", () => {
  greeting.textContent = `${name} salutes you!`;
});
```
