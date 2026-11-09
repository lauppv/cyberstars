You order a picture frame "30 centimetres wide". Do you mean the picture is 30 cm, and the frame adds more? Or the whole thing, frame included, is 30 cm, so it fits the space on your wall? CSS asks the same question about boxes.

## The surprise

```css
.member {
  width: 250px;
  padding: 16px;
  border: 2px solid gold;
}
```

How wide is a member box on the page? Not 250 pixels. Inspect it:

```text
250 (width) + 16 + 16 (padding) + 2 + 2 (border) = 286 pixels
```

By default, `width` is only the **content**: padding and border come on top. Change the padding, and the box's real size changes too.

## `box-sizing: border-box`

One line fixes it:

```css
.member {
  box-sizing: border-box;
  width: 250px;
  padding: 16px;
  border: 2px solid gold;
}
```

Now `width` means the **whole box**, border included: 250 pixels on the page. The padding and border fit **inside** it, and the content gets what's left: 250 − 32 − 4 = 214 pixels. Change the padding, and the box stays 250 wide.

This is so much easier to work with that most websites put it on every element. You'll see that written `* { box-sizing: border-box; }`, where `*` picks every element.

## Break it on purpose

Take `border-box` away and look at the box in Inspect: 286 again. Then make the padding 40 pixels: 250 + 80 + 4 = 334. Without `border-box`, every change to the padding or border changes the box's size.

---

## Mission: Exactly 260

The cards should be exactly 260 pixels wide on the page, frame and all, whatever padding and border they have.

**Example**: Inspect a card: the whole box, border included, is 260 pixels wide.

- Every card is 260 pixels wide, border and padding included.

Psst, with `border-box`, the width is the whole box :)
