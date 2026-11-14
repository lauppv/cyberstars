You call a friend and ask a question. They say: "Wait, I'm looking it up." You don't hang up, and you don't take their silence as the answer. You wait, because they told you they're busy. A page can say the same thing to a screen reader.

## A list that isn't ready

Soon the tracker will load its starships from far away. That takes a moment: half a second, sometimes more. During that moment the list is empty, then it fills up, maybe one card at a time.

Someone who can see the page waits for the cards. But a screen reader reads what is there, as soon as it's there. It could read an empty list, or only the first card, and the listener would think that's all.

## `aria-busy`

`aria-busy="true"` says: this part of the page is still changing, wait before you read it.

```html
<ul id="results" aria-busy="true"></ul>
```

A screen reader that meets it waits until the part is no longer busy, then reads it whole. A script changes it to `aria-busy="false"` once everything is in. You'll write that script in a later lesson.

It changes nothing on the screen:

```html preview
<!-- show -->
<p aria-live="polite">Loading the results...</p>
<ul aria-busy="true"></ul>
<!-- /show -->
```

What do you see? Only the line "Loading the results...". The list is there, empty, and the eye can't tell it's busy. That's why the line is there too. With `aria-live` (you met it on the settings page), a screen reader also reads that line out every time a script changes it.

So the two work together: the line tells **everyone** what's happening, and `aria-busy` tells a screen reader to wait for the list.

## Break it on purpose

Put `aria-busy="true"` on the whole `<main>` instead of the list. Now a screen reader waits for the whole page, the heading and the loading line too, and says nothing at all while it loads. Mark only the part that is really still changing.

Then write `aria-busy="yes"`. The browser only knows `"true"` and `"false"`, so `"yes"` counts as not busy.

---

## Mission: The tracker is loading

The starships don't come yet, but the tracker can already say they're on the way.

**Example**: under the tracker's first sentence, a line that says something like `Loading the starships...`, then the empty list.

- Before the list `ships`, a paragraph with the id `tracker-status` whose text has the word `Loading`, which a screen reader reads out when it changes.
- The list `ships` says it is still loading. Nothing else on the page does.

Psst, it's `aria-busy="true"`, not `aria-busy="yes"` :)
