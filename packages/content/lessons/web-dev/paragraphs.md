A page with only a heading is like a book cover with no book inside. Now we need some text.

In a school essay you split your text into **paragraphs**: one idea, then a new block for the next idea. HTML has a tag for that, `<p>`, short for **paragraph**.

## The `<p>` tag

```html
<h1>My Favourite Games</h1>
<p>I play chess with my grandpa every Sunday.</p>
```

The page shows:

```text
My Favourite Games        (big and bold)

I play chess with my grandpa every Sunday.
```

The paragraph is normal-size text. The browser puts a bit of empty space above and below it, so it stands apart from the heading.

Add a second one:

```html
<h1>My Favourite Games</h1>
<p>I play chess with my grandpa every Sunday.</p>
<p>On rainy days we play cards instead.</p>
```

```text
My Favourite Games        (big and bold)

I play chess with my grandpa every Sunday.

On rainy days we play cards instead.
```

Each `<p>` starts on a new line, with space between them. You don't have to do anything for that. The tag does it.

Type it in `index.html`, under your heading, and look at the preview.

## Break it on purpose

What if you write both sentences in one paragraph?

```html
<p>I play chess with my grandpa every Sunday. On rainy days we play cards instead.</p>
```

```text
I play chess with my grandpa every Sunday. On rainy days we play cards instead.
```

They run together on one line. The browser only starts a new block where you start a new `<p>`.

And if you forget the closing `</p>`? Try it. Often the page looks the same, because the browser guesses where the paragraph ends. Don't count on it: always close what you open.

---

## Mission: About the station

Your `index.html` from the last lesson already has the heading. Under it, tell visitors about your station.

**Example**: your page would show something like this (your own words, of course):

```text
Welcome to Orion Station        (big and bold)

The station goes round the Earth every 92 minutes.

Six people live here, with a garden full of tomatoes.
```

- Under the heading there are at least two paragraphs, each made with `<p>`.
- Each paragraph has a sentence of your own.

Psst, each paragraph needs its own `<p>` and `</p>` :)
