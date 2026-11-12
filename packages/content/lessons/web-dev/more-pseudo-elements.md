Open an old storybook: the first letter of a chapter is often huge, decorated, taking up several lines. And in a fancy list, the bullets may be a different color from the words. CSS can style those little pieces too, with more pseudo-elements.

## `::first-letter`

```css preview
<style>
  /* show */
  .story::first-letter {
    font-size: 2em;
    color: gold;
  }
  /* /show */
</style>
<p class="story">Once upon a time, a small station circled the Earth, and six people lived in it with a greenhouse full of tomatoes.</p>
<p>The end.</p>
```

The first letter of every `.story` paragraph shows twice as big, in gold. The rest of the paragraph is untouched. `2em` means "twice the size of this element's text".

## `::marker`

The bullet or number of a list item is its **marker**:

```css preview
<style>
  /* show */
  .menu li::marker {
    color: gold;
  }
  /* /show */
</style>
<ul class="menu">
  <li>Home</li>
  <li>Games</li>
  <li>Members</li>
</ul>
```

The bullets turn gold, while the words of the items keep their own color.

## `::placeholder`

One more you'll use soon: in a form, a box to type in can show a grey hint, like "Your name", until you type. That hint is its placeholder, and `::placeholder` styles it. You'll meet forms in a later part.

## Break it on purpose

Use one colon:

```css preview
<style>
  /* show */
  .story:first-letter {
    font-size: 2em;
  }
  /* /show */
</style>
<p class="story">Once upon a time, a small station circled the Earth, and six people lived in it with a greenhouse full of tomatoes.</p>
<p>The end.</p>
```

It still works: old CSS used one colon, and browsers still accept it for a few of these. But the rule is two colons for pseudo-elements, the pieces, and one for pseudo-classes, the states like `:hover`. Writing two keeps them apart in your head.

---

## Mission: Little touches

Two little touches for the site.

**Example**: on `crew.html`, the bullets of the crew list are gold. On `schedule.html`, the first letter of the introduction is twice as big as the rest, or more.

- The markers of the crew list (`#crew`) are `#ffd166`.
- The first letter of the paragraph right after the schedule's biggest heading is at least twice as big as the paragraph's text.

Psst, two colons for a piece of an element :)
