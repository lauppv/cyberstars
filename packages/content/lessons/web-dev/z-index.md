Put a few sheets of paper on a desk, one after the other. The last one you put down lies on top. If you want the first sheet on top, you have to pick it up and put it on top again.

## Who is on top?

The browser draws a page in the same way. An element with a `position` (`relative`, `absolute`, `fixed` or `sticky`) is drawn over the elements without one. And between two elements with a position, the one later in the HTML is drawn on top.

Here the menu is sticky, and each game is a box with `position: relative`, so its result can sit in its corner:

```css preview scroll
<style>
  nav {
    position: sticky;
    top: 0;
    background-color: navy;
    padding: 6px;
  }
  nav a {
    color: white;
  }
  .match {
    position: relative;
    background-color: lightyellow;
    padding: 8px;
    margin: 8px 0;
  }
  .result {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: seagreen;
    color: white;
    padding: 2px 6px;
  }
</style>
<h1>Porto Juniors</h1>
<nav><a href="team.html">Team</a> · <a href="games.html">Games</a></nav>
<p class="match">Porto 3, Lyon 1 <span class="result">Won</span></p>
<p class="match">Porto 2, Oslo 2 <span class="result">Draw</span></p>
<p class="match">Porto 4, Lima 0 <span class="result">Won</span></p>
<p class="match">Porto 1, Rome 0 <span class="result">Won</span></p>
<p class="match">Porto 2, Kyiv 1 <span class="result">Won</span></p>
<p class="match">Porto 0, Nice 1 <span class="result">Lost</span></p>
```

Scroll inside the frame: the games slide over the menu! They have a position too, and they come later in the HTML than the menu.

## `z-index`

`z-index` gives an element with a position a number: the bigger number is drawn on top. An element with a position and no `z-index` counts as 0.

```css preview scroll
<style>
  nav {
    position: sticky;
    top: 0;
    background-color: navy;
    padding: 6px;
  }
  nav a {
    color: white;
  }
  .match {
    position: relative;
    background-color: lightyellow;
    padding: 8px;
    margin: 8px 0;
  }
  .result {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: seagreen;
    color: white;
    padding: 2px 6px;
  }
  /* show */
  nav {
    z-index: 1;
  }
  /* /show */
</style>
<h1>Porto Juniors</h1>
<nav><a href="team.html">Team</a> · <a href="games.html">Games</a></nav>
<p class="match">Porto 3, Lyon 1 <span class="result">Won</span></p>
<p class="match">Porto 2, Oslo 2 <span class="result">Draw</span></p>
<p class="match">Porto 4, Lima 0 <span class="result">Won</span></p>
<p class="match">Porto 1, Rome 0 <span class="result">Won</span></p>
<p class="match">Porto 2, Kyiv 1 <span class="result">Won</span></p>
<p class="match">Porto 0, Nice 1 <span class="result">Lost</span></p>
```

Scroll again: now the games go under the menu. The menu is at 1, the games at 0, so the menu is on top.

`z-index` needs an element with a position. On a plain paragraph or heading without one, it does nothing.

## Break it on purpose

Give the games the same number as the menu:

```css preview scroll
<style>
  nav {
    position: sticky;
    top: 0;
    background-color: navy;
    padding: 6px;
  }
  nav a {
    color: white;
  }
  .match {
    position: relative;
    background-color: lightyellow;
    padding: 8px;
    margin: 8px 0;
  }
  .result {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: seagreen;
    color: white;
    padding: 2px 6px;
  }
  /* show */
  nav {
    z-index: 1;
  }
  .match {
    z-index: 1;
  }
  /* /show */
</style>
<h1>Porto Juniors</h1>
<nav><a href="team.html">Team</a> · <a href="games.html">Games</a></nav>
<p class="match">Porto 3, Lyon 1 <span class="result">Won</span></p>
<p class="match">Porto 2, Oslo 2 <span class="result">Draw</span></p>
<p class="match">Porto 4, Lima 0 <span class="result">Won</span></p>
<p class="match">Porto 1, Rome 0 <span class="result">Won</span></p>
<p class="match">Porto 2, Kyiv 1 <span class="result">Won</span></p>
<p class="match">Porto 0, Nice 1 <span class="result">Lost</span></p>
```

The games cover the menu again. With the same number, it's a tie, and a tie goes to the element later in the HTML.

---

## Mission: Nothing covers the header

Open your wiki's front page in a narrow preview, or on a phone, and scroll. The entries slide over the header! Since their badges sit in their corners, the entries have a position, and they come later in the HTML than the header.

**Example**: scroll any page of the site. The header and the Back to top link stay over everything that scrolls under them, and every link in them can still be pressed.

- On every page, nothing that scrolls under the header covers it.
- Nothing covers the Back to top link either, wherever it is in the HTML: the tests also try your `style.css` on a long wiki page where the link comes right after the header.

Psst, with the same number, the element later in the HTML wins :)
