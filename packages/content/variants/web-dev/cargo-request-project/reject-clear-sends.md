```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Cargo Request</title>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js" defer></script>
  </head>
  <body>
    <h1>Cargo Request</h1>
    <p>Ask for what you need on the next supply ship. The supply office on Earth reads every request.</p>
    <form id="request" action="https://supply.example.com/requests" method="post">
      <label for="crew">Your name</label>
      <input id="crew" name="crew" required aria-describedby="crew-error" />
      <p id="crew-error"></p>

      <label for="item">Item</label>
      <input id="item" name="item" required minlength="3" maxlength="40" placeholder="e.g. Seed packs" />

      <label for="quantity">How many</label>
      <input type="number" id="quantity" name="quantity" required min="1" max="20" />

      <label for="code">Catalog code</label>
      <input id="code" name="code" required pattern="[A-Z]{2}-\d{4}" placeholder="e.g. FD-2041" />
      <p id="kind"></p>

      <label for="module">Deliver to</label>
      <select id="module" name="module" required>
        <option value="">Pick a module</option>
        <option value="hab">Living quarters</option>
        <option value="lab">Lab</option>
        <option value="dock">Docking bay</option>
        <option value="greenhouse">Greenhouse</option>
      </select>

      <fieldset>
        <legend>How urgent?</legend>
        <input type="radio" id="low" name="priority" value="low" />
        <label for="low">Low</label>
        <input type="radio" id="normal" name="priority" value="normal" checked />
        <label for="normal">Normal</label>
        <input type="radio" id="urgent" name="priority" value="urgent" />
        <label for="urgent">Urgent</label>
      </fieldset>

      <input type="checkbox" id="fragile" name="fragile" value="yes" />
      <label for="fragile">Fragile, handle with care</label>

      <label for="notes">Notes for the supply office</label>
      <textarea id="notes" name="notes" maxlength="200" rows="4"></textarea>

      <button type="submit" id="send">Send request</button>
      <button id="clear">Clear</button>
    </form>
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
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px 32px;
  font-family: Verdana, Geneva, sans-serif;
  line-height: 1.5;
  background-color: #0b1d3a;
  color: #f0f4ff;
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
  font-weight: bold;
}

input,
select,
textarea {
  display: block;
  width: 100%;
  padding: 8px;
  border: 2px solid #5a7bb0;
  border-radius: 4px;
  background-color: #13294f;
  color: #f0f4ff;
}

input[type="radio"],
input[type="checkbox"] {
  display: inline-block;
  width: auto;
  accent-color: #ffd166;
}

input[type="radio"] + label,
input[type="checkbox"] + label {
  display: inline;
  margin-right: 16px;
  font-weight: normal;
}

input[type="radio"]:checked + label {
  color: #ffd166;
  font-weight: bold;
}

input:user-invalid,
select:user-invalid,
textarea:user-invalid {
  border-color: #ff6b6b;
}

fieldset {
  margin-top: 24px;
  border: 2px solid #2c4a7a;
  border-radius: 4px;
}

legend {
  padding: 0 8px;
  font-weight: bold;
}

#crew-error {
  margin: 4px 0 0;
  color: #ff8a8a;
}

#kind {
  margin: 4px 0 0;
  color: #a9c1ea;
}

button {
  margin-top: 24px;
  padding: 8px 16px;
  border-radius: 4px;
}

#send {
  border: 2px solid #ffd166;
  background-color: #ffd166;
  color: #0b1d3a;
  font-weight: bold;
}

#clear {
  border: 2px solid #5a7bb0;
  background-color: transparent;
  color: #f0f4ff;
}
```

```js script.js
const form = document.querySelector("#request");
const crew = document.querySelector("#crew");
const crewError = document.querySelector("#crew-error");
const code = document.querySelector("#code");
const kind = document.querySelector("#kind");

code.addEventListener("input", () => {
  switch (code.value.slice(0, 2)) {
    case "FD":
      kind.textContent = "Food";
      break;
    case "MD":
      kind.textContent = "Medicine";
      break;
    case "TL":
      kind.textContent = "Tools";
      break;
    default:
      kind.textContent = "Unknown kind";
  }
  if (kind.textContent === "Unknown kind") {
    code.setCustomValidity("We send only food (FD), medicine (MD) and tools (TL).");
  } else {
    code.setCustomValidity("");
  }
});

form.addEventListener("submit", (event) => {
  if (!crew.value.trim()) {
    event.preventDefault();
    crewError.textContent = "Write your name";
    crew.setAttribute("aria-invalid", "true");
  } else {
    crewError.textContent = "";
    crew.setAttribute("aria-invalid", "false");
  }
});
```
