Write a text message and press Enter three times between two words. The message shows three empty lines, just as you typed them. You'd expect a web page to do the same. It doesn't.

## The browser squeezes spaces

Try this in your editor:

```html
<p>I    like      chess.</p>
```

The page shows:

```text
I like chess.
```

All those spaces became one. Now press Enter in the middle:

```html
<p>I like
chess
and cards.</p>
```

```text
I like chess and cards.
```

Still one line. To the browser, an Enter is just another space, and any number of spaces in a row count as one.

That's on purpose. It means you can lay out your HTML file however you like, with spaces at the start of lines and empty lines between parts, and the page doesn't change. Your file stays easy to read.

## So how do you get new lines?

With tags. Every `<p>` starts on a new line, so if you want things on separate lines, make them separate paragraphs:

```html
<p>Clean your room.</p>
<p>Feed the cat.</p>
<p>Do your homework.</p>
```

```text
Clean your room.

Feed the cat.

Do your homework.
```

## Break it on purpose

Write the same three lines in **one** paragraph, each on its own line in the file:

```html
<p>
  Clean your room.
  Feed the cat.
  Do your homework.
</p>
```

```text
Clean your room. Feed the cat. Do your homework.
```

They run together into one line. The Enters you typed are gone.

---

## Mission: Station rules

Your `index.html` has its parts. Add one more part at the very end of the page: the rules everyone on board must follow.

**Example**: the end of your page would show something like this, each rule on its own line:

```text
Station Rules

Wear your badge at all times.

Close every hatch behind you.

No running in the greenhouse.
```

- The page ends with a new part: an `<h2>` heading, then its rules.
- There are three rules, and each one shows on its own line on the page.

Psst, pressing Enter in the file doesn't start a new line on the page :)
