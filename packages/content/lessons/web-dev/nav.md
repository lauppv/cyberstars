Walk into any shop or open any app: the way around is always in the same place. A menu bar at the top, the same on every screen, so you never get lost. Websites do the same, with a **menu** at the top of every page.

## `<nav>`

A menu is a few links in a `<nav>` element, short for **navigation**:

```html
<nav>
  <a href="index.html">Home</a>
  <a href="games.html">Games</a>
  <a href="members.html">Members</a>
</nav>
```

```text
Home Games Members        (three links side by side)
```

`<nav>` doesn't look like anything special: the links are inline, so they sit side by side. But it **means** "this is the way around the site". A screen reader can jump straight to it, and skip it to reach the page's content.

The menu goes at the very top of the `<body>`, before the page's heading, so it's the first thing visitors find.

## The same menu on every page

Copy the same menu to every page, so it's always in the same place. Only the paths change, depending on where each page is:

```html
<!-- on games/chess.html -->
<nav>
  <a href="../index.html">Home</a>
  <a href="../games.html">Games</a>
  <a href="../members.html">Members</a>
</nav>
```

From inside the `games` folder, every link needs a `../` first.

A page may link to itself in the menu: on the home page, Home leads to the home page. That's normal, and it keeps the menu the same everywhere.

## Break it on purpose

Put the menu at the end of the page instead of the top. It still works, but someone who wants another page has to scroll past everything first. And copy the home page's menu onto `games/chess.html` without the `../`: every link there leads nowhere. Try it, then fix it.

---

## Mission: A menu on every page

Your site has three pages now: the home page, the crew directory and the commander's page. Moving between them should be the same everywhere.

**Example**: at the top of every page, before its heading:

```text
Home Crew
```

- Each of the three pages starts with a `<nav>`, right at the top of its `<body>`.
- Each menu has a link to the home page and a link to the crew directory, and both work from that page.

Psst, the commander's page is in a folder, so its menu's links need `../` :)
