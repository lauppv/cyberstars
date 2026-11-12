In a café, you tell the person at the counter your name, and they write it on your cup. They read what you said, and write it somewhere else. A script can do the same with a form: read what the visitor typed in a box, and write it on the page.

## `.value`: what is in a box now

Every box has a `value`: the text that is in it right now. A script reads it with `.value`:

```html preview
<label for="nickname">Nickname</label>
<input id="nickname" />
<button type="button" id="hello">Say hello</button>
<p id="answer"></p>
<script>
  const nickname = document.querySelector("#nickname");
  const answer = document.querySelector("#answer");

  document.querySelector("#hello").addEventListener("click", () => {
    answer.textContent = `Hello, ${nickname.value}!`;
  });
</script>
```

Type `Rocket` in the box and click **Say hello**. The paragraph says:

```text
Hello, Rocket!
```

Now type `Comet` instead and click again. The paragraph says `Hello, Comet!`. Each click reads the box again, so it always gets what is in it at that moment.

A box has no text between two tags, like a paragraph has. So `textContent` doesn't help here: what the visitor types lives in the box's `value`.

## When you read it matters

Here the script reads the box when the page opens, and keeps the text in a variable:

```html preview
<label for="nickname">Nickname</label>
<input id="nickname" />
<button type="button" id="hello">Say hello</button>
<p id="answer"></p>
<script>
  const typed = document.querySelector("#nickname").value;
  const answer = document.querySelector("#answer");

  document.querySelector("#hello").addEventListener("click", () => {
    answer.textContent = `Hello, ${typed}!`;
  });
</script>
```

Type `Rocket` and click:

```text
Hello, !
```

When the page opened, the box was empty, so `typed` holds an empty text. Typing later doesn't change the variable. Read `.value` inside the click, when the visitor has typed.

## Break it on purpose

Use `textContent` on the box:

```js
answer.textContent = `Hello, ${nickname.textContent}!`;
```

Type `Rocket` and click: the paragraph says `Hello, !` again. No error: the box has no text between tags, so its `textContent` is always empty. For a box, use `.value`.

---

## Mission: The boarding pass

Your booking form is ready, but `boarding.html` has no script yet. The editor has a new, empty file for it, `boarding.js`. Load it from the head of `boarding.html`, with `defer`, as your other pages load theirs.

**Example**: under the form, a small boarding pass with a heading, a line for the passenger and a button. Type `Ida Moreau` in the name box and click **Show my pass**. The pass now says something like:

```text
Your boarding pass
Passenger: Ida Moreau
```

- Under the form, a button with the id `show-pass`, saying `Show my pass`. A click on it never sends the form.
- A click on it writes what is in the name box in an element with the id `pass-name`. It holds only the name: words like `Passenger:` go outside it.
- Type another name and click again: the pass shows the new name.

Psst, read `.value` inside the click, not before :)
