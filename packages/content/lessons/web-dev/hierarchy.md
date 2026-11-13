On a cinema's website, the "Buy tickets" button is big and bright. "Cancel" is small and plain. Your eye goes first to what matters most. This is called **hierarchy**: the most important thing on the page stands out the most, and the rest is quieter.

## Size, color, weight

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  /* show */
  .main {
    background-color: orange;
    color: #0b1d3a;
    font-size: 1.25rem;
    font-weight: bold;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
  }

  .quiet {
    background-color: transparent;
    color: #c9d6ea;
    padding: 8px 16px;
    border: 1px solid #2c4a7a;
    border-radius: 8px;
  }
  /* /show */
</style>
<button class="main">Join the team</button>
<button class="quiet">Maybe later</button>
```

Which one do you see first? "Join the team" wins in every way: bigger letters, a bright background, bold, more room inside. "Maybe later" is still easy to read, but it doesn't ask for your attention. Its background is `transparent`, a color you can see through, so the page shows behind its words.

## The more harm a button can do, the quieter it is

A button that throws away all your work should never be the one you press by mistake. Make it smaller and calmer than the main one, but keep it readable: a contrast of at least 4.5:1, like any text.

## Break it on purpose

Make both buttons loud:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  /* show */
  .main,
  .quiet {
    background-color: orange;
    color: #0b1d3a;
    font-size: 1.25rem;
    font-weight: bold;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
  }
  /* /show */
</style>
<button class="main">Join the team</button>
<button class="quiet">Maybe later</button>
```

Now where does your eye go? Nowhere in particular. When everything stands out, nothing does.

---

## Mission: Book my seat first

Your form ends with two buttons that look the same: Book my seat and Clear the form. One sends the booking, the other throws it all away.

**Example**: Book my seat is the brightest, biggest thing in the form: large letters, colors of its own, easy to press. Clear the form is smaller and calm, but you can still read it.

- Book my seat has text of at least 18 pixels, is at least 44 pixels tall, and has colors unlike Clear the form's.
- Clear the form keeps its text at 16 pixels or less, the size of the labels.
- The text of both buttons has a contrast of at least 4.5:1 with its background.

Psst, CSS can pick a button by its `type` :)
