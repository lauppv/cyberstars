A car doesn't go from 0 to 50 in one jump. It starts slowly, speeds up, and slows down again before it stops at the lights. A ball you throw is fastest when it leaves your hand. Movement in real life changes its speed, and a transition can too.

## The same time, different speeds

A transition takes the time you give it, but it doesn't have to move at the same speed all along. The **timing function** says how the speed changes. Here are four bars that each grow over 2 seconds. Point at the box to start them:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .bar {
    background-color: #ffd166;
    color: #0b1d3a;
    margin: 8px 0;
    padding: 4px;
    width: 90px;
  }

  /* show */
  .bar {
    transition: width 2s;
  }

  .box:hover .bar {
    width: 260px;
  }

  .linear {
    transition-timing-function: linear;
  }

  .ease-in {
    transition-timing-function: ease-in;
  }

  .ease-out {
    transition-timing-function: ease-out;
  }
  /* /show */
</style>
<div class="box">
  <p class="bar">ease</p>
  <p class="bar linear">linear</p>
  <p class="bar ease-in">ease-in</p>
  <p class="bar ease-out">ease-out</p>
</div>
```

All four end at the same moment, but they don't move the same way:

- `ease`, what you get when you write nothing: starts slowly, speeds up, slows down at the end.
- `linear`: the same speed from start to end. It looks a bit like a machine.
- `ease-in`: starts slowly and speeds up, like a car leaving the lights.
- `ease-out`: starts fast and slows down at the end, like a ball rolling to a stop. It feels quick, since the change shows at once.

`ease-in-out` is like `ease`, slow at both ends.

## A delay

A second time in a transition is a **delay**: how long it waits before it starts.

```css
.tile {
  transition: background-color 0.3s ease-out 0.1s;
}
```

Read it as: the background color changes over 0.3 seconds, fast then slower, after waiting 0.1 seconds. The first time is always how long it takes, the second how long it waits. A small delay keeps things calm when the mouse only passes over.

## Break it on purpose

Swap the two times: `transition: background-color 0.1s ease-out 0.3s`. Now the tile waits 0.3 seconds, then changes in a flash. Nothing warns you: both are valid times. When a transition feels slow to start and then jumps, check which time comes first.

---

## Mission: Calmer cards

When the mouse crosses the dashboard, every card it touches lights up for a moment. That's busy. The crew wants it calmer.

**Example**: the border of a card now waits a tenth of a second before it starts, then comes in fast and slows down at the end. A mouse that only passes over a card quickly hardly lights it.

- The border of every card comes in starting fast and slowing down at the end.
- It waits a tenth of a second (0.1 seconds) before it starts to change.
- The cards still get their border under the mouse.

Psst, the first time is how long it takes, the second how long it waits :)
