Think of a page in your science notebook. You go over the key word with a highlighter. You write water as H₂O, with a small 2 down low. You write 10² for "ten squared", with the 2 up high. And at the bottom of a contract there's always the tiny "small print".

HTML has a tag for each of these.

## `<mark>`: the highlighter

```html
<p>The test is on <mark>Friday</mark>.</p>
```

```text
The test is on Friday.        ("Friday" with a yellow background)
```

`<mark>` is text you've highlighted because it matters right now, like a search word found on the page.

## `<sub>` and `<sup>`: low and high

```html
<p>Water is H<sub>2</sub>O.</p>
<p>A square with sides of 3 cm covers 3<sup>2</sup> = 9 cm<sup>2</sup>.</p>
```

```text
Water is H₂O.
A square with sides of 3 cm covers 3² = 9 cm².
```

`<sub>` (subscript) puts text a little lower and smaller, as in chemistry. `<sup>` (superscript) puts it a little higher, as in powers and units.

## `<small>`: the small print

```html
<p>Tickets cost 5 euros. <small>Children under 6 go free.</small></p>
```

```text
Tickets cost 5 euros. Children under 6 go free.     (the last sentence smaller)
```

`<small>` is for side notes: the fine print, a copyright line, "prices may change".

All four go inside a paragraph, around the few characters or words they're about, like `<strong>` and `<em>`.

## Break it on purpose

Put the whole formula in `<sub>`:

```html
<p>Water is <sub>H2O</sub>.</p>
```

```text
Water is H2O.       (all of it low and small)
```

Now the H and the O are low too, and it no longer reads as water's formula. Only the 2 goes in `<sub>`.

---

## Mission: Notes on board

Your `index.html` has its parts. Add some details to the Today on Board part.

**Example**: your page would show something like this:

```text
Water left: 900 litres of H₂O.
Height: 4 × 10⁵ metres above the Earth.
Docking fee: 20 credits a day.        (smaller)
```

- Water's formula is written H₂O, with the 2 in `<sub>`.
- A number is raised to a power, with the power in `<sup>`.
- A side note is in `<small>`.
- A word or two is highlighted with `<mark>`.

Psst, only the 2 of H₂O goes low, not the H or the O :)
