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

## Mission: Crew Headcount

Life support needs an exact headcount to calibrate oxygen levels. The manifest is stored in `crew.txt`, one name per line.

1. Count the crew from `crew.txt` using input redirection, so only the number appears — no filename beside it.
2. Save that clean count into a new file called `headcount.txt`, combining input and output redirection in a single command.
3. Create a folder called `life-support` and move `headcount.txt` into it.
4. Display the stored file to confirm it holds only the number.

**Expected result**

`life-support/headcount.txt` contains just the number `6`.
