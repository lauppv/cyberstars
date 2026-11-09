Open a school textbook. There's the book's title on the cover, then chapters, and inside each chapter smaller sections. You can tell them apart at a glance: the bigger the heading, the bigger the part it starts.

A web page has the same kind of levels. You already know the biggest one, `<h1>`. There are five more.

## Six levels

```html
<h1>My Favourite Games</h1>
<h2>Board Games</h2>
<h3>Chess</h3>
<h4>Openings</h4>
<h5>The Italian Game</h5>
<h6>Its first move</h6>
```

The page shows six headings, each one a bit smaller than the one above:

```text
My Favourite Games      (biggest)
Board Games
Chess
Openings
The Italian Game
Its first move          (smallest)
```

The number is the **level**: `h1` is level 1, the whole page; `h2` starts a big part of it; `h3` a smaller part inside an `h2`, and so on down to `h6`. Most pages only need the first three.

## Headings with text under them

A heading starts a part, and the text of that part comes after it:

```html
<h1>My Favourite Games</h1>

<h2>Board Games</h2>
<p>We keep them in the cupboard by the window.</p>

<h3>Chess</h3>
<p>I play with my grandpa every Sunday.</p>

<h3>Monopoly</h3>
<p>Our games last for hours.</p>

<h2>Video Games</h2>
<p>Only at weekends.</p>
```

Read it like a table of contents:

```text
My Favourite Games
  Board Games
    Chess
    Monopoly
  Video Games
```

Chess and Monopoly are both `h3`, because both are parts of Board Games. Video Games is an `h2` again, because it's a new big part, next to Board Games, not inside it.

The empty lines between the parts don't show on the page. They just make the file easier to read.

## Break it on purpose

Make Video Games an `h3`:

```html
<h3>Video Games</h3>
```

On the page it just looks a bit smaller. But now the page says Video Games is part of Board Games, which isn't true. Someone who listens to the page with a screen reader, and jumps from heading to heading, gets the wrong idea of how the page is built.

---

## Mission: Parts of the station

Your `index.html` has the heading and a couple of paragraphs. Give the page some parts.

**Example**: read as a table of contents, your page would look something like this:

```text
Welcome aboard
  About the Station
  Today on Board
    Morning Shift
    Night Shift
```

- Under your paragraphs, at least two parts, each starting with an `<h2>` heading.
- The second part has at least two smaller parts inside it, each starting with an `<h3>` heading.
- Each `<h3>` has a paragraph right under it.

Psst, a part inside another one gets the next level down :)
