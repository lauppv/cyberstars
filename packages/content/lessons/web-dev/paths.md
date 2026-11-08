The station's home page is done. Part 2 adds a second page, the **Crew Directory**. The first thing two pages need is a way to get from one to the other.

## Paths

A link's `href` and a picture's `src` say where a file is. You've written two kinds:

- a **full address**, like `https://en.wikipedia.org/wiki/Space_station`: another site, written out in full;
- a **relative path**, like `img/station.svg`: a file of your own site, found **starting from the page that names it**.

Read a relative path like directions from where you are standing:

```text
index.html            ← you are here
crew.html             → "crew.html"
img/station.svg       → "img/station.svg"
bays/cargo.html       → "bays/cargo.html"
```

From `bays/cargo.html`, the way back to the home page first goes up one folder: `../index.html`. `..` means "the folder above".

A path that starts with `/`, like `/crew.html`, starts from the site's **root**, the top folder, wherever the page is. That works once a site is on a web server, but not when you open the files straight from your computer. Relative paths are the safer habit.

Keep file names simple: small letters, digits and `-`, and no spaces. On most servers, `Crew Directory.html` and `crew directory.html` are two different files, and a space turns into `%20` in the address.

## A way around: nav

Most sites start every page with the same few links: the **navigation**. HTML has an element for it:

```html
<nav>
  <a href="index.html">Home</a>
  <a href="bays.html">Bays</a>
</nav>
```

`<nav>` changes nothing on the screen. But it tells a screen reader "these are the site's main links", so a visitor can jump straight to them, or skip past them.

## The second page

This lesson added an empty `crew.html`. It's a page like `index.html`, with its own frame and its own `<title>`, and it uses the same `style.css`: one style sheet, two pages, one look.

---

## Mission: Second Deck

The station gets a second page, the crew directory.

- Write `crew.html` as a complete page, like your home page: English, able to show any letter, **Crew Directory** on its tab and as its title, with a paragraph of your own under the title. It looks like the home page, from the same style sheet.
- A visitor on either page should reach the other in one click. At the very top of **both** pages, add the site's navigation, with a link **Home** to the home page and a link **Crew** to the crew page.
