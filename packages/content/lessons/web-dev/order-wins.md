Two teachers give you homework for Friday, both with the same authority. Which comes first? The one that came last usually does: it's the most recent news. In CSS, when two rules have **exactly the same score**, the one further down the file wins.

## A tie

```css
#scores .winner td {
  color: gold;
}

#scores .late td {
  color: gray;
}
```

Both selectors have an id, a class and a tag: the same score. A row that's only `winner` is gold, a row that's only `late` is gray. And a row with **both** classes, `class="winner late"`? It's a tie, so the later rule wins: gray.

Swap the two rules in the file, and the same row turns gold.

## Order on purpose

That's useful: put the general rules first and the special cases after them. The special case is further down, so it wins the ties. A stylesheet often reads like that: the whole page first, then parts, then exceptions.

Remember, order only decides a **tie**. A rule with a higher score wins wherever it is in the file.

## Break it on purpose

Put the special case first:

```css
#scores .late td {
  color: gray;
}

#scores .winner td {
  color: gold;
}
```

A late winner is now gold: the gray rule lost the tie. When a rule you know is right does nothing, look for a rule with the same score further down.

---

## Mission: Delayed, and cancelled after all

SL-103 is delayed. And a flight can be delayed first, then cancelled: then it must show as cancelled.

**Example**: SL-103's row shows in amber. A row that is both delayed and cancelled shows like a cancelled one, not like a delayed one.

- The row of the delayed flight has the class `delayed`, and its cells have a text color the flights that are neither delayed nor cancelled don't have.
- A row with both classes, `delayed` and `cancelled`, shows its cells unlike a row that is only delayed.

Psst, when two rules tie, the one further down wins :)
