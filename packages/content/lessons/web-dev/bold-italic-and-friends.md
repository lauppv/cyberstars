Inside a paragraph, some words matter more than the rest: a warning, a stressed word, a chemical formula. HTML has small tags for them that sit **inside** the text.

## Important and stressed

`<strong>` marks text as **important**: a warning, something serious or urgent. The browser draws it bold.

`<em>` marks **stress**, the word you'd say louder, the one that changes the sentence's meaning. The browser draws it in italics.

```html
<p><strong>Never open the airlock while the light is red.</strong></p>
<p>I asked for <em>two</em> spacesuits, not one.</p>
```

Why not just ask for bold and italics? Because these tags say what the words **mean**, not how they look. A screen reader can say a `<strong>` warning more firmly, and you'll restyle both with CSS later without touching the HTML.

HTML also has `<b>` and `<i>`, which only change the look and add no meaning: `<i>` for the name of a ship or a word from another language, `<b>` for a word you want to catch the eye. When you're unsure, ask: is it **important**? Then `<strong>`. Is it **stressed**? Then `<em>`.

## A few friends

- `<small>` is for **fine print**: side notes, conditions, the small text under a price.
- `<sub>` sits **below** the line and `<sup>` **above** it: the 2 in H₂O, the 5 in 10⁵.
- `<mark>` **highlights** text that matters right now, like the words a search found.

```html
<p>Each crew member drinks about 3 litres of H<sub>2</sub>O a day.</p>
<p>The solar panels make 1.2 × 10<sup>5</sup> watts.</p>
<p><small>Times are in station time.</small></p>
```

## Inline and block

`<p>` and the headings are **block** elements: each starts on a new line and takes the whole width. `<strong>`, `<em>` and their friends are **inline**: they flow inside the text, so they go **inside** a block, never around it.

Close them in the order you opened them, the inner one first:

```html
<p>Dock at <strong>Bay 2</strong>.</p>
```

not `<p>Dock at <strong>Bay 2</p></strong>`. Browsers try to fix tags closed in the wrong order, but they guess, and the guess isn't always what you meant.

---

## Mission: Safety Notice

Your page needs a few words that stand out:

- in one of your paragraphs about the station, stress a word of your choice;
- under **Today on Board**, before the shifts, a paragraph that warns that **Hatch 3 stays closed**, with exactly those words marked as important;
- under the warning, a paragraph saying how much water is left, with the water written as H₂O: the 2 below the line;
- next, a paragraph with the station's height, **4 × 10⁵ metres**: the 5 above the line (an `x` will do for the ×);
- at the end of **About the Station**, after the address, a paragraph of fine print: **Docking fee: 20 credits a day.**
