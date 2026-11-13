You want a photo of your friends for your wallet. You wouldn't print it as a big poster and fold it ten times: you'd print a small one. And for your bedroom wall, a small print would look blurry. The right size depends on where the photo goes. A web page can offer a picture in several sizes too, and let the browser pick.

## One file for every screen

The course has a photo of the Earth in two sizes: `img/earth-small.jpg`, 640 pixels wide, and `img/earth-large.jpg`, 1280 pixels wide. With one `src`, every screen gets the same file:

```html preview
<img src="img/earth-large.jpg" alt="The Earth seen from space" width="640" height="400" />
```

On a computer, the big file looks sharp. But a phone shows the photo much smaller, and still downloads the big file, twice as wide as it needs. That's time and mobile data for nothing.

## `srcset`: the sizes you have

`srcset` lists the files, each with its width in pixels, written with a `w`:

```html
<img
  src="img/earth-small.jpg"
  srcset="img/earth-small.jpg 640w, img/earth-large.jpg 1280w"
  sizes="100vw"
  alt="The Earth seen from space"
/>
```

`640w` doesn't change how wide the picture shows. It tells the browser: this file is 640 pixels wide. With every file's width, the browser can pick.

`src` stays, for very old browsers that don't know `srcset`.

## `sizes`: how wide it shows

The browser picks the file before it has worked out the page's layout, so it doesn't know yet how wide the picture will be. `sizes` tells it. `100vw` means the whole width of the window: `vw` is a hundredth of the window's width.

Now the browser does a little sum. In a window 375 pixels wide, the picture is 375 pixels wide, so the 640 file is enough. In a window 1000 pixels wide, it needs the 1280 one. The browser takes the smallest file that's big enough.

`sizes` can also depend on the width, like a media query: `sizes="(max-width: 600px) 100vw, 50vw"` means the whole window on a narrow screen, and half of it otherwise.

## Where you see it

In your editor's preview, nothing says which file was picked, and the photo looks the same either way. That's the point: the visitor never notices. Only the phone's data and the page's speed do. The tests of your mission check which file the browser picked at each width.

## Break it on purpose

Write the widths the wrong way round: `img/earth-small.jpg 1280w, img/earth-large.jpg 640w`. The browser believes you, so a phone now gets the big file, and a computer the small one, which looks blurry stretched to fill the screen. The browser can't check the numbers: they have to be each file's real width.

---

## Mission: Earth from the station

The crew took a photo of the Earth from the station's window. It should look sharp on a computer, without making a phone download a big file.

**Example**: at the end of the dashboard's main part, a heading such as "Earth from the station", the photo of the Earth as wide as its figure, and a caption under it.

- A new part, under a heading of its own, shows the photo of the Earth as one figure with a caption of your own, and a text for those who can't see it.
- The photo is as wide as its figure. Both files are offered: `img/earth-small.jpg` (640 pixels wide) and `img/earth-large.jpg` (1280 pixels wide).
- In a window 640 pixels wide or narrower, the browser picks the small file. In a wider window, the large one.

Psst, the `w` after each file is its real width :)
