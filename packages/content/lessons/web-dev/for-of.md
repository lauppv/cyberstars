"Give each guest a slice of cake." You don't count the guests first, or number them: you just go round, one guest after another. Most loops over a list are like that. You don't care about the index, only about each item.

## `for...of`

```js
const games = ["chess", "cards", "darts"];
for (const game of games) {
  console.log(game);
}
```

```text
chess
cards
darts
```

Read it as a sentence: "for each `game` of `games`, do this". In each lap, `game` is the next item of the array, from first to last. No counter, no `length`, no `[i]`.

The name `game` is yours to choose. It's a `const`, because within one lap the item doesn't change. The next lap gets a new one.

## Over elements on the page

It works on what `querySelectorAll` gives too:

```js
for (const member of document.querySelectorAll("#members li")) {
  console.log(member.textContent);
}
```

## `for` or `for...of`?

- Visiting every item, in order: `for...of`. Shorter, and nothing to get wrong with indexes.
- Needing the index itself, counting down, or skipping items: the `for` loop with a counter.

## Break it on purpose

Write `in` instead of `of`:

```js
for (const game in games) {
  console.log(game);
}
```

```text
0
1
2
```

The indexes, not the games! `for...in` exists too, but it goes over something else. For the items of a list, it's always `of`.

---

## Mission: Jobs on board

The console lists every job on the crew cards.

**Example**: when `crew.html` opens, the console shows, among its other lines, a line for each card:

```text
Job: Commander
Job: Engineer
Job: Pilot
Job: Botanist
```

- For every job on the cards, the ones in `.role`, the console shows `Job: ` and that job.
- The loop is a `for...of`.
- The jobs come from the page, so a new card gets its line too.

Psst, `of`, not `in` :)
