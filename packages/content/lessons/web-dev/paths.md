On your computer you keep files in folders: photos in one, homework in another, and folders inside folders. A website is the same. As it grows, its files go into folders so you can find them, like your pictures in `img`.

To reach a file, a link or a picture uses its **path**: the way to it, from the page you're on.

## Into a folder

You've already used one: `img/station.svg` means "go into the folder `img`, and take `station.svg` there". Each `/` is a step into a folder.

```html
<a href="games/chess.html">Chess</a>
```

From `index.html`, this goes into the folder `games` and opens `chess.html`.

## Out of a folder: `../`

Now you're **on** `games/chess.html`, inside the `games` folder. The style sheet is outside it, next to `index.html`. How do you get there?

`../` means "go up one folder, out of the one I'm in":

```html
<link rel="stylesheet" href="../style.css" />
<img src="../img/logo.svg" alt="The club's logo" />
<a href="../index.html">Home</a>
```

From `games/chess.html`:

- `../style.css`: step out of `games`, take `style.css`;
- `../img/logo.svg`: step out of `games`, then into `img`;
- `../index.html`: step out, take the home page.

A path is always worked out **from the page it's written in**. The same file can need different paths from different pages: `style.css` from `index.html`, `../style.css` from `games/chess.html`.

To make a folder, use **New folder** in your file list. To put a page in it, make the file inside the folder.

## Break it on purpose

On `games/chess.html`, link the style sheet as if you were on the home page:

```html
<link rel="stylesheet" href="style.css" />
```

The browser looks for `games/style.css`, which doesn't exist. The page shows up plain, black on white, with no error. When a page in a folder loses its style or its pictures, check its paths: they probably need a `../`.

---

## Mission: The commander's page

The station's commander gets a page of her own, in a new folder for crew pages.

**Example**: from the crew directory, a link opens the commander's page. It has her name as its heading, the station picture, the same night blue as the other pages, and a link back to the crew directory.

- In a folder named `people`, a page `vega.html`: a whole page with a name for its tab and her name as its biggest heading.
- It uses the site's `style.css`, and shows the picture `img/station.svg`.
- `crew.html` links to it, and it links back to `crew.html`.

Psst, from inside `people`, everything else is one folder up :)
