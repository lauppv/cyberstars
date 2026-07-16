`cat` shows a whole file at once; `head` and `tail` show the ends. But what if you
want to **scroll** through a long file at your own pace, up and down?

That is the job of **less**.

```bash
less bigfile.log
```

`less` opens the file in a **viewer**. It does not dump everything — it shows one
screenful and waits for you. Inside the viewer you can:

| Key            | Action                            |
| -------------- | --------------------------------- |
| `Space` or `f` | next page                         |
| `b`            | previous page                     |
| arrow keys     | line up / down                    |
| `/word`        | search forwards for _word_        |
| `q`            | **quit** and return to the prompt |

The most important key is **`q`** — that is how you leave `less` and get your shell
back.

### Why "less"?

There was an older tool called `more` that could only page **forwards**. `less` does
everything `more` does _and_ lets you scroll **backwards** — hence the joke name:
"less is more".

`less` never changes the file. It is a pure viewer.

> In this training sandbox the scrolling viewer is limited, so practise the _idea_
> with `cat` — but on a real Linux system, reach for `less` whenever a file is too
> long for one screen.

---

## Mission: Review and Archive the Operations Manual

The station's operations manual has been updated and saved to `manual.txt`. You need to review it and keep a copy on file. (On a real system you would scroll through it page by page; in this sandbox the scrolling viewer is limited, so display the file instead.)

1. Display the whole manual to review its chapters.
2. Count **how many lines** the manual has.
3. Create a folder called `manuals` and copy `manual.txt` into it as `manual-archive.txt`.
4. Confirm the archived copy by displaying its contents.

**Expected result**

The full manual appears, you learn its line count, and the `manuals` folder holds a faithful copy of it.
