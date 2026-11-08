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
function weightsOnPage() {
  const weights = [];
  for (const span of document.querySelectorAll("#cargo .weight")) {
    weights.push(Number(span.textContent));
  }
  return weights;
}

function showTotals() {
  const weights = weightsOnPage();
  let total = 0;
  for (const weight of weights) {
    total += weight;
  }
  document.querySelector("#total").textContent = `Total: ${total} kg in ${weights.length} crates`;
  document.querySelector("#average").textContent = `Average: ${Math.round(total / weights.length)} kg`;
}

document.querySelector("#new-crate").addEventListener("click", () => {
  const item = document.createElement("li");
  const name = document.createElement("span");
  name.className = "item";
  name.textContent = "Spare parts";
  const weight = document.createElement("span");
  weight.className = "weight";
  weight.textContent = "25";
  item.append(name, ": ", weight, " kg");
  document.querySelector("#cargo").append(item);
  showTotals();
});

showTotals();
```
