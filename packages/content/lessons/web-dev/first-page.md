Every website you have ever opened is made of **web pages**, and a web page is just a **text file**. Your browser reads that file and turns it into what you see: headings, paragraphs, pictures, buttons.

The language of that file is **HTML**. It doesn't compute anything like Python or C. It **describes** what is on the page: "this is a heading", "this is a paragraph".

## Tags

HTML describes things with **tags**. A tag is a word between `<` and `>`:

```html
<h1>Cargo Bay</h1>
```

Here `<h1>` is the **opening tag** and `</h1>` the **closing tag**: the same word, with a `/` in front. Everything between them is what the tag describes. `h1` means "the biggest heading of the page", so the browser draws **Cargo Bay** large and bold.

An opening tag, its closing tag and what sits between them make an **element**. Another one:

```html
<p>Crates are stacked by weight, the heaviest at the bottom.</p>
```

`p` stands for **paragraph**: a block of ordinary text.

## The skeleton of a page

A real page puts its elements inside a fixed frame, the same on every page:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Cargo Bay</title>
  </head>
  <body>
    <h1>Cargo Bay</h1>
    <p>Crates are stacked by weight, the heaviest at the bottom.</p>
  </body>
</html>
```

Line by line:

- `<!DOCTYPE html>` tells the browser "this is a modern HTML page". It isn't a tag and has no closing part.
- `<html lang="en">` holds the whole page. `lang="en"` is an **attribute**: extra information written inside the opening tag, here that the page is in English.
- `<head>` holds information **about** the page, which isn't drawn on it. `<meta charset="UTF-8">` lets the page show any letter, like ă or é, and `<title>` is the name on the browser's tab.
- `<body>` holds everything you **see** on the page.

Notice how elements sit **inside** other elements, like boxes in boxes: `<title>` inside `<head>`, `<head>` inside `<html>`. The spaces at the start of the lines change nothing for the browser. They are there for you, so you can see at a glance what sits inside what.

## Your workspace

On the right you have a small editor of your own:

- the **files** of your site, on the left of the editor. For now there is one, `index.html`, the page a browser opens first;
- the **editor**, where you write the file you picked;
- the **preview**, which shows your page and changes a moment after you stop typing. **Ctrl+Enter** in the editor (**⌘+Enter** on a Mac) draws it again from scratch;
- the **console** under the preview. You'll need it once your page runs JavaScript.

Try it: type `<h1>Hello</h1>` in `index.html` and look at the preview. Change the word and look again. Then break something on purpose, like leaving out the `</h1>`, and see what the browser does. Experimenting is the fastest way to learn.

---

## Mission: Station Log

Your station needs its first page. In `index.html`, write a complete page with the skeleton above:

- the page is in English (`lang="en"`) and can show any letter (`charset="UTF-8"`);
- the name on the browser's tab is **Station Log**;
- the page shows a biggest heading with the text **Welcome aboard**;
- under the heading, a paragraph with a sentence of your own about the station.

Write it yourself rather than copying the example: typing every tag is how you'll remember them.
