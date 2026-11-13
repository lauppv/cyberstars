In a theatre, the same stage is a sunny beach in the first act and a dark forest in the second. Nobody builds a new stage: they change the lights and the backdrop, and everything on stage looks different. Custom properties let a page change its whole look the same way.

## Custom properties follow the cascade

A custom property is a property like any other: a later or a stronger rule can give it another value. Then everything that uses it, through `var()`, takes the new value:

```css preview
<style>
  /* show */
  html {
    --bg: #1d1d2b;
    --fg: #f5f5ff;
  }

  html.sunny {
    --bg: #fff6d6;
    --fg: #3b2a00;
  }
  /* /show */

  body {
    background-color: var(--bg);
    color: var(--fg);
    font-family: Verdana, sans-serif;
  }
</style>
<p>Tonight the moon is full.</p>
```

The page is dark, since `<html>` has no class. Now add the class to it in the HTML, `<html class="sunny">`, and look again: the page turns yellow, and the text dark brown.

`html.sunny` picks the `html` element when it has the class `sunny`. It's more specific than `html` alone, so its values win. `body` didn't change at all: it still says `var(--bg)`, and `--bg` now holds another color.

## One class for the whole site

That's a **theme**: one class that gives every custom property a new value. With the colors of a whole site in custom properties, a single class changes every page, every card, every heading. You never touch the rules that use them.

A theme should change every color that goes together. If the background turns light, the text must turn dark, or it can't be read.

## Break it on purpose

Put the class on `<body>` instead: `<body class="sunny">`, with the rule still `html.sunny`. Nothing changes: the rule looks for an `html` with the class, and there is none. Keep the theme's class and its rule on the same element: for a whole page, `html`, which holds everything else.

Then forget `--fg` in the sunny rule: light yellow page, and the old light text on it. You can hardly read a word.

---

## Mission: A light theme

Some visitors find the dark site hard to read in daylight. The site gets a light theme, ready for the settings page to switch on later.

**Example**: with `<html lang="en" class="light">`, the dashboard has a pale background with dark text, white cards, a dark orange title and blue headings. Without the class, the site is dark as before.

- When `<html>` has the class `light`, the six colors get light values of your own: a light page background with dark text, and cards whose background stands out from the page.
- In the light theme, every paragraph of the dashboard's and the settings page's main part, the biggest headings of every page, the headings of the main part, the cards' numbers and the theme buttons are readable, with a contrast of at least 4.5.
- Without the class, the site stays dark.

Psst, a light theme gives a new value to each of the six custom properties, the yellow too :)
