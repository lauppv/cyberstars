**About the Station** is still empty. You already know `<p>`; this lesson is about what the browser does with the spaces and the new lines you type.

## The browser ignores your Enter

Type this in a page:

```html
<p>The cargo bay
   holds      forty
crates.</p>
```

The browser shows **The cargo bay holds forty crates.** on one line, with one space between the words. In HTML any run of spaces, tabs and new lines counts as **a single space**. That's what lets you indent your code however you like: the browser doesn't care.

So pressing Enter twice in the editor doesn't make a gap on the page. A new block of text is a new **paragraph**, and the browser leaves the room between paragraphs itself:

```html
<p>The cargo bay holds forty crates.</p>
<p>Two more bays are being built on the lower ring.</p>
```

## Line breaks

Some lines belong together and still need a line each: an address, a poem, the lines of a label. For them there is `<br>`, a **line break** inside a paragraph:

```html
<p>
  Cargo Bay 2<br />
  Lower Ring<br />
  Station Hub
</p>
```

`<br>` holds nothing, so it has no closing tag. It's an **empty element**, like `<meta>`. You'll see it written `<br>` and `<br />`; both mean the same.

Don't use `<br>` to make room between blocks. Two `<br>` in a row for a gap is the same mistake as pressing Enter twice: it's two paragraphs pretending to be one. A screen reader announces paragraphs one by one, so a fake one reads as a mess. Spacing has its own tool, CSS, which comes soon.

---

## Mission: Station Address

Under **About the Station**, add:

- two paragraphs of your own about the station: what it does, who lives there, anything you like;
- after them, the station's address in **one** paragraph, on three lines:

```text
Orbital Station 7
Docking Ring B
Low Earth Orbit
```

Check the preview: three lines, one under the other, in a single paragraph.
