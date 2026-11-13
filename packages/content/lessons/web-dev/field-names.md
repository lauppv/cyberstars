You send a package, and the person who opens it finds a sweater and a book, but no note. Who is it from? What's it for? A form that sends a box with no name does the same: the server gets a value and doesn't know what it means.

## `name`

The `name` attribute gives each box a name for the server:

```html preview
<form>
  <label for="nickname">Nickname</label><br />
  <input id="nickname" name="nickname" />
  <button>Join</button>
</form>
```

Type `Rocket` and click **Join**. The line under the page now says:

```text
The form was sent: nickname=Rocket
```

The form sends a **name=value** pair: the box's `name`, an `=`, and what was typed in it.

`id` and `name` look alike, but they do different jobs. The `id` is for the page: a label, CSS and your script use it. The `name` is for the server: it's what the form sends. Often they're the same word.

## More boxes, more pairs

Each box with a name sends its own pair, joined by `&`:

```html preview
<form>
  <label for="nickname">Nickname</label><br />
  <input id="nickname" name="nickname" /><br />
  <label for="age">Age</label><br />
  <input id="age" name="age" />
  <button>Join</button>
</form>
```

Fill in both and send:

```text
The form was sent: nickname=Rocket&age=14
```

## Break it on purpose

Take the `name` away from the age box, and send again:

```text
The form was sent: nickname=Rocket
```

The age is gone. A box without a `name` is never sent, whatever you type in it.

---

## Mission: Who is it for?

The booking form is sent, but with nothing in it.

**Example**: type `Ida Moreau` in the name box and send the form. The console under your page says:

```text
The form was sent: passenger=Ida Moreau
```

- The form sends what is typed in the name box, as `passenger`.

Psst, `name` goes on the `input`, not on the label :)
