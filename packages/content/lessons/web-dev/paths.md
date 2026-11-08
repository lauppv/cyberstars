The station's home page is done. Part 2 adds a second page, the **Crew Directory**, and the first thing two pages need is a way from one to the other.

## Paths

A link's `href` and an image's `src` say where a file is. You've written two kinds:

- a **full address**, `https://en.wikipedia.org/wiki/Space_station`: another site, named in full;
- a **relative path**, `img/station.svg`: a file of your own site, found **from the page that names it**.

A relative path is read like directions from where you stand:

```text
index.html            ← you are here
crew.html             → "crew.html"
img/station.svg       → "img/station.svg"
bays/cargo.html       → "bays/cargo.html"
```

From `bays/cargo.html`, the way back to the home page climbs one folder up first: `../index.html`. `..` means "the folder above".

A path starting with `/`, like `/crew.html`, starts from the site's **root**, the top folder, wherever the page is. It works once a site is on a web server, but not when you open the files straight from your disk, so relative paths are the safer habit.

Keep file names simple: lowercase letters, digits and `-`, no spaces. `Crew Directory.html` is a different file from `crew directory.html` on most servers, and the space turns into `%20` in the address.

## A way around: nav

Every page of a site usually starts with the same set of links, its **navigation**. HTML has an element for it:

```html
<nav>
  <a href="index.html">Home</a>
  <a href="bays.html">Bays</a>
</nav>
```

`<nav>` changes nothing on screen, but tells a screen reader "these are the site's main links", so a visitor can jump straight to them, or past them.

## The second page

This lesson brought an empty `crew.html`. It's a page like `index.html`, with its own skeleton, its own `<title>`, and the same `style.css`: one style sheet, two pages, one look.

---

## Mission: Second Deck

- Write `crew.html` as a complete page, in English, able to show any letter, with **Crew Directory** on its tab, linked to the same `style.css`. Its biggest heading is **Crew Directory**, with a paragraph of your own under it.
- At the very top of the body of **both** pages, add a navigation with two links: **Home**, to `index.html`, and **Crew**, to `crew.html`.
