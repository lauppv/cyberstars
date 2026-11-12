When you tell a friend something important, your voice changes. "Don't touch the oven, it's **hot**." Or you lean on one word: "I said _Tuesday_, not Thursday." In writing, we show that with bold and italic text.

HTML has two tags for it. They don't just change how text looks, they say what it **means**.

## `<strong>`: this is important

```html preview
<p><strong>Don't touch the oven</strong>, it's still hot.</p>
```

`<strong>` means "this part is important". Browsers show it in **bold**, and a screen reader may say it with more force.

## `<em>`: say this word differently

```html preview
<p>I said <em>Tuesday</em>, not Thursday.</p>
```

`<em>` is short for **emphasis**: the word you'd lean on when you say the sentence out loud. Browsers show it in _italic_.

Move the `<em>` and the sentence means something else:

```html preview
<p><em>I</em> said Tuesday, not Thursday.</p>
```

Now the point is who said it, not which day.

Both tags go **inside** a paragraph, around the words they're about. The rest of the paragraph stays as it was.

## What about `<b>` and `<i>`?

You may see `<b>` (bold) and `<i>` (italic) on other pages. They only change the look and say nothing about meaning. When something is important or stressed, use `<strong>` and `<em>`.

## Break it on purpose

Forget to close the `<strong>`:

```html preview
<p><strong>Don't touch the oven, it's still hot.</p>
<p>Dinner is at seven.</p>
```

Now everything after it may turn bold, even the next paragraph, because the browser doesn't know where the important part ends. Close it, and only the words inside stay bold.

---

## Mission: A warning

Your `index.html` has its parts. Something on board needs a warning.

**Example**: in your Today on Board part, your page would show something like this:

```text
Hatch 3 stays closed while the panels are repaired.     ("Hatch 3 stays closed" in bold)
```

- A paragraph has a warning, with its most important words in `<strong>`.
- Somewhere on the page, a word you'd say with more stress is in `<em>`.

Psst, `<strong>` and `<em>` go inside the paragraph, around just the words they're about :)
