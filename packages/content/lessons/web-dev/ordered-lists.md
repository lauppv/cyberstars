A recipe's steps come in a fixed order: you crack the eggs before you whisk them, and you whisk them before they go in the pan. Swap two steps and the cake fails. That's why recipe steps are numbered.

## `<ol>`

When the order matters, use an `ol`, an **ordered list**. Its items are `li`s, just like in a `ul`:

```html
<ol>
  <li>Crack the eggs</li>
  <li>Whisk them</li>
  <li>Pour them in the pan</li>
</ol>
```

```text
1. Crack the eggs
2. Whisk them
3. Pour them in the pan
```

The browser numbers the items by itself.

## Never type the numbers

Say you forgot a step and add it in the middle:

```html
<ol>
  <li>Crack the eggs</li>
  <li>Add a pinch of salt</li>
  <li>Whisk them</li>
  <li>Pour them in the pan</li>
</ol>
```

Every number after it moves up by one, on its own. If you had typed "1.", "2.", "3." into the items, you'd have to fix each number by hand.

## `ul` or `ol`?

Ask yourself: if I swapped two items, would it be wrong?

- A shopping list, the members of a club: no. Use `ul`.
- Steps, a top-ten, a timetable in order: yes. Use `ol`.

## Break it on purpose

Type the numbers in yourself, inside an `ol`:

```html
<ol>
  <li>1. Crack the eggs</li>
  <li>2. Whisk them</li>
</ol>
```

```text
1. 1. Crack the eggs
2. 2. Whisk them
```

Now every number shows twice. The `ol` already numbers its items.

---

## Mission: Morning routine

Every morning the crew does the same things, in the same order. New crew members need to know them.

**Example**: after the crew list, `crew.html` would show something like this:

```text
Morning Routine

1. Check the oxygen readings
2. Water the greenhouse
3. Report to the commander
```

- A part with a heading at the same level as Crew, called Morning Routine.
- Right under its heading, the routine as a numbered list of at least three steps.

Psst, let the browser number them :)
