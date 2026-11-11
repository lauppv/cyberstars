Have you noticed that a `<p>` always starts on a new line, while a `<strong>` stays right in the middle of its sentence? That's no accident. HTML elements come in two kinds.

Think of a shelf of books. Each **book** takes a whole row of the shelf to itself. The **sticky notes** inside a book sit in the middle of a page, among the words. Elements are like that.

## Block elements: a row of their own

A **block** element starts on a new line and takes the whole width of the page, even if its text is short. `<h1>` to `<h6>` and `<p>` are blocks:

```html
<h2>Snacks</h2>
<p>Apples</p>
<p>Crisps</p>
```

```text
Snacks
Apples
Crisps
```

Each one on its own line, stacked one under the other.

## Inline elements: inside the line

An **inline** element sits inside a line of text, as wide as its words, and doesn't push anything onto a new line. `<strong>`, `<em>`, `<mark>`, `<small>`, `<sub>`, `<sup>` and `<br>` are inline:

```html
<p>We have <mark>apples</mark>, <mark>crisps</mark> and <mark>juice</mark>.</p>
```

```text
We have apples, crisps and juice.      (three highlighted words, all on one line)
```

The three `<mark>`s sit side by side, inside the paragraph's line.

## Inline goes inside block

An inline element is part of a sentence, so it goes **inside** a block, the way `<strong>` sits inside `<p>`. A block doesn't go inside a `<p>`: a paragraph is text, and a heading inside it makes no sense.

## Break it on purpose

Try to put the three snacks side by side as paragraphs:

```html
<p>Apples</p> <p>Crisps</p> <p>Juice</p>
```

```text
Apples
Crisps
Juice
```

Writing them on one line of the file doesn't help. Each `<p>` is a block, so each one takes its own row anyway. To keep words on one line, they go in one paragraph, each one in an inline tag.

---

## Mission: What's on board

Your `index.html` has its parts. In About the Station, add a line that shows what the station has, with each thing highlighted.

**Example**: your page would show something like this, all on one line:

```text
On board: a gym, a greenhouse and a telescope.       (gym, greenhouse and telescope highlighted)
```

- One paragraph has at least three highlighted words or groups of words, each in `<mark>`.
- They show side by side, on the same line.

Psst, one paragraph for the whole line, not one for each thing :)
