A long page on a phone means a lot of scrolling. That's why many pages have a small table of contents at the top: tap "Opening hours" and the page jumps straight there. Those are **jump links**: links to another place on the same page.

## Give the place a name: `id`

First, the place you jump to needs a name. You give it one with the `id` attribute:

```html
<h2 id="rules">Club Rules</h2>
```

An id is a name for **one** element on the page, like a name tag:

- no two elements of a page can have the same id;
- an id has no spaces. Use `-` between words: `id="club-rules"`.

The id doesn't change how the heading looks. It's only a name.

## Link to it with `#`

Then a link whose `href` is `#` followed by the id:

```html
<p><a href="#rules">See the rules</a></p>

<h2>Members</h2>
<p>...</p>

<h2 id="rules">Club Rules</h2>
<p>...</p>
```

Click **See the rules** and the page scrolls straight down to the Club Rules heading. The `#` means "a place on this page".

You'll see `id` again soon: CSS and JavaScript use it to find an element by its name.

## Break it on purpose

Make the names not match:

```html
<p><a href="#rule">See the rules</a></p>
<h2 id="rules">Club Rules</h2>
```

`rule` isn't `rules`, so the click finds nothing and the page doesn't move. The names must be exactly the same, including capital letters: `#Rules` doesn't find `id="rules"` either.

And leave out the `#`:

```html
<a href="rules">See the rules</a>
```

Now the browser looks for a page called `rules` on your site instead of a place on this one.

---

## Mission: Jump to today

Your `index.html` is getting long. Someone on a phone wants to see what's happening on board today without scrolling past everything.

**Example**: near the top of your page:

```text
Welcome aboard

...

Jump to today        (a link; a click scrolls down to Today on Board)
```

- The Today on Board heading has the id `today`. Later lessons use this name.
- Under your first paragraphs, before the first part, a link jumps to it.

Psst, the id has no `#`, the link's `href` does :)
