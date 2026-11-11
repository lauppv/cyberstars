A `div` is a box for whole blocks. But sometimes you want to mark just a few words **inside** a sentence: a price, a date, a name. Think of drawing a circle with a pencil around one word on a page. The word stays where it is, in its line, but now it's marked.

## `<span>`

`span` is a box for a few words, inside a line:

```html
<p>The next match is on <span class="date">Saturday</span>.</p>
```

```text
The next match is on Saturday.
```

Nothing changes on the page: the sentence reads the same, on one line. A `span` is **inline**, like `<strong>` or `<mark>`, so it never breaks the line.

But now CSS can color `.date`, and JavaScript can find it and read "Saturday", or change it to "Sunday" without touching the rest of the sentence.

## `span` or `strong`?

Like `div`, `span` means nothing. If the words are **important**, use `<strong>`. If they're **stressed**, `<em>`. Use `span` when you only need a handle on some words, for their look or for a script.

## Break it on purpose

Use a `div` instead:

```html
<p>The next match is on <div class="date">Saturday</div>.</p>
```

```text
The next match is on

Saturday
.
```

A `div` is a block: it breaks the sentence apart. And a block inside a `<p>` isn't allowed, so the browser even closes the paragraph early. For a few words in a line, it's always `span`.

---

## Mission: Jobs in the cards

Each card says something like Job: Pilot. Later, a script needs to read just the job, without the word "Job:".

**Example**: the cards look exactly as before.

- In every card, the job itself (Pilot, not Job:) is in a `span` with the class `role`. Later lessons use this name.
- The job stays on the same line as Job:.

Psst, the `span` goes inside the paragraph, around the job only :)
