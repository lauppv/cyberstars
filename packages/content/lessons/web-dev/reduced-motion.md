Some people feel dizzy or sick when things move on a screen, a bit like being sick in a car. For them, a page full of sliding, turning and pulsing things is hard to use. Phones and computers have a setting for it, often called "reduce motion". A page can ask for it, and calm down.

## `prefers-reduced-motion`

`prefers-reduced-motion` is a media query like `prefers-color-scheme`. It's `reduce` when the person asked their system for less motion:

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

  @media (prefers-reduced-motion: reduce) {
    .heart {
      animation: none;
    }
  }
  /* /show */

  @keyframes beat {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1.3);
    }
  }
</style>
<p class="heart">❤</p>
```

On most devices the heart beats. Turn on "reduce motion" in your device's settings (it's often under Accessibility), and look again: the heart stands still. `animation: none` stops the animation.

## Calm, not empty

Less motion doesn't mean less page. The heart is still there, only still. Keep:

- everything that **shows** something: a label, a border, a color change. Those can still change, just at once instead of slowly.
- nothing that **moves**: animations, things that slide, lift or turn.

So in the media query, an animation gets `animation: none`, a transition `transition: none` (the change still happens, at once), and a hover that moves things `transform: none`.

## Break it on purpose

Hide the heart for those people, with `display: none` in the media query. It doesn't move, but they lose something everyone else has. If the heart said "live", they'd never know the video is live. Remove the movement, not the thing.

Then write `@media (prefers-reduced-motion: no-preference)`, the other value, by mistake. Now the heart stops for everyone who **didn't** ask, and keeps beating for those who did.

---

## Mission: Less motion, when asked

Visitors who asked their device for less motion should get a calm site.

**Example**: with "reduce motion" on, the LIVE label is still there but doesn't pulse. A card under the mouse gets its yellow border at once, without lifting. The theme icons don't turn.

- When the system asks for less motion, the LIVE label stops pulsing, and still shows.
- In the same case, the cards don't move under the mouse and have no transition: they get their border at once. The theme buttons' icons don't turn under the mouse, and the pressed theme button stays bigger.
- Without that wish, everything moves as before.

Psst, take away the movement, not the label :)
