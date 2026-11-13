A café with a waiter for each table needs a new waiter each time it adds a table. A café with one waiter for the whole room only needs that waiter to look at which table is calling. Events can work like the second café: one listener, on the parent, for all the elements inside it.

## One listener on the parent

A click on an item goes up to its list, so a listener on the list hears clicks on every item. `event.target` says which one was clicked:

```html preview
<style>
  .done {
    text-decoration: line-through;
  }
</style>
<ul id="jobs">
  <li>Buy snacks</li>
  <li>Book the room</li>
</ul>
<script>
  document.querySelector("#jobs").addEventListener("click", (event) => {
    event.target.classList.toggle("done");
  });
</script>
```

Click **Book the room**: it is crossed out. Click it again: it isn't. One listener does the work for both jobs. This is called **event delegation**: the list does the job for its items.

## Items added later

Remember: a list from `querySelectorAll` is a snapshot. A listener added to each item when the page opens never reaches an item added afterwards. A listener on the parent has no such problem: the new item's clicks go up to the parent too.

```html preview
<style>
  .done {
    text-decoration: line-through;
  }
</style>
<ul id="jobs">
  <li>Buy snacks</li>
  <li>Book the room</li>
</ul>
<button type="button" id="add">Add a job</button>
<script>
  const jobs = document.querySelector("#jobs");

  jobs.addEventListener("click", (event) => {
    event.target.classList.toggle("done");
  });

  document.querySelector("#add").addEventListener("click", () => {
    const job = document.createElement("li");
    job.textContent = "Bring the dice";
    jobs.append(job);
  });
</script>
```

Click **Add a job**, then click **Bring the dice**: it is crossed out too, and no line of the script was added for it.

## `closest`: from what was clicked to the item

When an item has elements inside it, `event.target` may be one of them, not the item. `closest` finds the item. It looks at the element first, then at its parent, then at the parent's parent, and so on up, and gives back the first one that matches the selector. When none matches, it gives back `null`.

```html preview
<style>
  #jobs {
    background-color: lightyellow;
    padding-bottom: 24px;
  }

  .done {
    text-decoration: line-through;
  }
</style>
<ul id="jobs">
  <li><strong>Buy snacks</strong> before Friday</li>
  <li><strong>Book the room</strong> for Saturday</li>
</ul>
<script>
  document.querySelector("#jobs").addEventListener("click", (event) => {
    const job = event.target.closest("li");
    if (job) {
      job.classList.toggle("done");
    }
  });
</script>
```

Click **Book the room**, the bold words: the whole line is crossed out. The click started on the `<strong>`, and `closest("li")` went up to its line. The `if` is there for a click on the list's own space, the yellow space under the lines: there, no `li` is found, and `job` is `null`.

## Break it on purpose

Leave out `closest`, and use the target as it is:

```js
const job = event.target;
```

Click the bold words: only they are crossed out, not their line, since the target is the `<strong>`. Now put `closest` back, but leave out the `if`, and click the yellow space under the lines. The console shows:

```text
TypeError: Cannot read properties of null (reading 'classList')
```

`closest` found no `li`, so `job` is `null`, and `null` has no `classList`. Check what `closest` gives back before you use it.

---

## Mission: Pick a card

Each card of the wiki has a listener of its own. A card that a script adds to the list later has none, and a click on it does nothing. One listener on the list can do the work for every card, the new ones too.

**Example**: click the heading of the airlock's card. The card gets a gold outline, and over the list the page says `Next to read: The Airlock`. Click another card, and the outline moves to it.

- One listener, on `.wiki-list`, picks the card clicked, wherever the click lands in it. A card that a script adds to the list later can be picked too.
- The card picked gets the class `picked`, and only that card: picking another takes the class away from the old one.
- In `style.css`, `.picked` makes a picked card stand out from the others, in a way of your choice.
- `#picked` still holds the title of the card picked.

Psst, `closest` finds the card from whatever was clicked inside it :)
