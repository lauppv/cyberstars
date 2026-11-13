When the food arrives at the table, the empty plates go away and the full ones take their place. Nobody leaves an empty plate next to a full one. The skeleton cards are the empty plates of the tracker: once the starships are in, they should go.

## One switch for everything

Soon a script will load the starships. When they are in, it will add a card for each one and set the list's `aria-busy` to `"false"`. That one change can be the switch for the look too: CSS can choose elements by an attribute's value.

You met attribute selectors on the flight schedule. `[aria-busy="false"]` chooses an element whose `aria-busy` is exactly `"false"`:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .news {
    list-style: none;
    padding: 0;
  }

  .skeleton {
    height: 40px;
    margin-bottom: 8px;
    border-radius: 8px;
    background-color: #1e3a5f;
  }

  /* show */
  .news[aria-busy="false"] .skeleton {
    display: none;
  }
  /* /show */
</style>
<h2>Busy</h2>
<ul class="news" aria-busy="true">
  <li class="skeleton" aria-hidden="true"></li>
  <li>The first news is here.</li>
</ul>
<h2>Not busy</h2>
<ul class="news" aria-busy="false">
  <li class="skeleton" aria-hidden="true"></li>
  <li>The first news is here.</li>
</ul>
```

What do you see? Two lists with the same items. In the busy one, a skeleton still waits above the first news. In the other one, the skeleton is gone, and only the news is left. The HTML of the two items is the same: only the list's `aria-busy` differs.

So the script won't need to remove the skeletons one by one. It changes one attribute, the one a screen reader already listens to, and the page follows it.

## Break it on purpose

Write the value with a capital letter: `[aria-busy="False"]`. Nothing hides: the value must match exactly, capital letters too, and the script will write `"false"`. Then leave out `.skeleton` and write `.news[aria-busy="false"] li`: now the real news goes away too, and the loaded list looks empty.

---

## Mission: Clear the table

The tracker's skeleton cards should leave as soon as the starships are in, and only then.

**Example**: while the list `ships` says it is busy, the skeleton cards show. Once a script sets its `aria-busy` to `"false"`, they are gone, and a starship card the script added shows.

- While the list `ships` has `aria-busy="true"`, its skeleton cards show.
- Once it has `aria-busy="false"`, the skeleton cards don't show, but every other item of the list does.

Psst, the script will write `"false"`, with a small f :)
