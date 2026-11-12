Look at the buttons and cards in the apps on your phone. Hardly any have sharp corners: they're slightly rounded, like a bank card or a phone itself. Rounded corners feel softer and friendlier.

## `border-radius`

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
    border-radius: 12px;
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

Each corner of the box becomes a curve. The number is the size of the curve: the bigger it is, the rounder the corner.

It rounds everything: the background, the border, and the box's shadow, as you'll see soon. A box with no background or border doesn't show any change, since there's nothing to round.

## Values to try

- `4px`: barely rounded, like a ticket;
- `12px`: a soft card;
- `50%`: on a square box, a full circle. Half the box's size rounds each corner all the way.

## One corner at a time

Each corner has its own property, like `border-top-left-radius`, or four values in one, going round the clock from the top left:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  .tab {
    display: inline-block;
    padding: 8px 16px;
    background-color: #1e3a5f;
  }

  .panel {
    padding: 16px;
    background-color: #1e3a5f;
  }

  /* show */
  .tab {
    border-radius: 12px 12px 0 0;
  }
  /* /show */
</style>
<div class="tab">Games</div>
<div class="panel">Chess, cards and puzzles.</div>
```

Rounded at the top, square at the bottom, like a folder's tab.

## Break it on purpose

Give a card a huge radius: `border-radius: 200px`. The card turns into a pill, and the text near its corners now sits outside the rounded shape, cut by the curve. Round, but not too round: the padding should still be bigger than the curve.

---

## Mission: Soft corners

Your cards and your duty board are boxes with sharp corners.

**Example**: every card and the duty board have softly rounded corners.

- Every card's corners are rounded by at least 8 pixels.
- The duty list's corners are rounded by at least 8 pixels.

Psst, `border-radius` rounds all four corners at once :)
