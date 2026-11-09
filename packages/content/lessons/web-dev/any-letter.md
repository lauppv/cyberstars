Have you ever got a message where a letter turned into strange signs? You write `café` and your friend sees `cafÃ©`. That happens when two computers don't agree on how letters are stored.

A computer stores every letter as a number. A **character set** is the list that says which number is which letter. Plain English letters are the same in almost every list. Letters like é, ñ, ö or ă are not, and that's where the strange signs come from.

## `<meta charset="UTF-8">`

The fix is one line in the `<head>`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Game Club</title>
  </head>
  <body>
    <h1>My Favourite Games</h1>
    <p>After chess we drink hot chocolate at a café.</p>
  </body>
</html>
```

`<meta>` gives the browser a piece of information about the page. Its attribute `charset="UTF-8"` says "this page uses UTF-8", the character set that has every letter of every language, and emoji too. With it, `café` shows as `café` on every computer.

A few things about this line:

- `<meta>` has no closing tag. There's nothing to put between an opening and a closing tag, so it's just one tag. The `/` before `>` is a reminder that it closes itself. It also works without it.
- Put it first in the `<head>`, before the `<title>`. The browser should know the character set before it reads any words, including the title's.

## Break it on purpose

In your preview the letters may look fine even without this line, because your editor already saves the file as UTF-8. But once the page is on a real website, a browser that guesses wrong shows `cafÃ©`. You can't always see the mistake, which is exactly why every page has the line: it costs nothing and you never have to guess.

Try writing the line without the quotes, `<meta charset=UTF-8>`. It still works, because a value with no spaces doesn't need them. We write the quotes anyway, so every attribute looks the same.

---

## Mission: Any letter

Your `index.html` has its frame, its title and its language. Make sure it can show any letter.

**Example**: the preview looks the same as before. Add a word with an accent to one of your paragraphs, like `café` or `naïve`, and check it shows right.

- The `<head>` has a `<meta>` tag with `charset="UTF-8"`.

Psst, `<meta>` goes in the `<head>`, before the `<title>` :)
