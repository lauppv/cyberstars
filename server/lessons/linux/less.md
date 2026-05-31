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

## Mission: Review the Operations Manual

The station's operations manual has been updated and saved to `manual.txt`. You need to review its contents. In this sandbox, use `cat` to display the file (on a real system you would use `less` to scroll through it page by page).

Display the contents of `manual.txt`.

**Expected result**

The full text of the operations manual appears in your terminal.
