Look at a framed photo on a wall. There's the photo itself, then a white strip of card around it, then the frame, and then some empty wall before the next picture. Every element on a web page is built the same way: a **box**, with layers around what it holds.

## Every element is a box

Even when you can't see it, every element sits in a rectangle: a heading, a paragraph, a card. Give one a background, and you see its box:

```css
.member {
  background-color: #1e3a5f;
}
```

The whole `div` turns blue, from edge to edge, and its text sits right against the edges, squashed.

## `padding`: room inside the box

`padding` is the white strip of card around the photo: space **inside** the box, between its edges and what it holds:

```css
.member {
  background-color: #1e3a5f;
  padding: 16px;
}
```

Now there are 16 pixels of blue all around the text, on every side. The box grows to make room, and the text can breathe.

The padding takes the box's background color. It's part of the box, just empty.

Over the next lessons you'll meet the other layers: the **border** (the frame) and the **margin** (the empty wall around it).

## Break it on purpose

Give the padding, but no background:

```css
.member {
  padding: 16px;
}
```

The text moves away from where it was, but you can't see any box: the room is there, only invisible. Padding shows best on a box with a background or a border.

---

## Mission: Real cards

Your crew cards on `crew.html` are only text so far. Make them look like cards.

**Example**: each card is a panel of its own color, with its name and job set a little away from the panel's edges.

- Every card has a background the page doesn't have.
- Every card has at least 12 pixels of room inside it, on every side.

Psst, padding is the room **inside** the box :)
