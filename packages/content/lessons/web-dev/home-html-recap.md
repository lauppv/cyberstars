No new theory, just a challenge that uses what you've learned so far: headings at the right level, paragraphs and line breaks, `<strong>`, comments, jump links and `id`.

You know every piece already. This time nobody tells you which tag to use for what: read what the visitors need, and pick the tags yourself.

If something looks wrong in the preview, check two things first: does every tag close, in the order it opened? Does every comment end with `-->`?

---

## Mission: Visiting Hours

The station is opening to visitors. They need a part of their own on your home page: Visiting Hours. It goes after Today on Board and before the Station Rules.

**Example**: that part of your page would show something like this:

```text
Visiting Hours

Monday to Friday: 10:00 to 16:00
Saturday: 10:00 to 12:00
Sunday: closed

Visitors must wear a badge at all times.      ("Visitors must wear a badge" in bold)
```

- A new part with the heading Visiting Hours, at the same level as Today on Board, with the id `visiting`.
- Under the heading, the opening hours in one paragraph, each day on its own line: at least three lines.
- Right after the hours, a paragraph with a rule visitors must not miss, its important words in `<strong>`.
- In the same paragraph as your Jump to today link, a second link that jumps to Visiting Hours.

Psst, two ids on one page must never be the same :)
