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
            <h3>Day at the Stands</h3>
            <p>€35</p>
            <p>A seat on the stands with a guide, who explains every step of the countdown.</p>
            <button type="button">Choose</button>
          </article>
          <article class="trip">
            <span class="badge">Best seller</span>
            <h3>Night Launch</h3>
            <p>€59</p>
            <p>Watch a rocket light up the dark sky, then look at the stars through our telescopes.</p>
            <button type="button">Choose</button>
          </article>
          <article class="trip">
            <h3>Family Pass</h3>
            <p>€110</p>
            <p>Two adults and up to three children, with seats in the front row.</p>
            <button type="button">Choose</button>
          </article>
          <article class="trip">
            <h3>Close to the Pad</h3>
            <p>€149</p>
            <p>A bus takes you 2 km from the pad, the closest point open to visitors, for lunch with an engineer.</p>
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

header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 16px;
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

#menu-button {
  margin-left: auto;
}

#menu {
  position: absolute;
  top: 100%;
  right: 16px;
  display: none;
  flex-direction: column;
  padding: 8px;
  background-color: #13294f;
  border: 1px solid #2c4a7a;
  border-radius: 6px;
}

#menu a {
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
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 220px;
  padding: 40px 16px 16px;
  background-color: #13294f;
  border: 2px solid #2c4a7a;
  border-radius: 8px;
}

.trip h3,
.trip p {
  margin: 0 0 8px;
}

.trip p:last-of-type {
  flex-grow: 1;
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
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: 280px;
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

const showMenu = (open = false) => {
  menu.style.display = open ? "flex" : "none";
  menuButton.setAttribute("aria-expanded", String(open));
};

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  showMenu(!open);
});

menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    showMenu();
  }
});

const trips = document.querySelector("#trips");
const choice = document.querySelector("#choice");

trips.addEventListener("click", (event) => {
  const button = event.target.closest(".trip button");
  if (!button) {
    return;
  }
  const trip = button.closest(".trip");
  for (const card of trips.querySelectorAll(".trip")) {
    card.classList.remove("chosen");
  }
  trip.classList.add("chosen");
  choice.textContent = `You chose: ${trip.querySelector("h3").textContent}`;
});
```
