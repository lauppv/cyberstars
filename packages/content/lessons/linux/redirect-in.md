Output redirection (`>`, `>>`) controls where output goes. Input redirection (`<`)
controls where input comes from.

The pattern is: `COMMAND < FILE`.

Some commands read from **standard input** (stdin), the keyboard by default. With `<`
you can feed them a file instead:

```bash
wc -l < manifest.txt
```

```text
5
```

Here `wc -l` counts lines. Instead of typing lines on the keyboard, it reads them from
`manifest.txt`. Note that the filename is not shown in the output. That is the
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

Life support needs an exact headcount to calibrate the oxygen. The crew manifest is `crew.txt`, one name per line. Save the count to `life-support/headcount.txt`: the number alone, with no file name beside it, made by a command that reads the manifest as its input.

**Expected result**

`life-support/headcount.txt` holds a single number and nothing else.
