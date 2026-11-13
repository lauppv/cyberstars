A recipe in a cookbook has parts: what you need, how to make it, how to serve it. Each part has its own small heading, so you find the steps without reading the list of eggs and milk again. A long web page has parts like that too.

## `<section>`

`<section>` holds one part of a page. The part's heading goes first, inside it:

```html preview
<h1>Pancakes</h1>
<section>
  <h2>You need</h2>
  <p>Two eggs, a cup of milk and a cup of flour.</p>
</section>
<section>
  <h2>How to make them</h2>
  <p>Mix everything, then cook a spoon of it in a hot pan.</p>
</section>
```

The page looks as it would with only the headings and the paragraphs. A section has no look of its own. But each one now holds its heading and its text together, as one part with a name.

## A section has a heading

A part with no heading of its own is not a section. If you only need a box to style with CSS, that's a `<div>`, as in the crew cards.

The heading in a section is one level below the heading over it: on a page with an `<h1>`, each section starts with an `<h2>`.

## Break it on purpose

Put the heading before the section, outside it:

```html preview
<h1>Pancakes</h1>
<h2>You need</h2>
<section>
  <p>Two eggs, a cup of milk and a cup of flour.</p>
</section>
```

It looks exactly the same. But now the section is a part with no name, and the heading belongs to no part. Anyone who reads the HTML, a person or a program, can't tell what this part is about. Keep the heading inside, at the top.

---

## Mission: The first wiki pages

The crew wants a wiki: pages that explain how things work on the station. The first two are about the greenhouse and the airlock. Here is what each page tells:

```text
The Greenhouse
- the only green room on the station: fresh food, and a little fresh air
- what grows: tomatoes, beans, basil and lettuce; Kenji Arano, the botanist, looks after them
- light: blue and red lamps, 16 hours a day, then the plants rest
- water: the station cleans the water the crew used; the plants drink 60 liters a day

The Airlock
- a small room between the station and space, used for every space walk
- two doors, one to the station and one to space; only one opens at a time
- before a walk: the crew put on their suits inside, then pumps take the air out in 15 minutes
- nobody goes out alone; Commander Vega checks every suit and both doors
```

**Example**: the greenhouse page shows the site's header, the heading **The Greenhouse** and a sentence, then parts such as **What grows here**, **Light** and **Water**, each under its own heading, then the footer.

- Two new pages, `wiki-greenhouse.html` and `wiki-airlock.html`, are built like the others: a whole page, in English, that can show any letter, with a name for its tab, using the site's `style.css`. Each has the header with its named menu, one `<main>` with the biggest heading, and the footer.
- Each page tells about its topic in at least two parts, each with its own heading inside it. The headings go in order: no level skipped.
- The home page has a link to each of the two pages.

Psst, the heading goes inside its section, at the top :)
