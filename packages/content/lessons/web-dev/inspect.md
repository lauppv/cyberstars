Mechanics don't guess what's wrong with a car: they open the bonnet and look. Browsers have a bonnet too. It's called **Inspect**, and it shows every box of a page, with its padding, border and margin.

## Opening it

In Chrome, Edge or Firefox, right-click any part of a page and pick **Inspect**. A panel opens with two halves:

- on one side, the page's HTML. Hover over a line, and the browser lights up that element's box on the page;
- on the other, the **Styles** of the element you picked: every CSS rule that touches it, yours and the browser's.

It works in your preview too: right-click inside it.

## The box diagram

Under the styles, or in a tab called **Computed** or **Layout**, there's a picture of the element's box, as rectangles inside rectangles:

```text
margin
  border
    padding
      content  (width × height)
```

Each layer shows its numbers on each side. When you hover over the page, the browser colors the layers the same way: the content blue, the padding green, the margin orange.

## Finding a mystery gap

This is where Inspect shines. Say there's space above a heading and you never wrote any. Inspect the heading: the orange margin above it is there, and the styles say where it comes from. Often it's the **browser's own styles**: headings and paragraphs come with margins nobody wrote.

Once you know, you can change it in your own CSS:

```css
h2 {
  margin-top: 0;
}
```

You can even try values right there in the Styles panel. They change the page at once, but only until you reload, so copy the one that works into your file.

## Break it on purpose

Change a value in Inspect's Styles panel, then reload the page. Gone! Inspect is for trying and finding out. The real change always goes in your files.

---

## Mission: The gap under the menu

On every page of your site there's a gap between the menu and the page's biggest heading. You never wrote it.

**Example**: use Inspect on the biggest heading and look at the orange layer above it. Then take that space away: the heading sits right under the menu.

- The biggest heading has no margin at its top.

Psst, a margin of nothing is written `0`, with no unit needed :)
