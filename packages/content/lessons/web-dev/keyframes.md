A flip book is a little notebook with a drawing on every page. Flip through it, and the drawing moves. You only draw some of the pages, the important moments, and the movement happens between them. A CSS animation works the same way: you write the key moments, and the browser draws everything in between.

## Transitions need a change

A transition runs when a style **changes**: the mouse arrives, a class is added. Without a change, nothing moves. To make something move by itself, when the page opens, you need an animation.

## `@keyframes`

`@keyframes` describes an animation once, with a name of your own. Inside it, `from` is how the element starts, and `to` is how it ends:

```css
@keyframes slide-in {
  from {
    transform: translateX(-100px);
  }

  to {
    transform: translateX(0);
  }
}
```

That's only the description, like a flip book on the shelf. Nothing moves yet.

## `animation`

`animation` plays it on an element: the name of the keyframes, and how long it takes:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .news {
    background-color: #1e3a5f;
    padding: 16px;
    animation: slide-in 1s;
  }

  @keyframes slide-in {
    from {
      transform: translateX(-100px);
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  /* /show */
</style>
<p class="news">School is closed on Monday!</p>
```

When the page opens, the news slides in from the left, from invisible to fully there, in one second. Change the code a little and it plays again, since the preview opens the page again.

Between `from` and `to` you can add more moments with percentages: `50% { opacity: 0.5; }` is halfway through. `from` is the same as `0%`, and `to` the same as `100%`.

After its last moment, the animation is over, and the element goes back to its own styles. That's why the `to` here is the same as how `.news` looks anyway: the end of the animation and the element agree.

## Break it on purpose

Write the name differently in the two places: `animation: slidein 1s;` with `@keyframes slide-in`. Nothing moves, and nothing tells you why: the browser looks for keyframes called `slidein`, finds none, and does nothing. The names must match exactly, dash included. Then leave out the time: `animation: slide-in;`. The animation takes 0 seconds, so you never see it.

---

## Mission: Live!

The pad camera shows the launch pad live. A small red LIVE label next to it should say so, and catch the eye when the page opens.

**Example**: under the pad camera panel's heading, a small red label with `LIVE` on it. When the dashboard opens, the label fades in, from invisible to fully there, in one second, then stays.

- Under the pad camera panel's heading, before the camera, an element with the class `live` that says `LIVE`, readable on its background.
- When the page opens, an animation of your own makes it fade in, from invisible to fully there, in one second.
- After the animation, the label stays fully there.

Psst, the name after `animation` and the name after `@keyframes` must be the same :)
