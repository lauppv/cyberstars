A kitchen timer rings once. A clock's second hand moves again and again, every second, as long as the clock works. For something that must happen over and over at the same pace, JavaScript has another timer.

## `setInterval`

`setInterval` takes the same two things as `setTimeout`, a function and a time in milliseconds. But it calls the function **again and again**, each time that much later:

```js
let seconds = 0;

setInterval(() => {
  seconds = seconds + 1;
  console.log(`${seconds} s`);
}, 1000);
```

```text
1 s
2 s
3 s
4 s
```

And so on, a line every second, as long as the page is open. `setTimeout` would have written `1 s` and stopped.

## A clock on the page

A function that writes the time, called every second, makes a clock:

```html preview
<p id="clock"></p>
<script>
  const showTime = () => {
    document.querySelector("#clock").textContent = new Date().toLocaleTimeString("en-GB");
  };
  showTime();
  setInterval(showTime, 1000);
</script>
```

The page shows the time, like `09:30:15`, and it changes every second. Two details matter here:

- `new Date()` is **inside** the function, so each call reads the time again. Outside it, the clock would show the same time forever.
- `showTime()` is called once by itself before `setInterval`. The first call of `setInterval` comes a whole second later, and the line would be empty until then.

`"en-GB"` writes the time as it's written in Britain: hours from 00 to 23, each part with two digits.

## Break it on purpose

Read the time once, before the timer:

```js
const time = new Date().toLocaleTimeString("en-GB");
setInterval(() => {
  document.querySelector("#clock").textContent = time;
}, 1000);
```

The clock stops at the moment the page opened. The function runs every second, but it writes the same old `time` each time. Whatever must change at every call has to be worked out inside the function.

---

## Mission: Station time

The crew lives on station time. The dashboard should show a clock that moves on by itself.

**Example**: at 9:30 in the morning, under the live data line, the dashboard says:

```text
Station time: 09:30:00
```

A second later, `Station time: 09:30:01`, and so on.

- Under `#live-status`, a paragraph with the id `station-clock`.
- It says `Station time: `, then the time with hours from 00 to 23, minutes and seconds, each with two digits and a `:` between them, as in the example.
- It shows the time as soon as the page opens, and moves on every second.

Psst, call your function once yourself, then let `setInterval` call it every second :)
