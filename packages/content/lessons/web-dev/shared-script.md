A school has one bell for all its classrooms. When the time of the break changes, someone changes the bell once, and every room hears the new time. Your pages already share one style sheet in the same way: `style.css`, written once, used by every page. A script can be shared too.

## One script, many pages

A game club's site has three pages: `index.html`, `games.html` and `rules.html`. Every page loads the same script, `club.js`, with the same tag:

```html
<script src="club.js" defer></script>
```

A page in a folder, like `members/ida.html`, finds the script one folder up:

```html
<script src="../club.js" defer></script>
```

The script writes the club's news in the `#news` paragraph:

```html preview
<h1>Game Club</h1>
<p id="news"></p>
<script>
  const news = document.querySelector("#news");
  news.textContent = "Next game night: Friday at 6";
</script>
```

The page says `Next game night: Friday at 6`. Every page that loads `club.js` and has a `#news` paragraph says it too. When the date changes, you change one line in one file, and every page follows.

## A page without the element

`rules.html` loads `club.js` like the others, but it has no `#news` paragraph. There, `querySelector` finds nothing and gives back `null`. Open `rules.html`, and the console says:

```text
TypeError: Cannot set properties of null (setting 'textContent')
```

`null` has no `textContent`. The script stops at that line, so any line after it never runs on that page. A script that every page loads meets every page, the ones without its element too.

## Check first

Check that the element is there before you use it:

```html preview
<h1>Game Club</h1>
<p id="news"></p>
<script>
  const news = document.querySelector("#news");
  if (news) {
    news.textContent = "Next game night: Friday at 6";
  }
</script>
```

The page says `Next game night: Friday at 6`, as before. Now delete the `<p id="news"></p>` line in the code above: the news is gone, and no error comes. `null` counts as false, so on a page without `#news` the `if` skips its block. An element counts as true, so on the other pages the news is written.

## Break it on purpose

In `members/ida.html`, forget the `../`:

```html
<script src="club.js" defer></script>
```

The browser looks for `members/club.js`, finds no such file, and runs nothing. The page shows no news, and nothing tells you why. Check the path on every page in a folder.

Now a second mistake. `games.html` has a script of its own, `games.js`, which starts with:

```js
const news = document.querySelector("#games-news");
```

`club.js` makes a `news` too. The scripts of one page share their names, so the second `const news` breaks the script that comes last:

```text
SyntaxError: Identifier 'news' has already been declared
```

Give the shared script's names a word of their own, like `clubNews`, that no other script uses.

---

## Mission: A menu button

On a phone, the five links of the menu fill much of the screen. A button can hide them and show them again. Every page needs that button, so its job goes in one script, and every page loads it.

Your site has a new empty file, `menu.js`.

**Example**: open any page. In the header, before the menu, a button says `Menu`. Click it: the menu's links are gone. Click it again: they are back.

- Every page of the site loads `menu.js`, `people/vega.html` too.
- The header of every page has a button with the id `menu-button`, saying `Menu`, before the menu.
- On every page, a click on the button hides the menu, the `nav` in the header, and a second click shows it again. The page's own script still works.
- A page that loads `menu.js` but has no `#menu-button` (a draft page that a writer adds to the wiki) shows no error.

Psst, `people/vega.html` is in a folder, so its path to `menu.js` starts with `../` :)
