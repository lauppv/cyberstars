In a school book, next to the long text about a country, there's often a small box: the capital, how many people live there, the longest river. You can read the text without it. But when you only want a number, the box finds it for you in a second. That box is an **aside**.

## `<aside>`

`<aside>` holds something beside the main text: it goes with it, but the text makes sense without it. A box of quick facts, a tip, links to read next.

```html preview
<main>
  <article>
    <h1>The North School Team</h1>
    <p>Our football team plays every Saturday. This year we won six games and lost two.</p>
  </article>
  <aside>
    <h2>Quick facts</h2>
    <ul>
      <li>Players: 14</li>
      <li>Coach: Lena Park</li>
      <li>Home games: Saturday, 10:00</li>
    </ul>
  </aside>
</main>
```

For now the facts show under the article. A later lesson puts them beside it, with CSS.

An aside is a landmark too. A screen reader calls it **complementary**: something extra that goes with the page. The listener can skip it, and still gets the whole story.

## Inside or next to the article?

An aside inside an `<article>` goes with that article only. An aside next to the article, inside `<main>`, goes with the whole page. A fact box next to the article, as above, is also easy to put beside it later, on a wide screen.

## Break it on purpose

Move the team's results into the aside:

```html preview
<main>
  <article>
    <h1>The North School Team</h1>
    <p>Our football team plays every Saturday.</p>
  </article>
  <aside>
    <p>This year we won six games and lost two.</p>
    <p>Coach: Lena Park</p>
  </aside>
</main>
```

The page shows the same words. But someone who skips the aside never learns how the season went, and that was the news. Only what the reader could skip goes in an aside.

---

## Mission: Quick facts

Your two wiki pages have their articles. A reader in a hurry wants the numbers, without reading every part.

**Example**: under the greenhouse article, a small box:

```text
Facts
Plants: 4 kinds
Light: 16 hours a day
Water: 60 liters a day
Warmth: 24 °C
```

The airlock's facts: 2 doors, 4 space suits, 15 minutes to take the air out, 3 m long.

- On each wiki page, a fact box with the class `fact-box` comes after the article, inside `<main>`: next to the text, not part of it.
- Each fact box has a small heading and at least three short facts about its topic.

Psst, the fact box goes after `</article>`, not inside the article :)
