At the airport, every bag with a "fragile" sticker goes on a special trolley. The handlers don't care whose bag it is: only that it has the sticker. CSS can pick elements the same way: by an **attribute** they have.

## `[attribute]`

Square brackets pick elements by their attributes:

```css preview
<style>
  a {
    text-decoration: none;
  }

  /* show */
  a[target] {
    font-style: italic;
  }
  /* /show */
</style>
<p><a href="https://en.wikipedia.org/wiki/Chess" target="_blank">Rules of chess</a></p>
<p><a href="games.html">Our games</a></p>
```

"Every `a` that **has** a `target` attribute", whatever its value.

## `[attribute="value"]`

With a value, only elements whose attribute is exactly that:

```css preview
<style>
  a {
    text-decoration: none;
  }

  /* show */
  a[target="_blank"] {
    text-decoration: underline;
  }
  /* /show */
</style>
<p><a href="https://en.wikipedia.org/wiki/Chess" target="_blank">Rules of chess</a></p>
<p><a href="games.html">Our games</a></p>
```

Links that open a new tab are underlined, so visitors know before they click.

A few more ways to match:

- `a[href^="https"]`: `href` **starts with** `https`: links to other sites;
- `a[href$=".pdf"]`: `href` **ends with** `.pdf`;
- `img[alt=""]`: pictures with an empty `alt`, the decorative ones.

## Break it on purpose

Forget the quotes and the exact value:

```css preview
<style>
  a {
    text-decoration: none;
  }

  /* show */
  a[target="blank"] {
    text-decoration: underline;
  }
  /* /show */
</style>
<p><a href="https://en.wikipedia.org/wiki/Chess" target="_blank">Rules of chess</a></p>
<p><a href="games.html">Our games</a></p>
```

Nothing is underlined: your links say `_blank`, with the underscore. An attribute selector matches the value exactly, letter for letter.

---

## Mission: Links that leave

On the home page, the link about space stations opens another site in a new tab. Visitors should know before they click.

**Example**: the link to the other site is underlined. The other links of the page stay without a line.

- Every link that opens a new tab is underlined.
- The other links have no underline.

Psst, the links that open a new tab are the ones with `target="_blank"` :)
