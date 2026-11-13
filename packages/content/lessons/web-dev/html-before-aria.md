A real light switch does everything by itself: you can see it, feel it in the dark, and press it. A drawing of a switch on the wall, with a label that says "switch", looks like one, but nothing happens when you press it. On a web page, you can draw a button too. It's much better to use a real one.

## ARIA

Screen readers read a page out loud for people who can't see it. They tell what each thing is: "heading", "link", "button". They know it from the tags: `<button>` is a button, `<nav>` a menu.

**ARIA** is a set of attributes that tell a screen reader more. You've used two of them: `aria-label` gives a name, and `aria-expanded` says whether a menu is open. One more, `role`, says what an element **is**:

```html
<div role="button">Save</div>
```

A screen reader now says "Save, button". But that's all `role` does.

## A role is only a word

Compare the two in a page. Press Tab to move from one to the next:

```html preview
<div role="button" onclick="alert('Saved with the div')">Save (a div)</div>
<button type="button" onclick="alert('Saved with the button')">Save (a button)</button>
```

What happens?

- Tab jumps straight to the real button. The `div` is never reached: a keyboard can't use it at all.
- On the real button, Enter and Space press it. On the `div`, nothing.
- The `div` doesn't even look like something to press.

The real `<button>` brings all of this with it: the focus, the keys, the look, and the word "button" for the screen reader. To give the `div` the same, you'd need several attributes and a script, and it's easy to forget one. `onclick` here is only to make the example short.

## HTML first

So the first rule of ARIA is: **don't use ARIA when HTML has a tag for it.** A button is `<button>`, a link `<a>`, a list `<ul>`, a heading `<h2>`. ARIA is for what HTML can't say, like whether a menu is open right now.

## Break it on purpose

Write a button without `type="button"` inside a form. It's a submit button by default, so pressing it sends the form. Outside a form nothing is sent, but writing `type="button"` says clearly: this button only does what a script tells it.

Then try the `div` with the keyboard again, after giving it a background so it looks like a button. It looks right, and it's still out of reach. Looking like a button isn't being one.

---

## Mission: The settings page

Visitors want to choose how the station's website looks. They'll do it on a new page: the settings.

**Example**: a new page, `settings.html`, that looks like the other pages: the header with the station's name and the Menu button, a heading such as "Settings", then a part with a heading "Theme" and three buttons: Light, Dark and System. Then the footer.

- `settings.html` is a whole page like the others: in English, with a name for its tab, the site's `style.css`, the same header and footer as every page, and its content in `<main>` with one biggest heading. Its menu opens from the Menu button.
- In its main part, a heading, then a box with the id `theme-buttons` holding three real buttons, with the ids `theme-light`, `theme-dark` and `theme-system`, that say `Light`, `Dark` and `System`. Each one can be reached with the keyboard, and pressing it sends no form.
- Every page's menu has a link to `settings.html`, the commander's page too.

Psst, the commander's page is in a folder, so its link goes up a level :)
