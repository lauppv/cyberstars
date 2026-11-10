Imagine a teacher who ends every instruction with "and this is the MOST important rule". After a week, nothing is more important than anything else, and nobody can change a rule without shouting even louder. CSS has a way to shout, and it causes exactly that.

## `!important`

`!important` after a value makes that declaration win over every normal rule, whatever their scores and order:

```css
p {
  color: gray !important;
}

.tip {
  color: darkgreen;
}
```

A paragraph with the class `tip` should be dark green: `.tip` has a higher score. But `gray !important` wins anyway. It skips the whole score system.

## Why avoid it

It feels like a quick fix: "this doesn't work, add `!important`". But then, the next time you want to change that color, a normal rule can't do it. You need another `!important`, with a higher score. Soon your stylesheet is all shouting, and nobody can tell which rule really applies.

When a rule doesn't win, find out why: a missing class, a score too low, a rule further down. Fix that instead. Inspect shows you which rule won and which were crossed out.

You'll find `!important` in other people's style sheets sometimes. When it breaks your page, the best fix is usually to take it out.

## Break it on purpose

Add `!important` to one of your own rules, then try to override it with a more specific rule. Nothing works until you add `!important` there too. That's the trap.

---

## Mission: The notice board's style sheet

The station's notice team sent a small style sheet, `board.css`, for the schedule page: it puts the flight table's caption in italic. It also has a rule that shouts, and turns every paragraph grey.

**Example**: once `board.css` is linked, the caption of the flight table is in italic, and your paragraphs keep their own light color.

- `schedule.html` links `board.css`, after `style.css`.
- The flight table's caption is in italic, from `board.css`.
- Every paragraph has a contrast of at least 4.5:1, and no rule of yours uses `!important`.

Psst, the best fix for a shouting rule is in the file that shouts :)
