Think of a newspaper page again: the paper's name at the top, the page number at the bottom, and between them, the news you came to read. The top and the bottom are the same on every page. The news is what this page is **for**.

## `<main>`

`<main>` holds the page's own part: everything between the header and the footer that belongs to this page only.

```html preview
<header>
  <p>Chess Club</p>
  <nav>
    <a href="index.html">Home</a>
    <a href="games.html">Games</a>
  </nav>
</header>
<main>
  <h1>Welcome</h1>
  <p>We meet every Friday after school.</p>
  <p>New players are always welcome.</p>
</main>
<footer>
  <p>Chess Club · Room 12 · North School</p>
</footer>
```

The page looks the same as without `<main>`. But now the browser knows where the page's own part starts and where it ends. The next lesson shows who uses that.

The page's biggest heading belongs to the page, so it goes inside `<main>` too.

## One per page

A page has one `<main>`, and only one. It sits beside the header and the footer, never inside them, and they never go inside it:

```html
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</body>
```

Three parts, one after the other: the top, the page's own part, the bottom.

## Break it on purpose

Move the `<header>` inside `<main>`:

```html preview
<main>
  <header>
    <p>Chess Club</p>
    <nav>
      <a href="index.html">Home</a>
      <a href="games.html">Games</a>
    </nav>
  </header>
  <h1>Welcome</h1>
  <p>We meet every Friday after school.</p>
</main>
```

It still looks the same, so nothing warns you. But now the club's name and the menu count as this page's own content. A tool that jumps straight to the page's own part lands on the menu again, on every page. Keep the three parts side by side.

---

## Mission: The page's own part

Every page of your site now has a header and a footer. Between them is what that page is about: the crew cards, the flights, the booking form.

**Example**: open the crew directory and right-click its heading, then **Inspect**. You find the header, then one `<main>` with the heading, the buttons, the lists and the cards in it, then the footer.

- On every page, everything between the header and the footer is in one `<main>`, the biggest heading too.
- The header and the footer stay outside it: the header before it, the footer after it.

Psst, one `<main>` for the whole page, not one for each part :)
