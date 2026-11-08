```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Cargo Ledger</title>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js" defer></script>
  </head>
  <body>
    <h1>Cargo Ledger</h1>
    <ul id="cargo">
      <li><span class="item">Water</span>: <span class="weight">120</span> kg</li>
      <li><span class="item">Seeds</span>: <span class="weight">45</span> kg</li>
      <li><span class="item">Fuel cells</span>: <span class="weight">200</span> kg</li>
      <li><span class="item">Oxygen</span>: <span class="weight">85</span> kg</li>
    </ul>
    <p id="total"></p>
    <p id="average"></p>
    <button type="button" id="new-crate">New crate</button>
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
  max-width: 640px;
  margin: 0 auto;
  padding: 0 16px;
  font-family: Verdana, Geneva, sans-serif;
  background-color: #0b1d3a;
  color: #f0f4ff;
}

#cargo {
  background-color: #13294f;
  padding: 16px 16px 16px 40px;
  border: 2px solid #2c4a7a;
  border-radius: 12px;
}
```

```js script.js
const list = document.getElementById("cargo");

function update() {
  const spans = list.querySelectorAll(".weight");
  let sum = 0;
  for (let i = 0; i < spans.length; i++) sum += parseInt(spans[i].textContent);
  document.getElementById("total").textContent = "Total: " + sum + " kg in " + spans.length + " crates";
  document.getElementById("average").textContent = "Average: " + Math.round(sum / spans.length) + " kg";
}

document.getElementById("new-crate").addEventListener("click", () => {
  const li = document.createElement("li");
  const item = document.createElement("span");
  item.className = "item";
  item.textContent = "Spare parts";
  const weight = document.createElement("span");
  weight.className = "weight";
  weight.textContent = 25;
  li.append(item, ": ", weight, " kg");
  list.append(li);
  update();
});

update();
```
