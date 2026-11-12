`cat` shows a whole file at once; `head` and `tail` show the ends. But what if you
want to scroll through a long file at your own pace, up and down?

That is the job of **less**.

```bash
less bigfile.log
```

`less` opens the file in a viewer. It does not dump everything. It shows one
screenful and waits for you. Inside the viewer you can:

| Key            | Action                        |
| -------------- | ----------------------------- |
| `Space` or `f` | next page                     |
| `b`            | previous page                 |
| arrow keys     | line up / down                |
| `/word`        | search forwards for _word_    |
| `q`            | quit and return to the prompt |

The most important key is **`q`**: that is how you leave `less` and get your shell
back.

### Why "less"?

There was an older tool called `more` that could only page forwards. `less` does
everything `more` does _and_ lets you scroll backwards, hence the joke name:
"less is more".

`less` never changes the file. It is a pure viewer.

> In this training sandbox the scrolling viewer is limited, so practise the _idea_
> with `cat`, but on a real Linux system, reach for `less` whenever a file is too
> long for one screen.

---

## Mission: Review and Archive the Operations Manual

The operations manual in `manual.txt` has been updated. On a real system you would page through it; this sandbox's pager is limited, so read it in one go with a command from earlier lessons. Find out how many lines long it is, then archive it as `manuals/manual-archive.txt`.

**Expected result**

You have read the whole manual, you know its number of lines, and the archived copy reads like the original.
