Think of a voice message from a friend. There's no picture, only a bar with a play button and the time. You press play when you're ready to listen. A sound on a web page works the same way.

## `<audio>`

`<audio>` puts a sound on the page. It works like `<video>`: `src` names the file, `controls` asks for the buttons, and it closes with `</audio>`. The course brings a short sound, the countdown before a launch:

```html preview
<audio src="audio/countdown.mp3" controls></audio>
```

You see a bar: a play button, the time and a sound button. Press play: three short beeps, then a long one.

`.mp3` is a kind of sound file, like `.webm` is a kind of video. Every browser can play it.

## No buttons, no sound

Take `controls` away, with a line of text before and after the sound:

```html preview
<p>Before the sound</p>
<audio src="audio/countdown.mp3"></audio>
<p>After the sound</p>
```

The two lines touch, with nothing between them. A video without buttons still shows its first picture, but a sound has no picture. Without its bar it takes no room on the page, and nobody can play it. So a sound always gets `controls`.

## A sound waits for the visitor

Add `autoplay` to the first example. Nothing plays, and the bar waits at the start. As with a video, the browser doesn't let a page make a noise by itself. `muted` won't help here: the countdown with no sound is only silence. A sound on your page always waits for a click on play.

## Break it on purpose

Write the path wrong: `countdown.mp3`, without the `audio/` folder. The bar is still there, but play does nothing, and in your editor the console says which file it couldn't find.

Then put the path back and forget `</audio>` in the example with the two lines. "After the sound" is gone: the browser thinks it belongs inside the sound, and it shows nothing that's inside an `<audio>`.

---

## Mission: The countdown

Before every launch, the station plays the countdown, and the crew wants to hear it again on the dashboard. The course gives you the sound: `audio/countdown.mp3` is already in your site's files.

**Example**: on the dashboard, under the launch video, a heading such as "The countdown" and a bar with a play button. A click on play gives three short beeps and a long one.

- On the dashboard, in its main part, the sound `audio/countdown.mp3` with the id `countdown` and its buttons.
- It waits for the visitor: it doesn't start by itself.
- The two videos work as before.

Psst, the file is in the `audio/` folder :)
