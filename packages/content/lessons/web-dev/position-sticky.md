Scroll down a long news website on your phone. The bar with the site's name and its menu moves up with the page at first. Then it reaches the top of the screen, and it stops there. Wherever you are in the article, the menu is always at hand.

## `position: sticky`

A sticky element stays in its own place, like any other element, until the page scrolls it up to the edge of the window. There it sticks. `top: 0` says where it stops: 0 pixels from the top of the window.

```css preview scroll
<style>
  nav {
    background-color: navy;
    padding: 6px;
  }
  nav a {
    color: white;
  }
  /* show */
  nav {
    position: sticky;
    top: 0;
  }
  /* /show */
</style>
<h1>Lyon School News</h1>
<nav><a href="sports.html">Sports</a> · <a href="music.html">Music</a></nav>
<p>The football team won 3 to 1 on Saturday.</p>
<p>The music room has two new pianos.</p>
<p>The library is open until 18:00 this week.</p>
<p>Lunch on Friday: pasta and apples.</p>
<p>The trip to Oslo leaves at 8:00 on Monday.</p>
<p>Bring your sports shoes on Wednesday.</p>
<p>The art show opens next month.</p>
```

Scroll inside the frame. The heading goes up and away. The menu goes up too, until it reaches the top of the window. Then it stays there, and the news scrolls under it.

The menu has a background color. The news goes under it, so without one, you would read the menu and the news on top of each other.

## Sticky or fixed?

A fixed element also stays in the window. But it leaves its own place, and the page closes the gap:

```css preview scroll
<style>
  nav {
    background-color: navy;
    padding: 6px;
  }
  nav a {
    color: white;
  }
  /* show */
  nav {
    position: fixed;
    top: 0;
  }
  /* /show */
</style>
<h1>Lyon School News</h1>
<nav><a href="sports.html">Sports</a> · <a href="music.html">Music</a></nav>
<p>The football team won 3 to 1 on Saturday.</p>
<p>The music room has two new pianos.</p>
<p>The library is open until 18:00 this week.</p>
<p>Lunch on Friday: pasta and apples.</p>
<p>The trip to Oslo leaves at 8:00 on Monday.</p>
<p>Bring your sports shoes on Wednesday.</p>
<p>The art show opens next month.</p>
```

Before any scroll, the menu already covers most of the heading: the page started under it. A sticky element keeps its place, so at the start it hides nothing.

## Break it on purpose

Remove `top: 0`:

```css preview scroll
<style>
  nav {
    background-color: navy;
    padding: 6px;
  }
  nav a {
    color: white;
  }
  /* show */
  nav {
    position: sticky;
  }
  /* /show */
</style>
<h1>Lyon School News</h1>
<nav><a href="sports.html">Sports</a> · <a href="music.html">Music</a></nav>
<p>The football team won 3 to 1 on Saturday.</p>
<p>The music room has two new pianos.</p>
<p>The library is open until 18:00 this week.</p>
<p>Lunch on Friday: pasta and apples.</p>
<p>The trip to Oslo leaves at 8:00 on Monday.</p>
<p>Bring your sports shoes on Wednesday.</p>
<p>The art show opens next month.</p>
```

Scroll: the menu goes away like any other line. The browser doesn't know where to stop it, so it never sticks.

A sticky element also never leaves the box it's in. Put the menu inside a header with the heading, and make only the menu sticky:

```css preview scroll
<style>
  nav {
    background-color: navy;
    padding: 6px;
  }
  nav a {
    color: white;
  }
  /* show */
  nav {
    position: sticky;
    top: 0;
  }
  /* /show */
</style>
<header>
  <h1>Lyon School News</h1>
  <nav><a href="sports.html">Sports</a> · <a href="music.html">Music</a></nav>
</header>
<p>The football team won 3 to 1 on Saturday.</p>
<p>The music room has two new pianos.</p>
<p>The library is open until 18:00 this week.</p>
<p>Lunch on Friday: pasta and apples.</p>
<p>The trip to Oslo leaves at 8:00 on Monday.</p>
<p>Bring your sports shoes on Wednesday.</p>
<p>The art show opens next month.</p>
```

Scroll: the menu goes away with its header. It sticks only inside the header, and the header scrolls away.

---

## Mission: Always at hand

Every page of your site starts with the same header: the station's name and the menu. On a long page, that menu is far away once the reader scrolls down.

**Example**: scroll down any page of the site. The header, with the station's name and the menu, stays at the top of the window until the end of the page, and the text scrolls under it, out of sight.

- On every page, the header stays at the top of the window while the page scrolls, on a computer and on a phone.
- The header has a background color, so the text that scrolls under it doesn't show through.
- Before any scroll, the header covers nothing: the page's biggest heading shows under it.

Psst, `position: sticky` alone never sticks: it needs `top` :)
