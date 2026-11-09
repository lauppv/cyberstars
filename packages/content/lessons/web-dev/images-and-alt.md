A page with only words is like a school project with no pictures glued in. A photo or a drawing says in a second what takes a paragraph to describe.

## The `<img>` tag

A picture is an `img` element, short for **image**:

```html
<img src="img/cat.svg" />
```

`src`, short for **source**, says which picture file to show. Here it's `img/cat.svg`: the file `cat.svg` inside a folder called `img`, next to your page.

The page shows the picture right where the tag is.

Like `<br>` and `<meta>`, `<img>` has no closing tag: there are no words to put inside a picture.

## Where the picture goes

An image is **inline**, like a word: it sits in the line of text where you put it. Most of the time you want it on a line of its own, so put it between paragraphs:

```html
<h1>Our Cat</h1>
<img src="img/cat.svg" />
<p>Her name is Pixel and she sleeps all day.</p>
```

The heading, then the picture, then the paragraph, one under the other.

## Your pictures

Look at the files on the left of your editor: there's a new folder, `img`, with a picture in it, `station.svg`, a drawing of the space station. This course gives you its pictures, so you don't need to make your own. You can't change them, but you can show them on your pages as often as you like.

## Break it on purpose

Write the path wrong:

```html
<img src="img/stations.svg" />
```

The browser looks for `stations.svg`, finds nothing, and shows a small broken picture icon instead, or nothing at all. The name must match the file's name exactly, including the folder, the dot and the capital letters.

Leave out the folder and it breaks too:

```html
<img src="station.svg" />
```

The file is inside `img`, so the path must say `img/` first.

---

## Mission: A picture of the station

Your `index.html` starts with a heading and a couple of paragraphs. Visitors should see the station as soon as they arrive.

**Example**: the top of your page would show something like this:

```text
Welcome aboard

(the drawing of the station)

The station goes round the Earth every 92 minutes.
```

- The picture `img/station.svg` shows on the page.
- It's right under the heading, before the first paragraph.

Psst, the picture is in the `img` folder, so the path starts with `img/` :)
