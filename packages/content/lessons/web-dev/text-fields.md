At a train station, the person at the desk asks for your name and writes it on your ticket. On a website, nobody asks out loud: the page gives you a box, and you type your name in it yourself.

## `<input>`

A box to type in is an `input` element:

```html preview
<p>Your name:</p>
<input />
```

Click in the box and type. The letters appear inside it, and you can delete them, move with the arrow keys, and select them, as in any app. The page does nothing with them yet: for now the box only holds what you typed.

Like `<img>` and `<br>`, `<input>` has no closing tag. The visitor writes what goes inside, not you.

## An id for each box

A form usually has more than one box: a name, an email, a date. Give each one an `id`, as you did with headings, so that later lessons, and your script, can tell them apart:

```html preview
<p>First name:</p>
<input id="first-name" />
<p>Last name:</p>
<input id="last-name" />
```

Two boxes, one under the other. They look the same, but each has its own name in the HTML.

## Break it on purpose

Try to put the words inside the box, between two tags:

```html preview
<input>Your name</input>
```

The box is empty, and "Your name" shows next to it, as plain text. An `input` has no inside: the browser closes it at once, and everything after it is just more of the page.

---

## Mission: The boarding page

Passengers want to book a seat on a flight without walking to the desk. Your site gets a fourth page for it: the boarding page.

**Example**: a new page, `boarding.html`, on the night blue of the site, with a heading and a short line like "Your full name:", and under it an empty box to type in.

- `boarding.html` is a whole page, in English, that can show any letter, with a name for its tab and a biggest heading, using the site's `style.css`.
- It has a box to type the passenger's name in, with the id `passenger`, under a line that says what to type.
- Every page's menu has a fourth link, to `boarding.html`.

Psst, `<input />` has no closing tag :)
