An address on an envelope is one thing, but it's written on several lines: the name, the street, the town. A poem is the same: one poem, many short lines.

Making each line its own paragraph would be wrong here. It's one address, not three ideas. What we want is a new line **inside** a paragraph.

## `<br>`

`<br>` is short for **break**, a line break. It's like pressing Enter, but one the browser listens to:

```html preview
<p>
  Sam Green<br />
  12 Oak Street<br />
  Bristol
</p>
```

One paragraph, three lines. Like `<meta>`, `<br>` has nothing inside it, so it has no closing tag. The `/` before `>` is optional.

Notice there's no `<br>` after the last line. The paragraph ends there anyway.

## When not to use it

`<br>` is for line breaks that are part of the text itself: an address, a poem, the lines of a song. It's **not** for spacing things out.

```html preview
<p>Clean your room.</p>
<br />
<br />
<p>Feed the cat.</p>
```

This pushes the second paragraph further down, but it's a hack. The paragraphs are separate ideas, so `<p>` already puts space between them, and later CSS will let you choose exactly how much. A pile of `<br>`s is hard to change and means nothing.

And if each line is its own idea, like your station's rules, keep them as separate paragraphs.

## Break it on purpose

Write the address with Enters only, and no `<br>`:

```html preview
<p>
  Sam Green
  12 Oak Street
  Bristol
</p>
```

As you saw last lesson, the Enters turn into spaces, and the address squeezes onto one line.

---

## Mission: The station's address

Your `index.html` has its parts and the rules at the end. Visitors also need to know where to find you.

**Example**: in your first part, under About the Station, your page would show something like this:

```text
Orbital Station 7
Docking Ring B
Low Earth Orbit
```

- Your first `<h2>` part has the station's address, in one paragraph.
- The address shows on at least three lines.

Psst, no `<br>` after the last line :)
