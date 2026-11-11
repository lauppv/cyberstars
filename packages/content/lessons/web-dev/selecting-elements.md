So far, your script only talks to the console. The page itself hasn't changed at all. To change the page, a script first has to **find** the part it wants to change, the way you'd point at something on a map before you draw on it.

## The page as a tree

When the browser reads your HTML, it builds the page in memory: every element, inside the one that holds it, like branches on a tree. JavaScript can reach every one of them through `document`, the whole page.

## `document.querySelector`

`querySelector` finds an element with a **selector**, written exactly like in CSS:

```js
const heading = document.querySelector("h1");
const list = document.querySelector("#members");
const tip = document.querySelector(".tip");
```

- `"h1"`: the first `h1` on the page;
- `"#members"`: the element with the id `members`;
- `".tip"`: the first element with the class `tip`.

It gives you the **first** element that matches, and you keep it under a name to use later.

Log one, and the console shows which element it found:

```js
console.log(heading);
```

```text
<h1>
```

That's the element itself, not its text. You'll read its text in the next lesson.

## Nothing found: `null`

When no element matches, you get `null`, which means "nothing":

```js
console.log(document.querySelector("#member"));
```

```text
null
```

There's no `#member`, only `#members`. A `null` in your console is almost always a selector that doesn't match: a typo, a missing `#` or `.`, or the wrong name.

## Break it on purpose

Forget the `#`:

```js
const list = document.querySelector("members");
```

`null`. Without the `#`, it looks for a tag called `<members>`, as in CSS. Same rules as your style sheet.

---

## Mission: Find the parts

Your crew directory's script should be able to find the parts of the page it will work with.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
<ul>
<h2>
```

- In `crew.js`, the crew list is found by its id and logged: the console shows `<ul>`.
- The duty board's heading is found by its id and logged: the console shows `<h2>`.

Psst, if you see `null`, check your selector's `#` :)
