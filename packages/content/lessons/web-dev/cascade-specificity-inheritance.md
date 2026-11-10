Your parents say "be home by 9". Your grandmother, who's babysitting tonight, says "be home by 8". Whose rule counts? Usually the more **specific** one: the one meant for this evening, not every evening. When two CSS rules disagree about one element, the browser picks the more specific one too.

## Specificity: a score

Every selector gets a score from what it's made of:

- an **id**, like `#scores`: the biggest weight;
- a **class**, like `.tip`, or a pseudo-class like `:hover`: a medium weight;
- a **tag**, like `td`: the smallest.

```css
#scores td {
  color: white;
}

.winner td {
  color: gold;
}
```

```html
<table id="scores">
  <tr class="winner"><td>Sam</td><td>12</td></tr>
</table>
```

Both rules are about Sam's cells. `#scores td` has an id and a tag. `.winner td` has a class and a tag. An id beats any number of classes, so the cells stay **white**, even though the gold rule comes later.

## Winning

To make the winner gold, the gold rule needs a higher score:

```css
#scores .winner td {
  color: gold;
}
```

An id, a class and a tag: more than an id and a tag. Now Sam's row is gold.

## Break it on purpose

Make it even more specific than it needs to be, everywhere: `body #scores tbody tr.winner td`. It works, but next time you want to change a winner's cell, you'll need an even longer selector to beat it. Keep selectors as short as they can be: just enough to win.

---

## Mission: Cancelled in red

The cancelled flight should stand out in the table. But the flight table's cells already have a rule with an id in it.

**Example**: the row of SL-104, the cancelled flight, shows its words in a light red, while the other flights keep their color.

- The flight table's cells get a text color of your own, from your `#flights td` rule.
- The row of the cancelled flight has the class `cancelled`. Later lessons use this name.
- Its cells have a text color the other flights' cells don't have.

Psst, a class alone can't beat an id :)
