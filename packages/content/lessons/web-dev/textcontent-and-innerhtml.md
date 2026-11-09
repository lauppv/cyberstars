`textContent` writes plain words. Every character shows exactly as typed: write `<strong>Hi</strong>`, and the page shows the tags themselves, angle brackets and all. Sometimes you want the tags to **work**, so a word comes out bold.

## `innerHTML`

`innerHTML` is like `textContent`, but whatever you put in is read as **HTML**:

```js
document.querySelector("#note").innerHTML = "<strong>Sam</strong> joined the club";
```

```text
Sam joined the club        ("Sam" in bold)
```

The browser builds a real `<strong>` element inside `#note`, as if you'd written it in the HTML file.

Compare with `textContent`:

```js
document.querySelector("#note").textContent = "<strong>Sam</strong> joined the club";
```

```text
<strong>Sam</strong> joined the club
```

The tags show as plain characters. Nothing is bold.

## Reading it

Reading `innerHTML` gives the HTML inside the element, tags included:

```js
console.log(document.querySelector("#note").innerHTML);
```

```text
<strong>Sam</strong> joined the club
```

While `textContent` gives only the words: `Sam joined the club`.

## Break it on purpose

Forget to close a tag:

```js
note.innerHTML = "<strong>Sam joined the club";
```

The browser closes it for you at the end, so the whole sentence turns bold. As in an HTML file, close what you open.

---

## Mission: Latest arrival

The crew directory says who arrived last, with their name in bold.

**Example**: under the rookie buttons, after a click on `Add a rookie`, a paragraph says:

```text
Rookie 1 just arrived        ("Rookie 1" in bold)
```

- A paragraph with the id `latest`, under the rookie buttons.
- Each click on `Add a rookie` writes in it the new rookie's name in a `<strong>`, followed by ` just arrived`.

Psst, tags only work with `innerHTML` :)
