The light on a charging phone breathes: it glows, fades, glows again, for as long as the phone charges. A swing goes forward and back, forward and back. Some movements don't happen once: they go on. An animation can go on too.

## How many times

By default, an animation plays once. `animation-iteration-count` says how many times it plays: a number, or `infinite`, for ever:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .heart {
    display: inline-block;
    font-size: 3rem;
  }

  /* show */
  .heart {
    animation: beat 1s infinite;
  }

  @keyframes beat {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1.3);
    }
  }
  /* /show */
</style>
<p class="heart">❤</p>
```

The heart grows over one second, then jumps back to its size and grows again, for ever. In the short way, `infinite` goes after the time: `animation: beat 1s infinite`.

The jump back looks hard: every second, the heart snaps from big to small at once.

## Back and forth

`animation-direction: alternate` plays the animation one way, then backwards, then forwards again:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .heart {
    display: inline-block;
    font-size: 3rem;
  }

  /* show */
  .heart {
    animation: beat 1s infinite alternate;
  }

  @keyframes beat {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1.3);
    }
  }
  /* /show */
</style>
<p class="heart">❤</p>
```

Now the heart grows for a second, then shrinks for a second, and so on: a soft beat, with no jump. Each way takes the animation's time, so a whole beat, there and back, takes two seconds.

## Use it gently

Something that moves all the time pulls the eye, again and again. That's good for one small thing that matters, like a "live" sign. For a whole page full of moving things, it's tiring. Some people even feel sick from movement on a screen: later in this part, we'll stop it for them.

## Break it on purpose

Write `animation: beat infinite 1s alternate;`, with the words in another order. It still works: the browser knows which word is which. Now write `animation: beat 1s infinte alternate;`, with a letter missing. The browser doesn't understand the whole line, throws it away, and the heart stands still. When an animation doesn't start, read its line letter by letter.

---

## Mission: A live sign that breathes

The LIVE label fades in once, then stands still. A real live sign keeps moving softly, so the crew sees at a glance that the camera is on.

**Example**: the LIVE label goes from fully there to faint in one second, then back to fully there in one second, and on and on, as long as the dashboard is open.

- The LIVE label plays an animation for as long as the page is open.
- Each second, it goes from fully there to faint, then back, without jumping: one second each way.
- It never disappears completely.

Psst, `infinite` makes it go on, `alternate` brings it back :)
