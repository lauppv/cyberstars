The title of a poster is usually in the middle. A letter starts on the left. A price in a shop's window sometimes sits on the right. Where a line of text sits, left, middle or right, is its **alignment**.

## `text-align`

```css
h1 {
  text-align: center;
}
```

The heading's text now sits in the middle of the page.

The values:

- `left`: the start of the line, what text does unless you say otherwise;
- `center`: the middle;
- `right`: the end of the line;
- `justify`: stretches each line so both edges are straight, like in a newspaper.

## It works on a block

`text-align` lines up the text **inside** a block. A heading or a paragraph is as wide as the page, so its text can move across that whole width.

On an inline element, like a `<strong>` in the middle of a sentence, it does nothing: the `<strong>` is only as wide as its words, so there's nowhere for them to move. To center some words, put them in their own paragraph and center the paragraph.

## Use it with care

Centered text is good for short things: a title, a line of links, a signature. A long paragraph in the middle is hard to read, because every line starts in a different place and your eyes have to search for it. Keep long text on the left.

## Break it on purpose

Center a link that's inside a sentence:

```css
a {
  text-align: center;
}
```

Nothing moves. The link is inline, only as wide as its words. Put the rule on the paragraph that holds it, and the whole line moves to the middle.

---

## Mission: Centered on top

The top of your page should feel like a station's entrance sign.

**Example**: Welcome aboard is in the middle of the page, and so is the line with Jump to today and Visiting hours.

- The biggest heading is centered.
- The paragraph with the jump links has the class `jumps`, and it's centered.

Psst, center the paragraph, not the links inside it :)
