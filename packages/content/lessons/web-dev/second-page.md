A website is rarely one page. A school's site has a page for news, one for the timetable, one for clubs. Each page is a file of its own, and links take you from one to the next.

Your station has a home page. Now it gets a second one: the crew directory.

## A second file

A new page is a new `.html` file, next to `index.html`. Make it with **New file** in the file list, and give it a name that says what it holds, in small letters with no spaces: `crew.html`, `club-rules.html`.

The new page is a whole page of its own, with everything a page needs: the doctype, `<html lang="en">`, the `<head>` with its `<meta charset>` and `<title>`, and the `<body>`. Nothing carries over from `index.html` by itself.

To make it look like the rest of the site, link the same style sheet in its `<head>`:

```html
<link rel="stylesheet" href="style.css" />
```

One `style.css`, two pages: they share every rule, the night blue, the fonts, the colors. Change a color once, and both pages change.

## A link to it

A link to a page of your own site needs only the file's name:

```html
<p><a href="games.html">See all our games</a></p>
```

No `https://`, no site name: `games.html` means "the file `games.html` next to this page". In your preview, a click opens it, and the name over the preview changes to show which page you're on.

And the new page needs a way back:

```html
<p><a href="index.html">Back to the home page</a></p>
```

## Break it on purpose

Link to `Games.html` with a capital G, while the file is `games.html`. Click it: the console says the page isn't there. On many web servers, names are matched exactly, capital letters included. Keep file names in small letters, and copy them exactly into your links.

---

## Mission: The crew directory

Your site has one page. Give it a second one: `crew.html`, the crew directory.

**Example**: on the home page, a link like "Meet the crew" opens a new page with the heading Crew Directory, on the same night blue as the home page, and a link on it goes back home.

- `crew.html` is a whole page: it starts with `<!DOCTYPE html>`, is in English, can show any letter and has a name for its tab.
- It uses the same `style.css` as the home page, and its biggest heading says what the page is.
- A link on the home page opens `crew.html`, and a link on `crew.html` goes back to the home page.

Psst, a link to your own page is just the file's name: no `https://` :)
