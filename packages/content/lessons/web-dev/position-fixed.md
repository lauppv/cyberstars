On many shop websites, a small Help button waits in the bottom right corner of the screen. Scroll down the long list of shoes, and it's still there, in the same corner. The page moves, but the button doesn't.

## `position: fixed`

`position: fixed` takes an element out of its place, like `position: absolute`. But it measures from the **window**, the part of the page you can see, and not from a box. When the page scrolls, it stays where it is in the window.

```css preview scroll
<style>
  .help {
    background-color: seagreen;
    color: white;
    padding: 4px 10px;
    border-radius: 8px;
  }
  /* show */
  .help {
    position: fixed;
    bottom: 8px;
    right: 8px;
  }
  /* /show */
</style>
<h1>Shoes</h1>
<p>Red running shoes: 60 euros</p>
<p>Blue boots: 85 euros</p>
<p>White sneakers: 45 euros</p>
<p>Black school shoes: 50 euros</p>
<p>Green rain boots: 30 euros</p>
<p>Brown sandals: 25 euros</p>
<p>Grey walking shoes: 70 euros</p>
<p>Pink ballet shoes: 35 euros</p>
<a class="help" href="help.html">Help</a>
```

Scroll the page inside the frame. The shoes go up and away, but Help stays in the bottom right corner, 8 pixels from the bottom and 8 pixels from the right of the window.

## Back to the top

A long page needs a quick way back up. A link to `#top` takes the reader to the very top of the page. No element needs the id `top`: the browser knows this one by itself.

```css preview scroll
<style>
  .help {
    background-color: seagreen;
    color: white;
    padding: 4px 10px;
    border-radius: 8px;
  }
  /* show */
  .help {
    position: fixed;
    bottom: 8px;
    right: 8px;
  }
  /* /show */
</style>
<h1>Shoes</h1>
<p>Red running shoes: 60 euros</p>
<p>Blue boots: 85 euros</p>
<p>White sneakers: 45 euros</p>
<p>Black school shoes: 50 euros</p>
<p>Green rain boots: 30 euros</p>
<p>Brown sandals: 25 euros</p>
<p>Grey walking shoes: 70 euros</p>
<p>Pink ballet shoes: 35 euros</p>
<a class="help" href="#top">Back to top</a>
```

Scroll down, then press **Back to top**: the page jumps back to the heading Shoes.

## Break it on purpose

Remove `bottom` and `right`:

```css preview scroll
<style>
  .help {
    background-color: seagreen;
    color: white;
    padding: 4px 10px;
    border-radius: 8px;
  }
  /* show */
  .help {
    position: fixed;
  }
  /* /show */
</style>
<h1>Shoes</h1>
<p>Red running shoes: 60 euros</p>
<p>Blue boots: 85 euros</p>
<p>White sneakers: 45 euros</p>
<p>Black school shoes: 50 euros</p>
<p>Green rain boots: 30 euros</p>
<p>Brown sandals: 25 euros</p>
<p>Grey walking shoes: 70 euros</p>
<p>Pink ballet shoes: 35 euros</p>
<a class="help" href="help.html">Help</a>
```

Scroll all the way down: Help isn't there anymore. Without `bottom` and `right`, a fixed element stays where its own place was when the page opened. Here, that place was under the bottom of the window, so the link never shows.

---

## Mission: Back to top

Your wiki has four pages, `wiki.html` and the three topic pages, and they get longer every week. On a phone, a reader at the end of a page has a long way back up to the menu.

**Example**: in the bottom right corner of the window, a link says **Back to top**. Scroll down: it's still there, in the same corner. Press it: the page is back at its top.

- Every page of the wiki (`wiki.html` and the three topic pages) has a link with the class `to-top` that says `Back to top`.
- It waits in the bottom right corner of the window, at most 40 pixels from the bottom and from the right, and stays there while the page scrolls. On a phone too.
- A press on it takes the reader back to the top of the page.

Psst, a fixed element needs `bottom` and `right` too, or it stays where its place was :)
