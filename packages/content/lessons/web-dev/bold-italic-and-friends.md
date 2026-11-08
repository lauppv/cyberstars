Inside a paragraph, some words matter more than others: a warning, a word you'd say louder, a chemical formula. HTML has small tags for them that go **inside** the text.

## Important and stressed

`<strong>` marks text as **important**: a warning, something serious or urgent. The browser shows it in bold.

`<em>` marks **stress**: the word you'd say louder, the one that changes what the sentence means. The browser shows it in italics.

```html
<p><strong>Never open the airlock while the light is red.</strong></p>
<p>I asked for <em>two</em> spacesuits, not one.</p>
```

Why not just ask for bold or italics? Because these tags say what the words **mean**, not how they look. A screen reader can read a `<strong>` warning more firmly. And later you can change how both look with CSS, without touching the HTML.

HTML also has `<b>` and `<i>`. They only change the look and add no meaning: `<i>` for the name of a ship or a word from another language, `<b>` for a word that should catch the eye. When you're not sure, ask yourself: is it **important**? Then `<strong>`. Is it **stressed**? Then `<em>`.

## A few friends

- `<small>` is for **fine print**: side notes, conditions, the tiny text under a price.
- `<sub>` sits **below** the line and `<sup>` sits **above** it: the 2 in O₂, the 2 in m².
- `<mark>` **highlights** text that matters right now, like the words a search found.

```html
<p>Each crew member breathes about 550 litres of O<sub>2</sub> a day.</p>
<p>The greenhouse is 40 m<sup>2</sup>.</p>
<p><small>Times are in station time.</small></p>
```

## Inline and block

`<p>` and the headings are **block** elements: each one starts on a new line and takes the whole width. `<strong>`, `<em>` and their friends are **inline**: they sit inside the text, so they go **inside** a block, never around it.

Close them in the order you opened them, the inner one first:

```html
<p>Dock at <strong>Bay 2</strong>.</p>
```

and not `<p>Dock at <strong>Bay 2</p></strong>`. Browsers try to fix tags closed in the wrong order, but they guess, and the guess isn't always what you meant.

---

## Mission: Safety Notice

Your page has a few words that need to stand out, each in its own way. Pick the tag for each one by what it **means**:

- in one of your paragraphs about the station, a word you'd say louder because it changes what the sentence means;
- under **Today on Board**, before the shifts, a paragraph that starts with a warning the crew must not miss: **Hatch 3 stays closed**. Only those four words carry the warning;
- after the warning, a paragraph saying how much water is left, with water written the way scientists write it: **H₂O**;
- after that, a paragraph with the station's height: **4 × 10⁵ metres** (an `x` will do for the ×);
- at the end of **About the Station**, after the address, a side note nobody needs to read first: **Docking fee: 20 credits a day.**
