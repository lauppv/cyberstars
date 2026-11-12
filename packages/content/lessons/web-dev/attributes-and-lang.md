Your phone has a "read aloud" button that reads a page to you. How does it know whether to read in an English voice or a Spanish one? And how does the browser know when to offer "Translate this page"? The page tells them which language it's written in.

To say it, a tag needs a bit of **extra information**. That extra information is called an **attribute**.

## An attribute

An attribute is written **inside the opening tag**, after the tag's name:

```html preview
<!DOCTYPE html>
<!-- show -->
<html lang="en">
<!-- /show -->
  <head>
    <title>Game Club</title>
  </head>
  <body>
    <h1>My Favourite Games</h1>
  </body>
</html>
```

It has three parts:

- a **name**: `lang`, short for language;
- an `=` sign;
- a **value** in quotes: `"en"`, the code for English.

This one says: "everything in this page is in English". The page looks exactly the same. The attribute is for the browser, for screen readers that read pages to people who can't see them, and for search engines.

Other languages have other codes: `es` is Spanish, `de` is German, `ro` is Romanian. If your page were in Spanish, you'd write `lang="es"`.

## Where it goes

Only in the **opening** tag, never in the closing one:

```html preview
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Game Club</title>
  </head>
  <body>
    <h1>My Favourite Games</h1>
  </body>
</html>
```

The closing tag stays plain: `</html>`.

Lots of tags take attributes. We'll meet many of them: one for where a link leads, one for which picture to show. They all work the same way, `name="value"` inside the opening tag.

## Break it on purpose

Forget the quotes and the `=`:

```html preview
<!DOCTYPE html>
<!-- show -->
<html lang en>
<!-- /show -->
  <head>
    <title>Game Club</title>
  </head>
  <body>
    <h1>My Favourite Games</h1>
  </body>
</html>
```

The browser now reads two attributes with no values, `lang` and `en`, and has no idea what language the page is in. Nothing on the page shows you the mistake, so it's easy to miss. Always write `name="value"`.

---

## Mission: Say the language

Your `index.html` has its frame and its title. The station's home page is written in English. Say so.

**Example**: the preview looks the same as before. The browser now knows the page is in English.

- The `<html>` tag has a `lang` attribute.
- Its value is the code for English.

Psst, the attribute goes in the opening `<html>` tag, with the value in quotes :)
