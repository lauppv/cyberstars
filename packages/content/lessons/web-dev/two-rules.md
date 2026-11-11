Your mum says "wear the blue jumper". Five minutes later she says "actually, wear the red one". Which do you wear? The red one: the last thing she said is what counts.

CSS does the same when two rules of the same kind say different things about the same element.

## The later rule wins

An element can wear two classes, with a space between them:

```html
<p class="tip">Bring water to every game.</p>
<p class="tip new">Snacks are allowed from this week.</p>
```

Both paragraphs are tips. The second one is also `new`. Now two rules:

```css
.tip {
  color: darkgreen;
}

.new {
  color: darkorange;
}
```

```text
Bring water to every game.             (dark green)
Snacks are allowed from this week.     (dark orange)
```

The second paragraph has both classes, so both rules want to color it. A class against a class is a tie, so the browser takes the rule that comes **later** in the file. `.new` is further down, so dark orange wins.

The first paragraph isn't `new`, so it stays dark green.

## Only what they disagree on

The later rule only wins on the properties both rules set. If `.tip` also said `text-decoration: underline` and `.new` says nothing about lines, the new tip keeps its underline from `.tip` and gets its color from `.new`.

## Break it on purpose

Swap the two rules in the file:

```css
.new {
  color: darkorange;
}

.tip {
  color: darkgreen;
}
```

Now `.tip` is later, so it wins, and the new tip is dark green like the others. The class is still on the paragraph, but its rule loses. When a class "does nothing", check whether a rule further down undoes it.

---

## Mission: An urgent warning

Your page has two warnings. The one about Hatch 3 is urgent: people must see it first.

**Example**: the Hatch 3 warning shows in its own color, and the badge warning keeps the warning color.

- The Hatch 3 warning has the class `urgent` as well as `warning`.
- A warning with the class `urgent` has a color the other warnings don't have.

Psst, a rule that should win a tie goes further down the file :)
