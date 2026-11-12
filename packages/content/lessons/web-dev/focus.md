Not everyone uses a mouse. Some people move around a page with the **Tab** key: each press jumps to the next link or button. Try it now on any website. How do you know where you are? A ring or a frame shows around the link that's ready to be pressed. That link has the **focus**.

## `:focus`

```css preview
<style>
  /* show */
  a:focus {
    outline: 3px solid gold;
  }
  /* /show */
</style>
<p><a href="games.html">Our games</a> · <a href="members.html">Members</a> · <a href="rules.html">Rules</a></p>
```

"A link, while it has the focus". Press Tab until you reach a link: a thick gold line appears around it. Press Enter, and the link opens.

`outline` is like a border, written the same way, but it doesn't take any room: it's drawn around the element without moving anything. That's why it's used for focus: nothing on the page jumps when you press Tab.

## Never take it away

Browsers draw a focus ring by themselves, a thin one. Some people think it looks ugly and remove it with `outline: none`. Don't! For someone using a keyboard, it's the only way to see where they are. Change it to something that suits your page, and make it clear, but always keep one.

## Break it on purpose

Remove the outline:

```css preview
<style>
  /* show */
  a:focus {
    outline: none;
  }
  /* /show */
</style>
<p><a href="games.html">Our games</a> · <a href="members.html">Members</a> · <a href="rules.html">Rules</a></p>
```

Now press Tab a few times. Where are you? You can't tell. Imagine moving around a whole site that way.

---

## Mission: Where am I?

Someone moving around your site with the Tab key should always see clearly which link they're on.

**Example**: press Tab on any page: the first link of the menu gets a thick outline in a color of your own, and every press moves it to the next link.

- A link with the focus has an outline at least 2 pixels thick, in a style you chose (not the browser's own).

Psst, `outline` takes the same three parts as `border` :)
