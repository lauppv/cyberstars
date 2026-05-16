`cat` shows a whole file at once; `head` and `tail` show the ends. But what if you
want to **scroll** through a long file at your own pace, up and down?

That is the job of **less**.

```bash
less bigfile.log
```

`less` opens the file in a **viewer**. It does not dump everything — it shows one
screenful and waits for you. Inside the viewer you can:

| Key | Action |
|-----|--------|
| `Space` or `f` | next page |
| `b` | previous page |
| arrow keys | line up / down |
| `/word` | search forwards for *word* |
| `q` | **quit** and return to the prompt |

The most important key is **`q`** — that is how you leave `less` and get your shell
back.

### Why "less"?

There was an older tool called `more` that could only page **forwards**. `less` does
everything `more` does *and* lets you scroll **backwards** — hence the joke name:
"less is more".

`less` never changes the file. It is a pure viewer.

> In this training sandbox the scrolling viewer is limited, so practise the *idea*
> with `cat` — but on a real Linux system, reach for `less` whenever a file is too
> long for one screen.

---

A long file `manual.txt` is in your home directory. Use **cat** to display it (on a
real system you would open it with `less` and scroll). Confirm you can see its
contents.
