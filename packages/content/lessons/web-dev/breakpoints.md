When does a T-shirt get too small? Not on your 12th birthday, or at a size written on a chart. It's too small the day it doesn't fit you any more. You find out by trying it on. The width where a page needs another layout works the same way.

## A breakpoint

The width in a media query is called a **breakpoint**: the point where the page "breaks" and needs other rules. Which number should it be?

It's tempting to pick a phone's width, like 375, or a tablet's, like 768. But there are hundreds of phones and tablets, and every one is a bit different. And on a computer, people make windows of every width.

So don't ask "how wide is a phone?". Ask "at what width does my page stop looking good?".

## Finding it

Here is a page with a text and a box of facts side by side:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .story,
  .facts {
    background-color: #1e3a5f;
    padding: 16px;
    margin: 0;
  }

  /* show */
  .page {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 12px;
  }
  /* /show */
</style>
<div class="page">
  <p class="story">Our football team won the city cup. The final was hard: we were losing 1 to 0 until the last ten minutes. Then Sam scored twice, and everybody ran onto the pitch.</p>
  <p class="facts">Goals: 2. Players: 11. Fans: 300.</p>
</div>
```

Make your preview's panel narrower, slowly, and watch the facts box. At some width it gets so thin that "Players: 11." breaks into pieces. That's where this page breaks. Say it happens when the facts box gets narrower than about 140 pixels. The facts box is one third of the room, so that's a page of about 450 pixels: our breakpoint is 450, whatever phone that is.

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .story,
  .facts {
    background-color: #1e3a5f;
    padding: 16px;
    margin: 0;
  }

  /* show */
  .page {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 12px;
  }

  @media (max-width: 450px) {
    .page {
      grid-template-columns: 1fr;
    }
  }
  /* /show */
</style>
<div class="page">
  <p class="story">Our football team won the city cup. The final was hard: we were losing 1 to 0 until the last ten minutes. Then Sam scored twice, and everybody ran onto the pitch.</p>
  <p class="facts">Goals: 2. Players: 11. Fans: 300.</p>
</div>
```

## Working out the number

You can work the breakpoint out too. Say two columns side by side each need 300 pixels, with a gap of 20 between them. Together that's 300 + 20 + 300 = 620 pixels of content. Add the page's padding on both sides, and you have the window's width where the two still fit. One pixel less, and they should go one under the other.

## Break it on purpose

Pick a breakpoint that's too small: 300. Between 300 and 450 pixels, the facts box is a thin strip again, and the media query hasn't started yet. Pick one that's too big, like 900, and a wide window that had plenty of room shows one column with long, empty lines. A breakpoint too early or too late both look broken: try the widths around yours.

---

## Mission: The width where the videos get small

The videos side by side look good until each panel gets narrower than 360 pixels. Under that, they're too small to watch.

**Example**: in a window 800 pixels wide, the pad camera and the last launch stand side by side, each panel at least 360 pixels wide. In a window 760 pixels wide, all the panels stand one under the other.

- Work out the breakpoint yourself: the panels stand side by side as long as each of the two video panels can be at least 360 pixels wide.
- Narrower than that, the panels stand one under the other, and nothing sticks out sideways.

Psst, the page has 16 pixels of padding on each side, and the panels have a gap of their own :)
