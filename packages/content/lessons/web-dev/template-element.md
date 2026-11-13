Think of a cookie cutter. You don't eat it, and it doesn't sit on the plate. It waits in the drawer, and every time you need a cookie, you press it into the dough and get a new one, always the same shape. Today you'll make a cookie cutter for a web page.

## A card for every starship

The station wants a new page: a list of the starships near it. Each starship gets a card with its name, its class and what it's doing now. But how many starships are there? Today three, tomorrow seven. You can't write the cards by hand, since you don't know how many there will be or what they say.

Soon a script will load the starships and make one card for each. For that, it needs to know what a card looks like. You write that once, in HTML.

## `<template>`

`<template>` holds HTML that the browser reads but **doesn't show**. It waits in the page, like the cookie cutter in the drawer:

```html preview
<h1>Starships</h1>
<p>Here come the starships.</p>

<!-- show -->
<template id="ship-template">
  <article class="ship">
    <h2>Starship name</h2>
    <p>Class</p>
  </article>
</template>
<!-- /show -->
```

What do you see? Only the heading and the paragraph. The card inside `<template>` isn't on the page: no "Starship name", no "Class". The browser has it ready, and that's all.

The text inside, like "Starship name", is only there to show what goes where. When a script makes a card from the template, it puts the real name in its place.

A template can be anywhere in the page, but put it next to the place its copies will go, so you find it easily.

## Break it on purpose

Write the card without `<template>` around it:

```html preview
<h1>Starships</h1>
<p>Here come the starships.</p>

<!-- show -->
<article class="ship">
  <h2>Starship name</h2>
  <p>Class</p>
</article>
<!-- /show -->
```

Now the card shows, with "Starship name" on it, as if a starship had that name. A visitor would think the page is broken. That's why the card waits in a template.

Then try to hide a `<div>` instead, with `hidden`. It doesn't show either, but it's a real element of the page, and a script that looks for every card finds it too. A template is not part of the page until a script copies it.

---

## Mission: The tracker page

The crew wants to follow the starships near the station. They'll see them on a new page, the tracker. The starships come later. Today the page gets ready for them.

**Example**: a new page, `tracker.html`, that looks like the other pages: the header with the station's name and the Menu button, a heading such as "Starship Tracker", a short sentence, then the footer. No starship shows yet, only the page's own text.

- `tracker.html` is a whole page like the others: in English, with a name for its tab, the site's `style.css`, `theme.js` and `menu.js`, the same header and footer as every page, and its content in `<main>` with one biggest heading. Its menu opens from the Menu button.
- In its main part, an empty list with the id `ships`, and a template with the id `ship-template`.
- The template holds one card: a list item with the class `ship`, and inside it, in this order, the starship's name (class `ship-name`), its class (class `ship-class`) and its status (class `ship-status`), each with some text that shows where the real one goes.
- Every page's menu has a link to `tracker.html`, the commander's page too.

Psst, the card is a list item, since its copies go in the list :)
