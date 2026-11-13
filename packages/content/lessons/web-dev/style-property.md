In a game, your health bar gets shorter each time you are hit. Nobody drew a picture for every length: the game works out a number, and sets the bar's width from it. A script can set one style of an element in the same way.

## `element.style`

Every element has a `style` property. Give one of its styles a value, and the element changes at once:

```html preview
<p id="note">Club meeting at five</p>
<button type="button" id="mark">Mark it</button>
<script>
  document.querySelector("#mark").addEventListener("click", () => {
    document.querySelector("#note").style.color = "orange";
  });
</script>
```

Click **Mark it**, and the note turns orange. The value is a text, written as in CSS: `"orange"`, `"bold"`, `"16px"`.

## Two words become one

In CSS, `background-color` has a dash. In JavaScript, a dash is a minus. So the name loses its dash, and the next word starts with a capital letter, in camelCase, like your variable names:

| CSS                | JavaScript              |
| ------------------ | ----------------------- |
| `color`            | `style.color`           |
| `background-color` | `style.backgroundColor` |
| `font-size`        | `style.fontSize`        |
| `text-decoration`  | `style.textDecoration`  |

## A size from a number

The health bar: a number goes down on each hit, and the bar's width follows it.

```html preview
<style>
  #health {
    background-color: lightgray;
  }

  #bar {
    background-color: green;
    height: 20px;
    width: 100%;
  }
</style>
<div id="health"><div id="bar"></div></div>
<button type="button" id="hit">Ouch!</button>
<script>
  const bar = document.querySelector("#bar");
  let health = 100;

  document.querySelector("#hit").addEventListener("click", () => {
    health = health - 10;
    bar.style.width = `${health}%`;
  });
</script>
```

Click **Ouch!**: the bar is 90% wide. Click again: 80%. A size needs its unit, as in CSS. Here the template literal joins the number and `%` into one text: `"90%"`.

## Break it on purpose

Keep the dash:

```js
bar.style.background-color = "red";
```

The console shows, as soon as the page opens:

```text
SyntaxError: Invalid left-hand side in assignment
```

JavaScript reads `bar.style.background - color`, a subtraction, and can't put a value into it. The whole script stops, so nothing on the page works. Write `backgroundColor`.

Now forget the unit:

```js
bar.style.width = health;
```

No error, but the bar never moves. A size without its unit means nothing to the browser, so it leaves the old size. Write `` `${health}%` ``.

---

## Mission: Bigger text

Some of the crew read the wiki from far away, on the big screen in the dining room. The front page gets two buttons that change the size of all its text.

Every text size in `style.css` is in `rem`, and `1rem` is the font size of the page's `html` element: 16px at first. Change the font size of the `html` element, and all the text grows with it.

**Example**: under the article count, the page says `Text size:` with two buttons. Click **Bigger** once, and all the text on the page is a bit bigger.

- Two buttons, with the ids `text-bigger` and `text-smaller`.
- The size starts at 16px. Each click on `#text-bigger` makes the font size of the `html` element 2px bigger: 18px, then 20px, and so on. Each click on `#text-smaller` makes it 2px smaller.
- The clicks add up, in any order: bigger, bigger, smaller gives 18px.

Psst, in JavaScript it's `fontSize`, and its value needs its unit :)
