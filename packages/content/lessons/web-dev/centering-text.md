You now know two ways to put things in the middle: `text-align: center` and `margin: 0 auto`. They sound like the same thing. They're not, and mixing them up is one of the most common puzzles in CSS.

Think of a shelf. `margin: 0 auto` moves the **shelf** to the middle of the wall. `text-align: center` moves the **books** to the middle of the shelf.

## `text-align` centers what's inside

`text-align: center` goes on a box, and centers the **lines of text and inline elements inside it**. The box itself doesn't move:

```css
.links {
  text-align: center;
}
```

```html
<p class="links"><a href="a.html">One</a> <a href="b.html">Two</a></p>
```

The paragraph still takes the full width. The links, which are inline, move to the middle of it.

## `margin: 0 auto` centers the box

`margin: 0 auto` goes on a box with a width, and moves **the box itself** to the middle of its space. What's inside stays as it was: text in a centered box still starts on the box's left.

## Which one?

- Words or links to the middle: `text-align: center` on the box **around** them.
- A box with a width to the middle: `margin: 0 auto` on the box **itself**.

## Break it on purpose

Try to center a menu's links by putting `margin: 0 auto` on the links:

```css
.links a {
  margin: 0 auto;
}
```

Nothing moves. A link is inline: it has no width of its own to center, and inline elements ignore `auto` margins. Put `text-align: center` on the box around them instead.

---

## Mission: The menu in the middle

On every page, the menu's links sit on the left.

**Example**: on every page, Home and Crew sit together in the middle of the menu's line.

- On every page, the menu's links are centered across the page, as a group.

Psst, center the links from the box around them :)
