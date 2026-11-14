When a video goes too fast to see what happened, you pause it, look at the frame, then play it on. Code runs much faster than any video: thousands of lines in a blink. The browser can pause it too, on a line you choose, and show you every value at that moment.

## A number that's wrong

Sometimes the page shows a number, it looks believable, and it's wrong. No error in the console: the code ran, it just did the wrong thing. Reading it again doesn't always help, since you read what you meant to write. You need to watch it run.

## The browser's DevTools

Every browser has tools for developers built in. Press **F12** (or right-click the page and pick **Inspect**). A panel opens. The **Console** tab you know already. The **Sources** tab shows the code the page runs.

Your site runs in the preview, a page inside the lesson's page. In Sources, look for your file's name in the list on the left, like `crew-total.js`, and click it.

The preview adds a few words to your loops, like `__cyberstars.t(3)`, so an endless loop can be stopped. Ignore them: your lines are where you wrote them.

## A breakpoint

Click a line's number in Sources: a blue mark appears. That's a **breakpoint**. Now draw the page again (press Ctrl+Enter in the lesson's editor). When the code reaches that line, everything stops, before the line runs:

- The line is lit up.
- Rest the mouse on a variable to see its value right now.
- The **Scope** part on the right lists every variable the code can see, with its value.

Press the **Resume** button (▶, or F8) to let the code run on, to the next breakpoint or to the end. Click the blue mark again to remove it.

A breakpoint inside a loop stops on every turn. Watch the loop's counter turn by turn, and you'll see where it starts and where it ends.

## Break it on purpose

Stop inside a loop, then wait more than two seconds before you press Resume. The preview stops any loop that runs longer than two seconds, and the time you spent looking counts too, so the console says the loop was stopped. Remove the breakpoint and press Ctrl+Enter to draw the page again. Then put a breakpoint on a line that never runs, like inside an `if` that's false: the code never stops, which tells you something too.

---

## Mission: The missing crew

The lesson brings a file, `crew-total.js`, whose function adds up the crew of every starship. It has a bug. The tracker should use it, once it's fixed.

**Example**: under the docked starships, a line:

```text
People on all starships: 24
```

Aurora's 4, Comet Runner's 6, Lunar Ferry's 2, Red Horizon's 5 and Silver Gull's 7 make 24. Before the fix, the line says less.

- Between `#docked-now` and the list `ships`, a paragraph with the id `crew-total`. Once the starships are in, it says `People on all starships: ` and what the function of `crew-total.js` gives for them.
- `crew-total.js` adds up every starship's crew, the first one too. Find the bug with a breakpoint, and fix it in that file.

Psst, watch which places of the list the loop's counter visits :)
