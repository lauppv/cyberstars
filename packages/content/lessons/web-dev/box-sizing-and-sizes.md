A paragraph takes the whole width of the page, whatever its text. That's fine for long text. But a card for one person, stretched across a huge screen, looks like a banner. Sometimes a box needs a size of its own.

## `width` and `height`

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  .member {
    background-color: #1e3a5f;
    padding: 16px;
    margin-bottom: 16px;
  }

  /* show */
  .member {
    width: 250px;
  }
  /* /show */
</style>
<div class="member">
  <h3>Sam Green</h3>
  <p>Plays chess on Sundays.</p>
</div>
<div class="member">
  <h3>Lea Park</h3>
  <p>Runs the card games.</p>
</div>
```

Each member box is now 250 pixels wide, however wide the page is. Its text wraps to fit.

`height` sets how tall a box is:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  .banner {
    background-color: #1e3a5f;
  }

  /* show */
  .banner {
    height: 120px;
  }
  /* /show */
</style>
<div class="banner">
  <h2>Welcome aboard</h2>
</div>
<p>The station goes round the Earth every 92 minutes.</p>
```

Use `height` with care. Most boxes should be as tall as what they hold, which is what they do by themselves. A fixed height on a box of text is a trap: write more text, and it no longer fits.

## Pixels or percent

`width` takes `%` too: a share of the space the box sits in.

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  .member {
    background-color: #1e3a5f;
    padding: 16px;
    margin-bottom: 16px;
  }

  /* show */
  .member {
    width: 50%;
  }
  /* /show */
</style>
<div class="member">
  <h3>Sam Green</h3>
  <p>Plays chess on Sundays.</p>
</div>
<div class="member">
  <h3>Lea Park</h3>
  <p>Runs the card games.</p>
</div>
```

Half of the space around it, whatever the screen. On a wide screen the box is wide, on a phone it's narrow.

## Break it on purpose

Give a box of text a small height:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  .member {
    background-color: #1e3a5f;
    padding: 16px;
    margin-bottom: 16px;
  }

  /* show */
  .member {
    height: 30px;
  }
  /* /show */
</style>
<div class="member">
  <h3>Sam Green</h3>
  <p>Plays chess on Sundays.</p>
</div>
<div class="member">
  <h3>Lea Park</h3>
  <p>Runs the card games.</p>
</div>
```

The text doesn't shrink: it spills out under the box, over whatever comes next. The box is 30 pixels tall as you asked, and the text doesn't care. Take the height away, and the box grows to hold it again.

---

## Mission: Card size

Your cards stretch across the whole page. A card for one person doesn't need to be that wide.

**Example**: each card is narrower, about the width of a postcard, and its text wraps inside it.

- Every card is between 200 and 300 pixels wide.

Psst, leave the height alone: the card grows with its text :)
