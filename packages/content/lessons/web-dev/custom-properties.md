Your class writes a play, and the hero's name is in it fifty times: "Sam". The day before the show, the teacher says the hero is now called "Alex". You go through all fifty lines, and you miss two. If the script had said once, at the top, "the hero: Sam", and then "the hero" everywhere, you'd change one line. CSS can name a value once too.

## The same color, many times

Our `style.css` writes the page's dark blue in many rules: the page, the header, the text on yellow buttons. To change it, you'd hunt down every one of them.

## `--name`: a custom property

A **custom property** is a property you make up yourself. Its name starts with two dashes, `--`, and it holds any value:

```css
html {
  --brand: #e63946;
}
```

On its own, it changes nothing on the page. It's a value with a name, waiting to be used.

## `var()`: use it

`var()` puts a custom property's value where you write it:

```css preview
<style>
  /* show */
  html {
    --brand: #e63946;
  }

  h1 {
    color: var(--brand);
  }

  button {
    background-color: var(--brand);
    color: white;
    border: none;
    padding: 8px 16px;
  }
  /* /show */
</style>
<h1>Pet Shop</h1>
<button type="button">Buy now</button>
```

The heading and the button are both red. Now change `#e63946` to `#2a9d8f`: both turn green at once. One value, written once, used twice.

## Why on `html`

A custom property is **inherited**, like `color`: the element that has it passes it to everything inside it. `html` holds the whole page, so a property set there can be used by every rule of the page. On many websites you'll see `:root` instead of `html`: for a web page, it's the same element.

## Break it on purpose

Forget the dashes in `var()`: `color: var(brand);`. The browser doesn't know a property called `brand`, so it throws the whole line away, and the heading takes the color it would have without it. Then write `var(--Brand)`, with a capital B: custom properties care about capital letters, so `--Brand` isn't `--brand`, and nothing changes either.

---

## Mission: The site's colors, named once

The station wants to try other colors on the website one day. Today, the dark blue, the yellow and the others are written in dozens of places.

**Example**: the site looks exactly as it does now. But at the top of `style.css`, the six main colors are written once, each with a name, and every rule that uses one of them uses its name.

- On the page's root, `html`, six custom properties hold the site's colors: `--page-bg` the page's background (`#0b1d3a`), `--text` the text (`#f0f4ff`), `--card-bg` the cards' background (`#13294f`), `--accent` the yellow (`#ffd166`), `--heading` the headings' blue (`#8ecbff`), and `--link` the links' green (`#5fd3c6`).
- Every rule of `style.css` that uses one of these colors uses its custom property instead: the page and its header, the text and the paragraphs, the biggest headings and the cards' numbers, the headings, the links, and every card: the crew's, the wiki's, the dashboard's and the week's days.
- The site looks as before.

Psst, go through `style.css` from top to bottom, and look for each of the six colors :)
