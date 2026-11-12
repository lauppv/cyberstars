A recipe card says what dish it's for, then a list of what goes in: "Pancakes: 2 eggs, 1 cup of milk, a pinch of salt". A CSS rule is built the same way: what it's for, then a list of how it looks.

## The parts of a rule

```css preview
<style>
  /* show */
  h2 {
    color: teal;
  }
  /* /show */
</style>
<h1>Game Club</h1>
<h2>Board Games</h2>
<p>Chess, Monopoly and cards.</p>
<h2>Video Games</h2>
<p>Only at weekends.</p>
```

- `h2` is the **selector**: which elements the rule is for. A tag's name picks every element of that kind, so this rule is for every `h2`.
- Between `{` and `}` come the **declarations**: how they look.
- A declaration is a **property**, `color`, then `:`, then its **value**, `teal`, and a `;` at the end.

A property is a thing you can change: the color of the text, its size, its font. The value says what to change it to.

## Several declarations in one rule

A rule can say many things about its elements, one declaration per line:

```css preview
<style>
  /* show */
  h2 {
    color: teal;
    text-decoration: underline;
  }
  /* /show */
</style>
<h1>Game Club</h1>
<h2>Board Games</h2>
<p>Chess, Monopoly and cards.</p>
<h2>Video Games</h2>
<p>Only at weekends.</p>
```

Now every `h2` is teal **and** underlined. `text-decoration` draws a line on the text: `underline` under it, `line-through` through the middle, `none` for no line.

Change the order of the two lines and nothing changes: they're both about `h2`, and they don't clash.

## Comments in CSS

CSS has comments too, but they look different from HTML's:

```css preview
<style>
  /* show */
  /* The headings of each part */
  h2 {
    color: teal;
  }
  /* /show */
</style>
<h1>Game Club</h1>
<h2>Board Games</h2>
<p>Chess, Monopoly and cards.</p>
<h2>Video Games</h2>
<p>Only at weekends.</p>
```

Everything between `/*` and `*/` is a note for you.

## Break it on purpose

Leave out one `;`:

```css preview
<style>
  /* show */
  h2 {
    color: teal
    text-decoration: underline;
  }
  /* /show */
</style>
<h1>Game Club</h1>
<h2>Board Games</h2>
<p>Chess, Monopoly and cards.</p>
<h2>Video Games</h2>
<p>Only at weekends.</p>
```

The browser reads `teal text-decoration: underline` as the value of `color`, which makes no sense, so it throws that whole declaration away. Your headings lose their color **and** their underline. No error shows anywhere. When a style doesn't work, look for a missing `;` or `:` first.

---

## Mission: Part headings

Your `style.css` colors the biggest heading. Now give the headings of the parts their own look.

**Example**: About the Station, Today on Board, Visiting Hours and Station Rules all show in one color, each with a line under it.

- Every `<h2>` has a color of your own.
- Every `<h2>` is underlined.

Psst, each declaration ends with `;` :)
