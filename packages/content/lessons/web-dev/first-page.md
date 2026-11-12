Every website you have ever opened is made of **web pages**. And a web page is just a **text file**, like a note on your phone. Your browser reads that file and turns it into what you see: headings, text, pictures, buttons.

The file is written in a language called **HTML**. HTML doesn't do math like a calculator. It only **says what each piece of the page is**: "this is a heading", "this is some text".

Think of a school notebook. You write the title of a lesson bigger, and underline it, so anyone can tell it's a title. HTML does the same with **tags**.

## A tag

A tag is a word between `<` and `>`. Here is the tag for the biggest heading of a page:

```html preview
<h1>My Favourite Games</h1>
```

`h1` is short for **heading 1**, the most important heading. Under the code you see the page it makes: the words, big and bold.

Every example in these lessons works like this: the code on top, the page it makes underneath. Change the code and the page follows, so try things out right there. When an example shows only the part that matters, **View all the code** shows the whole page behind it.

Look at the two tags around the words:

- `<h1>` is the **opening tag**. It says "a heading starts here".
- `</h1>` is the **closing tag**. It's the same word with a `/` in front. It says "the heading ends here".

The opening tag, the words and the closing tag together make an **element**: one piece of the page.

## The editor and the preview

On the right you have your own small editor:

- the **files** of your site are on the left. For now there is one, `index.html`, the page a browser opens first;
- the **editor** is where you type;
- the **preview** shows your page. It updates a moment after you stop typing.

Type this in `index.html` and look at the preview:

```html preview
<h1>Hello</h1>
```

Now change `Hello` to your name. The preview changes too. That's the whole loop: type, look, change, look again.

## Break it on purpose

What if you forget the `/` in the closing tag?

```html preview
<h1>Hello<h1>
```

The browser thinks you opened a second heading and never closed either. On this page you may not see much change, but as soon as you write more under it, everything after it turns into a big heading too. Try it, then put the `/` back.

What if you leave the tags out?

```html preview
Hello
```

The word still shows, but small and plain. Without the tag, the browser has no idea it's meant to be a heading.

---

## Mission: Name your station

You are building the home page of a space station, one lesson at a time. Every lesson adds something to it.

Your `index.html` is empty. Write the page's biggest heading, with a welcome to your station in your own words.

**Example**: your page would show something like this:

```text
Welcome to Orion Station        (big and bold)
```

- The page has a heading made with `<h1>`.
- The heading has your own words in it.

Psst, don't forget the `/` in the closing tag :)
