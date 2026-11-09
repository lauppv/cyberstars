Have you ever written a note in the margin of a book, or a reminder on a sticky note on your homework? It's for you, not for whoever reads the book. HTML has notes like that too. They're called **comments**.

## A comment

A comment starts with `<!--` and ends with `-->`. Everything between them is ignored by the browser:

```html
<h1>My Favourite Games</h1>
<!-- Add the new games after the summer holiday -->
<p>I play chess with my grandpa every Sunday.</p>
```

The page shows:

```text
My Favourite Games

I play chess with my grandpa every Sunday.
```

The note is in the file, but not on the page. Comments are for people who read the code: you in a month, or a friend who helps you.

## Turning something off

A comment can also hide a piece of the page for a while, without deleting it:

```html
<p>I play chess with my grandpa every Sunday.</p>
<!-- <p>Tournament this Saturday!</p> -->
```

```text
I play chess with my grandpa every Sunday.
```

The second paragraph is still in the file. To bring it back, you just take away the `<!--` and `-->`. That's handy for something that comes and goes, like a notice for one week.

A comment can be as long as you like, over several lines, until its `-->`.

## Break it on purpose

Forget the end of the comment:

```html
<!-- Add the new games after the summer holiday
<p>I play chess with my grandpa every Sunday.</p>
<p>On rainy days we play cards instead.</p>
```

Now the page is empty from that line on. Without `-->`, the browser thinks the whole rest of the file is one long comment. If part of your page suddenly disappears, look for a comment that never ends.

Comments are visible to anyone who looks at the page's code, so never write a password or a secret in one.

---

## Mission: Off for now

Your `index.html` has a side note in `<small>` about the docking fee. The fee is being changed, so it shouldn't show for now. But you'll need it again later, so don't delete it.

**Example**: the paragraph with the small print shows only its other words:

```text
Next supply ship: Friday.
```

- The side note in `<small>` no longer shows on the page.
- Everything else on the page still shows.

Psst, a comment needs both its `<!--` and its `-->` :)
