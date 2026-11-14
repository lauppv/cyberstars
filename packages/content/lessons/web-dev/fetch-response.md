When you type an address in your browser and press Enter, the browser asks a computer somewhere for that page, and shows what comes back. A script can ask for things the same way, without leaving the page. That's how a weather app gets today's weather, or a game gets the high scores.

## An address that answers

For this course, CyberStars has a small **practice API**: an address that answers with station data instead of a web page. API means a way for programs to talk to each other. Open this address in a new tab:

```text
https://cyberstars.app/api/practice/starships
```

You see a list of starships, written in a way programs read well. That's what the tracker will show. The practice API is the same for everyone and never changes, so you can't break it.

## `fetch`

`fetch` asks an address for what it has, and returns a **promise**: the answer comes later, over the internet. So you `await` it, inside an `async` function:

```js
async function askWeather() {
  const response = await fetch("https://weather.example/today");
  console.log(response.status);
}

askWeather();
```

```text
200
```

The promise holds a **response**: the answer of the other computer. Before you read what's in it, look at its `status`, a number that says how it went:

- `200`: all is well, here is what you asked for.
- `404`: there is nothing at this address.
- `500` or `503`: the other computer has a problem right now.

You've seen `404` on websites already: "Page not found". It's the same number.

## Break it on purpose

Leave out `await`: `const response = fetch(...)`. Then `response` is the promise, not the answer, and `response.status` is `undefined`. Then make a typo in the address, like `/starship` without the s. The API still answers, but with `404`: there's nothing there. A wrong address doesn't stop the script: it gets an answer that says so.

---

## Mission: Hello, tracker

Time to stop playing with the slow tracker, and ask the real one.

**Example**: open the tracker. As soon as the practice API answers, the line says:

```text
The tracker answered 200
```

- In `tracker.js`, an `async` function `loadShips` asks `https://cyberstars.app/api/practice/starships` with `fetch`.
- Once the answer is in, it writes in `#tracker-status` `The tracker answered ` and the answer's status, whatever number it is.
- The page calls `loadShips` when it opens, instead of the radar.

Psst, the status is a number in the answer, not in the address :)
