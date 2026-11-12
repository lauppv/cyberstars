In your class, many people can wear the same team shirt. But only one person has your name on the register. A class is like the shirt: many elements can share it. An **id** is like a name: one element, and only one, has it.

You already gave Today on Board an id, `today`, so a link could jump to it. CSS can use that same name.

## Style an id

In CSS, an id is picked with a `#` in front of its name, the same `#` as in the jump link:

```css preview
<style>
  /* show */
  #rules {
    color: firebrick;
  }
  /* /show */
</style>
<h2>Members</h2>
<h2 id="rules">Club Rules</h2>
```

```html preview
<h2>Members</h2>
<h2 id="rules">Club Rules</h2>
```

Only the element with `id="rules"` changes. There's exactly one on the page, so this rule is for that one element.

## An id and a rule for its tag

Say there's also a rule for every `h2`:

```css preview
<style>
  /* show */
  h2 {
    color: teal;
  }

  #rules {
    color: firebrick;
  }
  /* /show */
</style>
<h2>Members</h2>
<h2 id="rules">Club Rules</h2>
```

Club Rules is an `h2`, so the first rule wants it teal. It also has the id, so the second wants it firebrick. It shows **firebrick**. A rule for one particular element beats a rule for every element of its kind. You'll learn exactly how the browser decides in a later lesson. For now: the id wins over the tag.

## Break it on purpose

Use a dot instead of the `#`:

```css preview
<style>
  /* show */
  .rules {
    color: firebrick;
  }
  /* /show */
</style>
<h2>Members</h2>
<h2 id="rules">Club Rules</h2>
```

A dot means a class, and nothing has `class="rules"`, so nothing changes. A `#` is for an id, a dot for a class.

---

## Mission: Today stands out

Your page's part headings all share one look. The one people look for most is Today on Board, so it should stand out from the others.

**Example**: Today on Board shows in a color of its own, and the other part headings keep theirs.

- The Today on Board heading, with the id `today`, has a color the other part headings don't have.

Psst, in CSS it's `#today`, with the `#` :)
