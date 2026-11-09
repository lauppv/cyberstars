Have you ever tried to tap a tiny link on a phone and hit the one next to it instead? Fingers are much bigger than mouse pointers. A link that's only as big as its words is a small target. Good sites make them bigger.

## Padding on a link

Padding makes a box bigger without changing its text, and a click anywhere on the padding counts as a click on the link:

```css
.links a {
  padding: 8px 12px;
}
```

But a link is **inline**, and inline boxes don't really take their padding up and down: the padding shows, but overlaps the lines above and below, and doesn't push anything away. The fix is the box you just met:

```css
.links a {
  display: inline-block;
  padding: 8px 12px;
}
```

Now each link is a proper tile, 8 pixels of room above and below its words and 12 on the sides, and all of it can be clicked or tapped.

## How big?

A good rule: anything people tap should be at least about **44 pixels** tall on a phone, the size of a fingertip. For a menu on a computer, a bit smaller is fine, but more room is always easier.

## Break it on purpose

Give the links padding but leave them inline. Hover over a link's padding with Inspect: the box is there, but on a page with several lines of links, the padding of one line covers the links of the next. A link that should be a real target is `inline-block`.

---

## Mission: Easy to tap

The links in your menu are only as big as their words.

**Example**: every menu link is a bigger target, with room around its words, and the room is part of the link.

- Every link in the menu is at least 32 pixels tall.
- Every link in the menu has at least 8 pixels of room on its left and right.
- The menu itself grows to hold them: it's at least 32 pixels tall too.

Psst, inline boxes don't really take their padding up and down :)
