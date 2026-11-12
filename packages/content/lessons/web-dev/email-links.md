On a shop's website there's often a "Contact us" link at the bottom. Click it and your email app opens, with a new message already addressed to the shop. You just type and send. That's an email link.

## `mailto:`

It's a normal `<a>` link, but its `href` starts with `mailto:` and then the email address:

```html preview
<p><a href="mailto:club@school.example">Write to the chess club</a></p>
```

When you click it, instead of opening a page, the browser opens the email app with a new message to `club@school.example`.

In your preview, the console tells you where the email would go.

## Words for an email link

As with any link, the words should say what happens: "Write to the chess club", "Email us". Some sites show the address itself as the words, so people can also copy it:

```html preview
<p>Questions? Write to <a href="mailto:club@school.example">club@school.example</a>.</p>
```

Both are fine.

## Break it on purpose

Forget the `mailto:`:

```html preview
<a href="club@school.example">Write to the chess club</a>
```

Now the browser thinks `club@school.example` is a file on your site and tries to open it. No email app, just a page that isn't there. The `mailto:` is what tells the browser "this is an email address". Note that there are no `//` after it, unlike `https://`.

---

## Mission: Write to the crew

Your `index.html` ends with the Station Rules. Visitors with a question should be able to write to the crew.

**Example**: the end of your page would show something like this:

```text
Write to the crew        (a link)
```

- At the end of the page, a link starts an email to `crew@station.example`.
- The link's words say that it's for writing to the crew.

Psst, `mailto:` and then the address, with no spaces and no `//` :)
