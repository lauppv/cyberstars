Two people stand in a queue. One says "I need a metre of space around me", the other "I need a metre and a half". How far apart do they stand? Not two and a half metres: a metre and a half is enough for both. Margins between boxes work the same way.

## Margins don't add up

Two boxes, one under the other:

```css
.member {
  margin-top: 20px;
  margin-bottom: 30px;
}
```

You might expect 30 + 20 = 50 pixels between two members: the first one's bottom margin plus the second one's top margin. But there are only **30**. When the margin under one box meets the margin over the next, they **collapse** into one, as big as the bigger of the two.

That's on purpose. Paragraphs have a margin above and below them. Without collapsing, the space between two paragraphs would be twice the space at the top of the page.

## When it happens

Margins collapse only:

- **up and down**, between boxes one above the other. Margins side by side never collapse;
- **margins**, never padding. Padding always adds up, because it's inside each box.

## Inspect shows it

Inspect the first box and the second one. Both show their margins in orange, and the two orange areas **overlap** in the gap. That's the collapse.

## Break it on purpose

Want 50 pixels between the members? Raising both margins doesn't help as you'd think:

```css
.member {
  margin-top: 25px;
  margin-bottom: 25px;
}
```

You get 25, not 50. To get 50, give one side all of it: `margin-bottom: 50px`, and no margin on top.

---

## Mission: The right gap

The cards on `crew.html` should stand farther apart, at least 24 pixels from each other.

**Example**: the gap between each card and the next grows to 24 pixels or more. Use Inspect to see the cards' margins, and check whether two of them overlap.

- There are at least 24 pixels between each card and the next one.

Psst, a top and a bottom margin that meet don't add up: the bigger one wins :)
