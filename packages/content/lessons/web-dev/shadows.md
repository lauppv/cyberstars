Put a sheet of paper on a desk under a lamp: it casts a soft shadow, and you can tell it lies on top of the desk. On a screen, a shadow does the same trick: it makes a box look like it floats above the page.

## `box-shadow`

```css
.member {
  box-shadow: 0 4px 12px rgb(0, 0, 0, 0.4);
}
```

Four values, in this order:

1. `0`: how far the shadow moves **right**. 0 means not at all;
2. `4px`: how far it moves **down**. A shadow a little below the box looks like light from above;
3. `12px`: how **blurry** it is. 0 is a hard edge, bigger is softer;
4. `rgb(0, 0, 0, 0.4)`: its **color**, here black at 40%, a see-through shadow.

The shadow takes the box's shape, rounded corners included, and never takes up any room: it doesn't push anything away.

## Soft and subtle

The best shadows are hard to notice: a little offset, a lot of blur, a see-through color. A hard black shadow, like `5px 5px 0 black`, looks like a cartoon. Fun sometimes, but not for a card.

On a dark page like yours, a shadow needs to be darker than the page to show at all: pure black at 40 to 60% works.

## Break it on purpose

Give the shadow a light color on the dark page: `0 4px 12px rgb(255, 255, 255, 0.4)`. Now the cards seem to glow instead of floating. Not wrong, just a different effect. Then make the blur `0`: a hard-edged copy of the card sits under it. Try a few values and find the one you like.

---

## Mission: Floating cards

Your cards lie flat on the page.

**Example**: every card seems to float a little above the page, with a soft shadow under it.

- Every card has a shadow.

Psst, a little offset and a lot of blur look softest :)
