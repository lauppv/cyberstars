On a video call, there's a microphone button. Press it, and you're muted; press it again, and people hear you. The call goes on the whole time: only the sound changes. A video on a page has a sound switch like that too.

## `muted` from JavaScript

You know the `muted` attribute in the HTML: a video that starts without sound. From JavaScript, `muted` is a property of the video, `true` or `false`, that you can read and change while it plays:

```html preview
<video id="film" src="video/launch.webm" width="320" autoplay muted loop></video>
<button type="button" id="sound">Turn the sound on</button>
<script>
  const film = document.querySelector("#film");
  document.querySelector("#sound").addEventListener("click", () => {
    film.muted = false;
  });
</script>
```

The video plays by itself, without sound, since it's muted. Press the button, and you hear the rocket: `film.muted = false` turns the sound on. The video doesn't stop or start again: it just isn't muted any more.

## One button, both ways

`!` turns `true` into `false` and `false` into `true`. So `film.muted = !film.muted` switches the sound, whatever it was:

```html preview
<video id="film" src="video/launch.webm" width="320" autoplay muted loop></video>
<button type="button" id="sound">Sound on</button>
<script>
  const film = document.querySelector("#film");
  const sound = document.querySelector("#sound");
  sound.addEventListener("click", () => {
    film.muted = !film.muted;
    sound.textContent = film.muted ? "Sound on" : "Sound off";
  });
</script>
```

Like the play button, this one says what it will do next: "Sound on" while the video is muted, "Sound off" while you hear it.

## The property, not the attribute

The `muted` attribute in the HTML only says how the video **starts**. Changing the attribute later, with `setAttribute` or `removeAttribute`, doesn't change the sound of a video that's already playing. The property, `film.muted`, is the switch that counts while it plays.

## Break it on purpose

Write `film.muted = !film.muted;` twice in the same function. Each click switches the sound off and back on at once, so nothing seems to happen. And if you change only the text, without `film.muted`, the button says "Sound off" while the video stays silent. Check both: what you hear, and what the button says.

---

## Mission: Sound for the pad camera

The pad camera plays without sound, so it can start by itself. Sometimes the crew wants to hear the launch tower.

**Example**: under the pad camera's caption, a button that says `Sound on`. A click turns the camera's sound on, while it keeps playing, and the button says `Sound off`. Another click turns the sound off again.

- In the pad camera's panel, a button with the id `mute-pad`, which says `Sound on`.
- A click while the pad camera is muted turns its sound on, and the button says `Sound off`. A click while you hear it mutes it, and the button says `Sound on`.
- The pad camera keeps playing the whole time.

Psst, `!` turns `true` into `false`, and back :)
