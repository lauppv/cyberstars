No new theory, just a challenge that uses room inside a box, round corners, colors that stand out, contrast, a grid and a media query.

---

## Mission: Starship cards

Soon the tracker fills its list with a card for each starship, made from your template. Give those cards a look before they arrive, so the page is ready for them.

**Example**: on a wide window, the cards stand in two columns, a little room between them. Each card has a background of its own, round corners and room inside it. The status, like `Docked`, sits in a small colored badge. On a phone, the cards stand one under the other, each as wide as the list.

- Each starship card (`.ship`) is at least 60px tall, with at least 12px of room inside it at the top and on the left, round corners (at least 8px) and a background that stands out from the page's.
- The status stands out from the name with a background of its own. The name, the class and the status are each readable on what's behind them, with a contrast of at least 4.5, in the light colors and in the dark ones.
- On a wide window, the list stands in two columns, at least 8px apart, the cards' tops lined up in a row. On a phone, one column, the cards at least 8px apart, each as wide as the list, and nothing sticks out sideways.
- The skeleton cards stand the same way, since they are items of the same list.

Psst, the cards are items of the list `ships`, so the list is the grid :)
