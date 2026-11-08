A selector can also pick elements by their **attributes**: what's written inside their opening tag.

## Attribute selectors

```css
[title] { }                   /* has a title attribute */
input[type="email"] { }        /* type is exactly "email" */
a[href^="https://"] { }        /* href starts with "https://" */
img[src$=".svg"] { }           /* src ends with ".svg" */
a[href*="station"] { }         /* href contains "station" */
```

- `[name]`: the element has the attribute, whatever its value.
- `[name="value"]`: exactly that value.
- `^=` means starts with, `$=` ends with, `*=` contains.

They're perfect for things the HTML already says. Style elements by what their attributes say, and every new element of that kind gets the style too, without anyone having to remember a class.

Put the values in quotes. When two rules compete, an attribute selector counts as much as a class.

---

## Mission: Telling Links Apart

Visitors should see what a link does before they click it. Style the links by what their addresses say, so every new link gets its look by itself:

- Links that lead to another site look different from the links inside your own site, and stay easy to read.
- Links that start an email are underlined with a dotted line. The other links keep a solid one.
- On the schedule, the headers that name a column line their text up on the left.
- A table cell that stretches over several columns is in italics. The other cells aren't.
