When you pack a school bag, you start with what you need every day: the books, the pencil case. Then, on a sports day, you add the trainers. You don't pack everything and then take things out. A page can be written the same way: first what every screen needs, then what a bigger screen adds.

## Two ways to write the same page

So far we wrote the wide page first, then a `max-width` query that takes things back for a narrow window:

```css
.page {
  display: grid;
  grid-template-columns: 2fr 1fr;
}

@media (max-width: 500px) {
  .page {
    grid-template-columns: 1fr;
  }
}
```

**Mobile first** turns it round. The rules outside any query are the phone's, the simplest page. A `min-width` query adds the wide layout, for a window at least that wide:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .news,
  .weather {
    background-color: #1e3a5f;
    padding: 16px;
    margin: 0;
  }

  /* show */
  .page {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (min-width: 501px) {
    .page {
      grid-template-columns: 2fr 1fr;
    }
  }
  /* /show */
</style>
<div class="page">
  <p class="news">The school play is on Friday at 6 pm. Everyone is welcome!</p>
  <p class="weather">Sunny, 21 °C</p>
</div>
```

Make the panel narrow and wide: the page looks exactly as before. Only the way it's written changed.

## Why phone first?

- A phone page is usually simpler: one column, things one under the other. That's what a page does by itself, so there's less to write.
- The wide layout only **adds** rules. You never have to undo something on a phone, like a span or a column you wrote for the computer.
- Many people visit websites on their phone. Starting there makes sure the phone page is never an afterthought.

## Turning the numbers round

`max-width: 500px` means 500 pixels or narrower. Its other side is `min-width: 501px`: 501 pixels or wider. When you turn a query round, add one pixel, or the two layouts both count at exactly 500.

## Break it on purpose

Put the `@media (min-width: 501px)` **before** the `.page` rule. On a wide window, both rules count, and the later one, the phone's one column, wins. The wide layout never shows. As before, the queries go after the rules they change, usually at the end of the file.

---

## Mission: The dashboard, phone first

Your dashboard's layout is written for a computer, and two `max-width` queries take things back for smaller windows.

**Example**: the dashboard looks exactly as it does now, at every width. Only your CSS is written the other way round.

- Rewrite the dashboard's layout phone first: outside the queries, the phone's page (the cards in one column, the week in two rows, the panels one under the other), and `min-width` queries that add the wider layouts.
- On a phone, in windows 560, 600, 760 and 800 pixels wide, and on a computer, the dashboard looks as before, and nothing sticks out sideways.

Psst, `max-width: 567px` turned round is `min-width: 568px` :)
