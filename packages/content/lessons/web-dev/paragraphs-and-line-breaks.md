**About the Station** is still empty. You already know `<p>`. This lesson is about what the browser does with the spaces and the new lines you type.

## The browser ignores your Enter

Type this in a page:

```html
<p>The cargo bay
   holds      forty
crates.</p>
```

The browser shows **The cargo bay holds forty crates.** on one line, with one space between the words. In HTML, many spaces, tabs and new lines in a row count as **one space**. That's why you can indent your code however you like: the browser doesn't care.

So pressing Enter twice in the editor doesn't make a gap on the page. A new block of text is a new **paragraph**, and the browser puts some room between paragraphs by itself:

```html
<p>The cargo bay holds forty crates.</p>
<p>Two more bays are being built on the lower ring.</p>
```

## Line breaks

Sometimes a few lines belong together, but each one needs its own line. Think of a poem, or the label on a crate. For that there is `<br>`, a **line break** inside a paragraph:

```html
<p>
  FRAGILE<br />
  Glass tubes for the lab<br />
  This side up
</p>
```

`<br>` holds nothing, so it has no closing tag. It's an **empty element**, like `<meta>`. You'll see it written as `<br>` or `<br />`. Both mean the same.

Don't use `<br>` to make space between blocks of text. Two `<br>` in a row to make a gap is the same mistake as pressing Enter twice: it's two paragraphs pretending to be one. A screen reader reads a page paragraph by paragraph, so a fake paragraph sounds like a mess. Space between things has its own tool, CSS, which comes soon.

---

## Mission: Station Address

Under **About the Station**:

- write two paragraphs of your own about the station: what it does, who lives there, anything you like;
- after them, write the station's address, so a visitor can copy it onto an envelope. The address is **Orbital Station 7, Docking Ring B, Low Earth Orbit**, and on an envelope each part goes on its own line, without the commas.

The address is one thing, so it stays one paragraph. Check the preview: it should look like the address on a letter.
