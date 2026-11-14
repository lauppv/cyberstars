```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="A text adventure on a space station: find your way to the bridge." />
    <title>Lost on the Station</title>
    <link rel="stylesheet" href="style.css" />
    <script type="module" src="game.js"></script>
  </head>
  <body>
    <main>
      <h1>Lost on the Station</h1>
      <p id="room-text"></p>
      <div id="exits"></div>
      <p id="moves">Moves: 0</p>
      <p id="game-status" aria-live="polite"></p>
      <button type="button" id="restart">Start again</button>
    </main>
  </body>
</html>
```

```css style.css
body {
  margin: 0;
  background-color: #050b18;
  color: #e8f0ff;
  font-family: Verdana, Geneva, sans-serif;
}

main {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px;
}

h1 {
  color: #7fe0c4;
}

#room-text {
  font-size: 1.2rem;
  line-height: 1.6;
}

#exits {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

button {
  padding: 10px 16px;
  border: 2px solid #7fe0c4;
  border-radius: 8px;
  background-color: #0e1f3d;
  color: #e8f0ff;
  font-size: 1rem;
}
```

```js rooms.js
export default {
  start: "airlock",
  rooms: {
    "airlock": {
      text: "You wake up in the airlock. The door to the north is open.",
      exits: {
        "north": "corridor"
      }
    },
    "corridor": {
      text: "A long corridor. Lights blink on the walls.",
      exits: {
        "south": "airlock",
        "east": "greenhouse",
        "north": "lift"
      }
    },
    "greenhouse": {
      text: "Tomatoes grow under purple lamps. It's warm here.",
      exits: {
        "west": "corridor"
      }
    },
    "lift": {
      text: "The lift hums. One button says Bridge.",
      exits: {
        "up": "bridge",
        "south": "corridor"
      }
    },
    "bridge": {
      text: "You reach the bridge. The captain smiles: welcome back!",
      exits: {},
      end: true
    }
  }
};
```

```js game.js
import map from "./rooms.js";

const roomText = document.querySelector("#room-text");
const exitBox = document.querySelector("#exits");
const movesLine = document.querySelector("#moves");
const gameStatus = document.querySelector("#game-status");

class Game {
  #room;
  #moves = 0;

  constructor(start) {
    this.#room = start;
  }

  get room() {
    return map.rooms[this.#room];
  }

  get moves() {
    return this.#moves;
  }

  go(direction) {
    this.#room = this.room.exits[direction];
    this.#moves += 1;
  }
}

let game = new Game(map.start);

function show() {
  const { text, exits, end } = game.room;
  roomText.textContent = text;
  movesLine.textContent = `Moves: ${game.moves}`;
  exitBox.innerHTML = "";
  if (end) {
    gameStatus.textContent = `You made it in ${game.moves} moves!`;
    return;
  }
  gameStatus.textContent = "";
  for (const direction of Object.keys(exits)) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `Go ${direction}`;
    button.addEventListener("click", () => {
      game.go(direction);
      show();
    });
    exitBox.append(button);
  }
}

document.querySelector("#restart").addEventListener("click", () => {
  game = new Game(map.start);
  show();
});

show();
```
