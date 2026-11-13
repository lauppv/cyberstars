Think of a video on your phone. You press play and it starts, you press pause and it stops, and you can drag a small dot along a line to jump ahead. Those buttons look almost the same on every website. That's because the website doesn't draw them: the browser does. In HTML, one tag brings a video and its buttons.

## `<video>`

`<video>` puts a video on the page. Like `<img>`, its `src` says which file to show. The course brings a short video of a rocket launch, `video/launch.webm`:

```html preview
<video src="video/launch.webm" controls></video>
```

What do you see? The first picture of the video: a rocket on its tower. Under it, a bar with a play button, the time and a sound button. Press play :)

`.webm` is a kind of video file, like `.png` is a kind of picture. Every modern browser can play it.

Unlike `<img>`, `<video>` has a closing tag, `</video>`. Don't forget it.

## `controls`

`controls` asks the browser for the buttons. It's an attribute with no value, like `required` on a form field: it's there or it isn't. Remove it:

```html preview
<video src="video/launch.webm"></video>
```

The video is still on the page, but you only see its first picture. There is no play button, and a click does nothing. A visitor has no way to start it. So a video for people to watch always gets `controls`.

## A video is a box

A video is a box on the page, like a picture. This one is 480 pixels wide, the width of its file. What you know about boxes works on it too: a margin, a border, a `max-width`. Try it in the first example: put the video in a page with a `<style>` that gives `video` a thick orange border.

## Break it on purpose

Write the file's name wrong: `video/lanch.webm`. The video's box is still there, but it's empty, and play does nothing. The page shows no error. In your editor, the console under the site says which file it couldn't find. When a video stays empty, check its path first.

Then put the name back and delete `</video>`, in a page with a paragraph after the video:

```html preview
<video src="video/launch.webm" controls>
<p>Next launch: Friday.</p>
```

The paragraph is gone. Without `</video>`, the browser thinks the paragraph belongs **inside** the video, and it doesn't show what's inside a video. Put `</video>` back, and the paragraph comes back.

---

## Mission: The dashboard page

The crew wants one page where they see the whole station at a glance. Your site gets a new page for it: the dashboard. Its first piece is the video of the last launch. The course gives it to you: `video/launch.webm` is already in your site's files.

**Example**: a new page, `dashboard.html`, that looks like the other pages: the header with the station's name and the Menu button, a heading such as "Mission Dashboard", the launch video with its buttons, and the footer.

- `dashboard.html` is a whole page like the others: in English, with a name for its tab, the site's `style.css`, the same header and footer as every page, and its content in `<main>` with one biggest heading. Its menu opens from the Menu button, as on the other pages.
- In its main part, the launch video, with the id `launch-video` and its buttons.
- Every page's menu has a link to `dashboard.html`, the commander's page too.

Psst, `menu.js` opens the menu, so the new page needs it too :)
