Have you ever watched a video on a bus with the sound off, reading the words at the bottom? Many people watch that way. For people who can't hear, those words are the only way to follow the video. The words of a video are called **captions**: what people say, and the sounds too, like "[a door closes]".

## A file of words, with their times

Captions live in a text file of their own, next to the video. Its kind is **WebVTT**, and its name ends in `.vtt`. Your site has one now, `video/launch.vtt`. Open it:

```text
WEBVTT

00:00.000 --> 00:01.000
[The engines start: a low rumble]

00:01.000 --> 00:05.000
[The rumble grows as the rocket rises]
```

The first line is always `WEBVTT`. Then come the pieces of text, with an empty line between them. Each piece has its times first: from 0 seconds to 1 second, the first words show; from 1 to 5 seconds, the second ones. `00:01.000` is minutes, seconds and thousandths of a second.

## `<track>`

`<track>` gives a video its words. It goes **inside** the `<video>`, between `<video>` and `</video>`, and like `<img>` it has no closing tag:

```html
<video src="video/launch.webm" controls>
  <track src="video/launch.vtt" kind="captions" srclang="en" label="English" />
</video>
```

- `src` names the file of words.
- `kind="captions"` says they are captions: the words and the sounds, for people who can't hear.
- `srclang="en"` says their language, like `lang="en"` on a page.
- `label="English"` is the name the visitor sees in the video's menu.

The captions don't show yet. The video's bar has a new choice for them: a button marked **CC**, or a line in its **⋮** menu, depending on the browser. Pick English there: the words appear at the bottom of the video.

This example needs the file of words, so try it in your editor, on the dashboard: the site there has `video/launch.vtt`.

## `default`

`default` shows the captions from the start, so the visitor doesn't have to look for them. It has no value, like `controls`:

```html
<track src="video/launch.vtt" kind="captions" srclang="en" label="English" default />
```

Press play: "[The engines start: a low rumble]" shows at the bottom of the video. The visitor can still turn the captions off in the video's bar.

## Break it on purpose

Delete the first line of `video/launch.vtt`, `WEBVTT`. The captions choice is still there, but no words show: without that line, the browser doesn't read the file at all.

Then put `WEBVTT` back, and move the `<track>` out of the video, after `</video>`. The captions choice disappears from the video's bar. A `<track>` belongs to the `<video>` it's inside, and outside one it belongs to nothing.

---

## Mission: Words for the launch

Not everyone on the station can hear, and the launch video only has sound. The course gives you the words of the launch: `video/launch.vtt` is in your site now.

**Example**: open the dashboard and press play on the launch video. At the bottom of the video you read "[The engines start: a low rumble]", then "[The rumble grows as the rocket rises]". The video's menu offers "English".

- The launch video (`#launch-video`) has its captions from `video/launch.vtt`, in English (`en`), with the name "English" in its menu.
- They show from the start, without the visitor turning them on.
- You may change the words in the file, as long as they still fit the video.

Psst, the `<track>` goes inside the video, before `</video>` :)
