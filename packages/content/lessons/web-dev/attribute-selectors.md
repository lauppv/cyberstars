A selector can also pick elements by their **attributes**: what's written inside their opening tags.

## Attribute selectors

```css
[title] { }                   /* has a title attribute */
input[type="email"] { }        /* type is exactly "email" */
a[href^="https://"] { }        /* href starts with "https://" */
img[src$=".svg"] { }           /* src ends with ".svg" */
a[href*="station"] { }         /* href contains "station" */
```

- `[name]`: the attribute is there, whatever its value.
- `[name="value"]`: exactly that value.
- `^=` starts with, `$=` ends with, `*=` contains.

They're perfect for things the HTML already says. Your links to other sites all start with `https://`, your email links with `mailto:`: style them by that, and every new link of that kind is styled without anyone remembering a class.

Values go in quotes. An attribute selector counts as much as a class when two rules compete.

---

## Mission: Telling Links Apart

- Links to other sites, whose address starts with `https://`, are `#ffd166`.
- Email links, starting with `mailto:`, are underlined with a dotted line.
- Column headers, those with `scope="col"`, line up their text on the left.
- A table cell that spans several columns is in italics.
