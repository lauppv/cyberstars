```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Watch a rocket launch from the stands of Lyra Spaceport." />
    <title>Lyra Spaceport</title>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js" defer></script>
  </head>
  <body>
    <header>
      <h1>Lyra Spaceport</h1>
      <button type="button" id="menu-button" aria-expanded="false">Menu</button>
      <nav id="menu" aria-label="Main menu">
        <a href="#trips">Trips</a>
        <a href="#visit">Your visit</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main>
      <section id="trips">
        <h2>Trips &amp; prices</h2>
        <p>Watch a real rocket launch from our stands, 4&nbsp;km from the pad. Pick a trip, and we keep a seat for you.</p>
        <div class="trip-list">
          <article class="trip">
            <h3>Stands Ticket</h3>
            <p>€30</p>
            <p>A seat on the stands.</p>
            <button type="button">Choose</button>
          </article>
          <article class="trip">
            <span class="badge">Best seller</span>
            <h3>Launch at Dusk</h3>
            <p>€55</p>
            <p>The rocket lifts off as the sun goes down.</p>
            <button type="button">Choose</button>
          </article>
          <article class="trip">
            <h3>Kids Go Free</h3>
            <p>€80</p>
            <p>Two adults, and children come free.</p>
            <button type="button">Choose</button>
          </article>
          <article class="trip">
            <h3>Engineer Lunch</h3>
            <p>€140</p>
            <p>Lunch with an engineer who built the rocket.</p>
            <button type="button">Choose</button>
          </article>
          <article class="trip">
            <h3>Photo Spot</h3>
            <p>€45</p>
            <p>A place on the hill with the best view for a camera.</p>
            <button type="button">Choose</button>
          </article>
        </div>
      </section>
      <aside id="visit">
        <h2>Your visit</h2>
        <p id="choice">No trip chosen yet</p>
        <h3>What to bring</h3>
        <ul>
          <li>Ear plugs: a launch is loud</li>
          <li>A warm jacket for the night</li>
          <li>Water and a snack</li>
        </ul>
      </aside>
    </main>
    <footer id="contact">
      <p>Lyra Spaceport, 12 Coast Road</p>
      <p><a href="mailto:visit@lyra-spaceport.test">visit@lyra-spaceport.test</a></p>
    </footer>
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
  margin: 0;
  font-family: Verdana, Geneva, sans-serif;
  line-height: 1.5;
  background-color: #0b1d3a;
  color: #f0f4ff;
}

a {
  color: #ffd166;
}

body {
  padding-top: 64px;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 12px 16px;
  background-color: #0b1d3a;
  border-bottom: 1px solid #2c4a7a;
}

header h1 {
  margin: 0;
  font-size: 1.5rem;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font: inherit;
  background-color: #ffd166;
  color: #0b1d3a;
  cursor: pointer;
}

#menu {
  position: absolute;
  top: 100%;
  right: 16px;
  display: none;
  padding: 8px;
  background-color: #13294f;
  border: 1px solid #2c4a7a;
  border-radius: 6px;
}

#menu.open {
  display: block;
}

#menu a {
  display: block;
  padding: 8px 16px;
}

main {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
  padding: 16px;
}

#trips {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 500px;
}

.trip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.trip {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 200px;
  padding: 40px 16px 16px;
  background-color: #13294f;
  border: 2px solid #2c4a7a;
  border-radius: 8px;
}

.trip h3,
.trip p {
  margin: 0 0 8px;
}

.trip.chosen {
  border-color: #ffd166;
  background-color: #1d3b6e;
}

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: #ffd166;
  color: #0b1d3a;
}

aside {
  flex-basis: 320px;
  flex-shrink: 0;
  padding: 16px;
  background-color: #13294f;
  border-radius: 8px;
}

aside h2 {
  margin-top: 0;
}

footer {
  padding: 16px;
  border-top: 1px solid #2c4a7a;
}
```

```js script.js
const menuButton = document.querySelector("#menu-button");
const menu = document.querySelector("#menu");

function setMenu(open) {
  if (open) {
    menu.classList.add("open");
  } else {
    menu.classList.remove("open");
  }
  menuButton.setAttribute("aria-expanded", open ? "true" : "false");
}

menuButton.addEventListener("click", () => {
  setMenu(!menu.classList.contains("open"));
});

menu.addEventListener("click", (event) => {
  const link = event.target.closest("#menu a");
  if (link) {
    setMenu(false);
  }
});

const list = document.querySelector(".trip-list");
list.addEventListener("click", (event) => {
  const card = event.target.closest(".trip");
  if (card && event.target.closest("button")) {
    const old = list.querySelector(".chosen");
    if (old) {
      old.classList.remove("chosen");
    }
    card.classList.add("chosen");
    const name = card.querySelector("h3").textContent;
    document.querySelector("#choice").textContent = "You chose: " + name;
  }
});
```
