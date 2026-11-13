No new theory, just a challenge that uses this part's CSS: flex (side by side, a new row, growing, a size to start from, where the items sit) and position (a place inside a box, which one is on top), with what you know about colors and contrast.

Open a news website on a computer. A picture often stands beside the first lines of the story, with a short caption (a few words about the picture) printed on the picture itself, along its bottom edge. On a phone, there is no room beside the picture, so the text goes under it.

This time nobody tells you which property goes on which box. Look at what the page should look like, and decide yourself which box gets which property. If something lands in a strange place, Inspect it: the browser draws the box where it really is.

---

## Mission: A picture with a caption

Your home page, `index.html`, starts with the station's picture. On a computer, it stands alone on its line, with empty room at its right, and the two sentences come after it.

First, the HTML. Put the picture in a `div` with the class `photo`: the picture box. After the picture, in the same `div`, add the caption: a `span` with the class `caption`. Put the two sentences under the picture (about the Earth and the six people) in a `div` with the class `welcome-text`. Then put both `div`s in one more `div`, with the class `welcome`.

**Example**: on a computer, the picture stands at the left, and the two sentences stand beside it. On the picture, along its bottom edge, a small label says something like `Seen from a supply ship`, in colors of its own. On a phone, the picture sits above the sentences.

- The caption sits inside the picture box, along its bottom edge. It has a background of its own, and its words read well on it: a contrast of at least 4.5:1.
- On a computer, the picture box stands at the left of the sentences, with at least 16 pixels between them. On a phone (375 pixels wide), it sits above them, and nothing sticks out sideways.
- The picture box ends where its picture ends, even beside a long text, so the caption stays on the picture. The tests also try other pictures, with other sentences, short and long.
- When the page scrolls, the header stays over the picture and its caption. And the rest still works: the wiki's cards go on to a new row when there's no room, the fact box comes first on the wiki pages, and Back to top waits in its corner.

Psst, in a row, an item stretches to the height of the tallest one, unless you say otherwise :)
