The web is called a web because pages lead to one another, like threads in a spider's web. You read about a game, click its name, and you're on the game's own site. What takes you there is a **link**.

## The `<a>` tag

A link is an `a` element. The `a` stands for **anchor**:

```html preview
<a href="https://en.wikipedia.org/wiki/Chess">Read about chess</a>
```

It has two parts:

- the `href` attribute says **where** the link leads. Here it's a **full address**: it starts with `https://`, then the site's name, then the page on it;
- the words between the tags are what the visitor **sees and clicks**.

Browsers show links blue and underlined, so people know they can click them.

A link is **inline**, like `<strong>`: it goes inside a paragraph, as part of a sentence:

```html preview
<p>New to the game? <a href="https://en.wikipedia.org/wiki/Chess">Read about chess</a> before you start.</p>
```

In your preview, a link to another site doesn't open. The console tells you where it would go instead. On a real website, it opens the page.

## Words that say where it leads

Compare these two:

```html preview
<p>To learn the rules, <a href="https://en.wikipedia.org/wiki/Chess">click here</a>.</p>
<p>Learn the <a href="https://en.wikipedia.org/wiki/Chess">rules of chess</a>.</p>
```

Both work. But a screen reader can list all the links on a page, without the sentences around them. Ten links all called "click here" tell the listener nothing. "Rules of chess" says exactly where it goes. Search engines read link words too.

## Break it on purpose

Leave out the `https://`:

```html preview
<a href="en.wikipedia.org/wiki/Chess">Read about chess</a>
```

Now the browser doesn't know it's another site. It looks for a file called `en.wikipedia.org` inside **your** site, and finds nothing. Links to other sites always need the full address.

Forget the closing `</a>` and everything after it turns into one long link. Try it, then close it.

---

## Mission: Learn more

Your `index.html` has its About the Station part. Some visitors want to know how real space stations work. Send them somewhere to read about it.

**Example**: your page would show something like this:

```text
Curious how real stations work? Read about space stations        ("Read about space stations" is a link)
```

- A paragraph has a link to a page on another site, with a full address that starts with `https://`.
- The link's words say where it leads.

Psst, the address goes in `href`, the words to click go between the tags :)
