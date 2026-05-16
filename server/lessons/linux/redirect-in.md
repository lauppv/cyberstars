Output redirection (`>`, `>>`) controls where output **goes**. Input redirection (`<`)
controls where input **comes from**.

The pattern is: `COMMAND < FILE`.

Some commands read from **standard input** (stdin) — the keyboard by default. With `<`
you can feed them a file instead:

```bash
wc -l < manifest.txt
```

```text
5
```

Here `wc -l` counts lines. Instead of typing lines on the keyboard, it reads them from
`manifest.txt`. Note that the filename is **not** shown in the output — that is the
subtle difference from `wc -l manifest.txt` (which prints the name alongside the
count).

### When is `<` useful?

Many commands accept filenames as arguments directly, so `<` is not always required. It
becomes valuable when:

- A program only reads stdin (no filename argument).
- You want to hide the filename from the output.
- You are combining `<` with `>` in one command: `sort < unsorted.txt > sorted.txt`.

---

The file `crew.txt` lists crew members, one per line. Use **input redirection** (`<`)
to count how many lines it has with `wc -l`. The output should show only the number,
with no filename.
