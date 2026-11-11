Take a photo of a crowd, then three more people walk in. Count the people in the photo: still the old number. The photo shows the moment you took it. A list from `querySelectorAll` is like that photo.

## A list is a snapshot

```js
const games = document.querySelectorAll("#games li");
console.log(games.length);

const item = document.createElement("li");
item.textContent = "darts";
document.querySelector("#games").append(item);

console.log(games.length);
```

```text
2
2
```

The page now has 3 games, but `games` still says 2. `querySelectorAll` looked at the page **once**, when that line ran, and kept what it found then. Elements added or removed afterwards don't change it.

## Look again when you need it

To get the count **now**, ask again, right when you need it:

```js
console.log(document.querySelectorAll("#games li").length);
```

```text
3
```

That's why a function that shows a count should do its own `querySelectorAll` inside it:

```js
function showCount() {
  const count = document.querySelectorAll("#games li").length;
  document.querySelector("#count").textContent = `${count} games`;
}
```

Call it after every add and every remove, and it's always right.

## Break it on purpose

Keep a list from when the page opened, and use it in your function:

```js
const games = document.querySelectorAll("#games li");
function showCount() {
  document.querySelector("#count").textContent = `${games.length} games`;
}
```

Add a game, call `showCount()`: the count doesn't move. It counts the old snapshot. A count that's stuck usually means an old list.

---

## Mission: A roster that keeps up

Your roster says how many crew members there are, but when you add or remove a rookie, it doesn't change.

**Example**: the roster says `4 crew members on board`. Add a rookie, and it says `5 crew members on board`. Remove the last, and it's back to 4.

- After every click on `Add a rookie` and on `Remove the last`, the roster shows how many items the crew list has at that moment, followed by ` crew members on board`.
- When the page opens, it's right too.

Psst, count again each time, inside a function :)
