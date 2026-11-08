You've built the whole skeleton of a page: headings in order, paragraphs and line breaks, words that stand out, comments, links and pictures. This mission puts them together, the way a real page asks for them: all at once.

Before you start, a few things worth checking as you go:

- **One `h1`**, then levels without gaps. A new section of the page is a new `h2`.
- **Text lives in paragraphs**, and `<br>` only breaks lines that belong together.
- **`strong` and `em` say what the words mean**, not how they look.
- **An `id` is unique** on the page, and a link to it starts with `#`.
- **Every picture has an `alt`**, empty only for decoration.

When something doesn't look right, check the tags close in the order they opened, and that every comment ends with `-->`.

---

## Mission: Visiting Hours

The station opens to visitors. Give them a section of their own.

- After the shifts and before your email link, add a section heading **Visiting Hours**, with the id `visiting`.
- Right under it, the hours in one paragraph, on three lines:

```text
Monday to Friday: 10:00 to 16:00
Saturday: 10:00 to 12:00
Sunday: closed
```

- Under the hours, a paragraph that says **Visitors must wear a badge**, marked as important.
- In the paragraph with your **Jump to today** link, add a second link that says **Visiting hours** and jumps to the new section.
- Above the new section, leave a comment for the crew saying what it holds.
