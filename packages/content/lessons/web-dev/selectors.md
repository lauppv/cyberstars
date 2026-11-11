At school, some lessons are in the gym, some in the lab, some in the classroom. You can't tell from the timetable's grid alone which is which, so the teacher puts a coloured sticker on each kind: red for gym, green for lab. Everything with a red sticker belongs together, wherever it is in the week.

In HTML, that sticker is a **class**.

## Give elements a class

`class` is an attribute you can put on any element. Its value is a name you make up:

```html
<p class="tip">Bring water to every game.</p>
<p>The club meets on Tuesdays.</p>
<p class="tip">Arrive ten minutes early.</p>
```

The two tips now share the class `tip`. The page looks the same: a class is only a label, until CSS uses it.

## Style a class

In CSS, a class is picked with a **dot** in front of its name:

```css
.tip {
  color: darkgreen;
}
```

```text
Bring water to every game.       (dark green)
The club meets on Tuesdays.
Arrive ten minutes early.        (dark green)
```

`p` would pick every paragraph. `.tip` picks only the elements that wear the `tip` class, whatever their tag. A heading with `class="tip"` would turn green too.

Many elements can share one class, and that's the point: one rule styles them all, and a new tip only needs `class="tip"` to look the part.

A class name has no spaces, and is usually written in small letters with `-` between words: `class="club-tip"`.

## Break it on purpose

Forget the dot:

```css
tip {
  color: darkgreen;
}
```

Without the dot, the browser looks for a **tag** called `<tip>`. There isn't one, so nothing turns green. And the other way round: in the HTML, the class is written **without** the dot, `class="tip"`, never `class=".tip"`.

---

## Mission: Warnings stand out

Your page has two warnings: the one about the hatch in Today on Board, and the one about badges in Visiting Hours. Make them look like warnings.

**Example**: both warning paragraphs show in a color the other paragraphs don't have, like dark red.

- Both warning paragraphs have the class `warning`. Later lessons use this name.
- Paragraphs with the class `warning` have a color the other paragraphs don't have.

Psst, a dot in CSS, no dot in the HTML :)
