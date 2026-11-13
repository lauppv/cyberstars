You want to explain HTML to a friend, on a page: "a paragraph starts with `<p>`". But the browser reads `<p>` as a real tag. It starts a paragraph, and the `<p>` you wanted to show is gone. How do you show a `<` on a page?

## `&lt;` and `&gt;`

An **entity** is a short code that the browser shows as a sign. It starts with `&` and ends with `;`:

- `&lt;` shows `<` ("lt" is for **l**ess **t**han);
- `&gt;` shows `>` ("gt" is for **g**reater **t**han).

```html preview
<p>A paragraph starts with &lt;p&gt; and ends with &lt;/p&gt;.</p>
```

The page shows the tags as text: "A paragraph starts with <p> and ends with </p>." The browser never sees a real tag, only the signs.

## `&amp;`

Now `&` itself is special: it starts an entity. To show an `&`, write its entity, `&amp;`:

```html preview
<h2>Rock &amp; Roll Club</h2>
<p>We meet in Room 4 &amp; Room 5.</p>
```

The page shows "Rock & Roll Club" and "Room 4 & Room 5".

A lone `&` often shows fine, when the browser sees that no entity starts there. But not always: if the letters after it are an entity's name, you get a sign instead. Try this one:

```html preview
<p>Our café &copy shop is open.</p>
<p>Our café &amp;copy shop is open.</p>
```

`&copy` is the entity for ©, so the first line shows "café © shop". Only `&amp;` is always an `&`.

## Break it on purpose

Write the tags as they are:

```html preview
<p>A paragraph starts with <p> and ends with </p>.</p>
```

The sentence falls into pieces on three lines, and the tags you wanted to show are gone. The browser made them real paragraphs.

---

## Mission: HTML on a wiki page

The crew wants to add their own pages to the wiki. And Tomas Okafor, the engineer, is writing a new page.

**Example**: the wiki's page shows, after the two entries:

```text
Tools & Spare Parts
Coming soon: everything we need to fix the station, and where to find it.

To add a page to the wiki, copy an entry from <article> to </article> and change its words.
```

- The wiki's list has a third entry, `Tools & Spare Parts`, with a sentence that says it is coming soon. It has no link yet.
- Under the list, a line tells the crew how to add a page to the wiki, showing the tags `<article>` and `</article>` on the page, signs and all.

Psst, each entity ends with a `;` :)
