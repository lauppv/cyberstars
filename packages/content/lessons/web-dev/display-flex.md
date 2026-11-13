Look at the top of almost any website: the site's name is on the left, and the menu sits on the same line, next to it. Your pages put the menu under the name instead. That's because `<p>` and `<nav>` are blocks, and a block takes a whole row of its own. One line of CSS can put them side by side.

## `display: flex`

Give a parent element `display: flex`, and its children stand side by side, in a row. The parent is now a **flex container**: a box that lines up its children. Each of its children is a **flex item**.

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .day {
    background-color: #1e3a5f;
    padding: 4px 12px;
    margin: 4px;
  }

  /* show */
  .week {
    display: flex;
  }
  /* /show */
</style>
<div class="week">
  <p class="day">Monday: football</p>
  <p class="day">Tuesday: chess</p>
  <p class="day">Wednesday: music</p>
</div>
```

The three days of a school club stand in a row, and each one is only as wide as its words. Remove `display: flex` and look: each day takes a whole row again, one under the other.

## Only the children

`display: flex` changes where the container's own children sit. What is inside each child stays as it was:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .day {
    background-color: #1e3a5f;
    padding: 4px 12px;
    margin: 4px;
  }

  /* show */
  .week {
    display: flex;
  }
  /* /show */
</style>
<div class="week">
  <div class="day">
    <h3>Monday</h3>
    <p>Football at 16:00</p>
  </div>
  <div class="day">
    <h3>Tuesday</h3>
    <p>Chess at 15:30</p>
  </div>
</div>
```

The two days stand side by side, because they are the children of `.week`. Inside each day, the heading is still above its line of text: those are the children of `.day`, and `.day` is not a flex container.

## Break it on purpose

Give `display: flex` to the days instead of their parent:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .day {
    background-color: #1e3a5f;
    padding: 4px 12px;
    margin: 4px;
  }

  /* show */
  .day {
    display: flex;
  }
  /* /show */
</style>
<div class="week">
  <div class="day">
    <h3>Monday</h3>
    <p>Football at 16:00</p>
  </div>
  <div class="day">
    <h3>Tuesday</h3>
    <p>Chess at 15:30</p>
  </div>
</div>
```

The days are one under the other again. But inside each day, the heading and its text now stand side by side. Flex lines up the children of the element you give it to. To put the days in a row, give it to their parent.

---

## Mission: The header on one line

Every page of your site starts with its header: the station's name, and the menu under it.

**Example**: at the top of every page, the name and the menu share one line:

```text
Orbital Station 7  Home  Crew  Schedule  Boarding  Wiki
```

- On every page, the station's name and the main menu stand side by side in the header.
- The rest of each page stays as it was. On the home page, the "On this page" menu still has its links in the middle.
- On a phone too, nothing sticks out sideways.

Psst, the name and the menu are the children of the header :)
