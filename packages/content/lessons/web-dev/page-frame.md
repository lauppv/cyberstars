Think of a letter you send by post. On the envelope there's information **about** the letter: who it's for, the stamp. Inside is the letter itself, the part the person actually reads.

A web page works the same way. Every real page sits inside a **frame** with two parts: one with information about the page, and one with everything you see.

## The frame

```html preview
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <h1>My Favourite Games</h1>
    <p>I play chess with my grandpa every Sunday.</p>
  </body>
</html>
```

Line by line:

- `<!DOCTYPE html>` goes on the very first line. It tells the browser "this is a modern web page". It isn't a tag like the others, and it never closes.
- `<html>` holds the whole page, from the start to `</html>` at the end.
- `<head>` is the envelope: information **about** the page. Nothing in it shows on the page. It's empty for now. In the next lessons we'll put things in it.
- `<body>` is the letter: everything you **see**. Your heading and your paragraphs go here.

The page still shows the same thing.

So why bother? Because the browser now knows exactly what kind of page this is, and where each part belongs.

## Elements inside elements

Look again: `<h1>` is **inside** `<body>`, and `<body>` is **inside** `<html>`. Elements sit inside other elements, like boxes inside boxes.

A box inside another one must close before the outer one does. This is right:

```html preview
<body>
  <p>Hello</p>
</body>
```

The `<p>` opens and closes inside the `<body>`.

The spaces at the start of the lines don't matter to the browser. They're there for **you**: a line pushed further right is inside the one above it, so you can see at a glance what holds what.

## Break it on purpose

Delete the `<!DOCTYPE html>` line from your page. Most of the time nothing changes that you can see. But the browser now shows your page the way pages were shown in the 1990s, and some things, like sizes, start working differently later on. Put it back, always on the first line.

---

## Mission: Frame the page

Your `index.html` has your heading and your paragraphs. Put the frame around them.

**Example**: the preview looks exactly as before. Only the file changes: the frame is around what you wrote.

- The file starts with `<!DOCTYPE html>`.
- Then `<html>`, with a `<head>` (empty for now) and a `<body>` inside it.
- Your heading and your paragraphs are inside the `<body>`.

Psst, `<!DOCTYPE html>` goes before everything else, even before `<html>` :)
