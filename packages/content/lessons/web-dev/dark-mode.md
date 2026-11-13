Many phones and computers have a dark mode: in the evening, or all day, the whole screen turns dark, the apps too. Some people like the light look better, especially in daylight. A web page can ask the device which look its person chose, and follow it.

## `prefers-color-scheme`

`prefers-color-scheme` is a media query, like `max-width`. But instead of the window's width, it asks about the person's choice in their system's settings: `dark` or `light`.

```css preview
<style>
  /* show */
  body {
    background-color: white;
    color: black;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color: #121212;
      color: #eeeeee;
    }
  }
  /* /show */

  body {
    font-family: Verdana, sans-serif;
  }
</style>
<p>Which mode is your device in?</p>
```

If your device is in dark mode, this page is dark. If it's in light mode, it's white. Change the mode in your device's settings, and look again: the page changes by itself, without a reload.

## With custom properties

With the colors in custom properties, the media query only has to give them new values. Our site is dark by default, so it asks the other question: does the person want a light look?

```css
@media (prefers-color-scheme: light) {
  html {
    --bg: #fff6d6;
    --fg: #3b2a00;
  }
}
```

Every rule that uses `var(--bg)` follows, on every page.

## The person's choice comes first

This only gives each visitor what they already chose for their whole device. A visitor who wants something else on your site will choose on your settings page: the `light` class, which a script will set later in this part. That's why the class must win over the media query. `html.light` is more specific than `html`, so it does, wherever the two are in the file.

## Break it on purpose

Ask the wrong question: `@media (prefers-color-scheme: dark)` in our dark site, with the light colors inside. Now a device in dark mode gets the light theme, and a device in light mode the dark site: exactly the wrong way round. Read the question out loud: "if the person **prefers** light, then...".

Then give the media query only a new background: a light page with the old light text, which nobody can read. A theme changes all its colors together.

---

## Mission: Follow the device

The light theme is ready, but only the class switches it on. Visitors whose device is in light mode should get it straight away.

**Example**: on a device in light mode, the dashboard opens with the light theme. In dark mode, it's the dark site, as before.

- When the visitor's system asks for a light look, the site shows its light theme: every paragraph of the main part, the biggest heading and the cards' numbers are dark on a light background, readable with a contrast of at least 4.5. The settings page too.
- When the system is in dark mode, the site stays dark.
- The class `light` on `<html>` still gives the light theme, in dark mode too.

Psst, our site is dark already, so the question to ask is whether the person prefers light :)
