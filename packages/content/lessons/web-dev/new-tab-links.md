You're reading a recipe online and it links to "how to whisk eggs". You click it, read, and then... where was the recipe? If the link opened in a **new tab**, the recipe is still there in its own tab, waiting for you.

## `target="_blank"`

Add the `target` attribute with the value `_blank`, and the link opens in a new tab:

```html
<a href="https://en.wikipedia.org/wiki/Chess" target="_blank">Read about chess</a>
```

The link looks exactly the same. Only what happens on the click changes: a new tab opens with the other site, and your page stays open in its own tab.

A link can have several attributes. They all go in the opening tag, one after the other, with a space between them. Their order doesn't matter.

## `rel="noopener"`

When you add `target="_blank"`, add `rel="noopener"` next to it:

```html
<a href="https://en.wikipedia.org/wiki/Chess" target="_blank" rel="noopener">Read about chess</a>
```

Without it, the page in the new tab can reach back to your tab and change it, for example send it to a fake copy of your site. New browsers protect you anyway, but old ones don't. `noopener` cuts that connection.

## When to use it

A new tab is good for a link to **another site**, when you want the visitor to come back to your page afterwards.

For links between your own pages, keep the same tab. Visitors expect that, and the browser's Back button then works as they think it will. Opening every link in a new tab leaves people with a pile of tabs they never asked for.

## Break it on purpose

Write `target="blank"`, without the `_`:

```html
<a href="https://en.wikipedia.org/wiki/Chess" target="blank">Read about chess</a>
```

The first click seems to work: it opens a new tab. But that tab is now called "blank", and every other link with `target="blank"` opens in that **same** tab, replacing whatever was there. The `_` matters.

---

## Mission: Stay on the page

Your `index.html` has a link to a page about space stations. A visitor who follows it shouldn't lose your station's page.

**Example**: the link looks the same as before. When clicked on a real website, the other site opens in a new tab and your page stays open.

- The link to the other site opens in a new tab.
- It also has `rel="noopener"`.

Psst, it's `_blank`, with the underscore :)
