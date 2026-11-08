Every website you have ever opened is made of **web pages**, and a web page is just a **text file**. Your browser reads that file and turns it into what you see: headings, text, pictures, buttons.

The file is written in a language called **HTML**. HTML doesn't do math like Python or C. It only **describes** what is on the page: "this is a heading", "this is a paragraph".

## Tags

HTML describes things with **tags**. A tag is a word between `<` and `>`:

```html
<h1>Cargo Bay</h1>
```

`<h1>` is the **opening tag**. `</h1>` is the **closing tag**: the same word, with a `/` in front. The text between them is what the tag is about. `h1` means "the biggest heading of the page", so the browser shows **Cargo Bay** big and bold.

An opening tag, its closing tag and everything between them make an **element**. Here is another one:

```html
<p>Crates are stacked by weight, the heaviest at the bottom.</p>
```

`p` is short for **paragraph**: a block of normal text.

## The frame of a page

Every real page puts its elements inside the same frame:

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Soute</title>
  </head>
  <body>
    <h1>Soute</h1>
    <p>Les caisses lourdes vont en bas.</p>
  </body>
</html>
```

This page is in French. Line by line:

- `<!DOCTYPE html>` tells the browser "this is a modern HTML page". It isn't a tag and it never closes.
- `<html>` holds the whole page. `lang="fr"` is an **attribute**: extra information written inside an opening tag. This one says the page is in French. English is `en`, Romanian is `ro`.
- `<head>` holds information **about** the page. Nothing in it is shown on the page itself. `<meta charset="UTF-8">` lets the page show any letter, like ă, é or ß. `<title>` is the name you see on the browser's tab.
- `<body>` holds everything you **see** on the page.

Elements sit **inside** other elements, like boxes inside boxes: `<title>` is inside `<head>`, and `<head>` is inside `<html>`. The spaces at the start of the lines don't matter to the browser. They are there for you, so you can see at a glance what is inside what.

## Your workspace

On the right you have a small editor of your own:

- the **files** of your site, on the left of the editor. For now there is one, `index.html`, the page a browser opens first;
- the **editor**, where you write the file you picked;
- the **preview**, which shows your page and updates a moment after you stop typing. If it ever doesn't, press **Run** above it, or **Ctrl+Enter** in the editor (**⌘+Enter** on a Mac);
- the **console** under the preview. You'll need it once your page runs JavaScript.

Try it: type `<h1>Hello</h1>` in `index.html` and look at the preview. Change the word and look again. Then break something on purpose, like deleting the `</h1>`, and see what the browser does. Trying things out is the fastest way to learn.

---

## Mission: Station Log

Your space station needs its first page. Write `index.html` yourself, from the first line to the last:

- the page is in English, and it can show any letter;
- the browser's tab says **Station Log**;
- the page starts with its biggest heading: **Welcome aboard**;
- under the heading, a paragraph with a sentence of your own about the station.

Don't copy the example: type every tag. That's how you'll remember them.
