On a slow connection, have you seen a page jump while you read it? You start a sentence, a picture finally loads above it, and the text drops down out of sight. That happens when the browser doesn't know how big a picture is until it arrives.

## `width` and `height`

Two attributes tell the browser a picture's size before it loads:

```html
<img src="img/cat.svg" alt="A grey cat asleep in a shoebox" width="300" height="200" />
```

The numbers are in **pixels**, the tiny dots a screen is made of. Now the browser keeps a space of 300 by 200 pixels for the picture right away, and the text around it never jumps.

They also choose the size it **shows** at. The same picture can show smaller:

```html
<img src="img/cat.svg" alt="A grey cat asleep in a shoebox" width="150" height="100" />
```

The cat now takes a quarter of the room: half as wide, half as tall.

## Keep its shape

A picture has a **shape**: how wide it is compared to how tall. The cat picture is 300 by 200, so it's 1.5 times as wide as it is tall. Keep the two numbers in the same proportion and it keeps its shape:

- 300 by 200: the picture's own size;
- 150 by 100: half of each, same shape;
- 450 by 300: one and a half times each, same shape.

## Break it on purpose

Change only one number:

```html
<img src="img/cat.svg" alt="A grey cat asleep in a shoebox" width="300" height="100" />
```

The cat gets squashed flat, as wide as before but half as tall. The browser does what the numbers say, even if it spoils the picture. When you change the width, work out the height that goes with it.

---

## Mission: The right size

Your `index.html` shows the station's picture at its own size, 320 pixels wide and 200 tall. That's a bit big for the top of the page.

**Example**: the picture shows a little smaller, in the same shape, with nothing squashed.

- The station picture has a `width` and a `height`.
- It shows 240 pixels wide.
- It keeps its shape: the height goes with that width.

Psst, 240 is three quarters of 320, so the height is three quarters of 200 :)
