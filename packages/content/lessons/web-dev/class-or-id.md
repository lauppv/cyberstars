You now have two ways to name an element: a class and an id. So which do you use? Think of a football team again. "Goalkeeper" is a job: every team has one, and next season someone else may do it. "Number 10, Silva" is one player. You'd paint "GK" on every goalkeeper's shirt, but there's only one Silva.

## A class: for a kind of thing

Use a class when **more than one** element shares a look, or could one day:

```html preview
<p class="tip">Bring water to every game.</p>
<p class="tip">Arrive ten minutes early.</p>
```

Two tips today, maybe ten next month. With a class, each new tip just wears `class="tip"`.

## An id: for one place

Use an id for **one** element that's unique on the page, especially one a link jumps to:

```html preview
<h2 id="rules">Club Rules</h2>
```

There's one Club Rules part, and a link goes to `#rules`.

If you're not sure, pick a class. It never breaks when a second element comes along. An id does.

## One element, both

An element can have a class and an id at the same time, and even several classes, separated by spaces:

```html preview
<h2 id="rules" class="important">Club Rules</h2>
```

## Break it on purpose

Give two elements the same id:

```html preview
<h3 id="match">Saturday's match</h3>
<h3 id="match">Sunday's match</h3>
```

The page may even look right: many browsers still style both. But a link to `#match` only ever goes to the first, and later, JavaScript looking for the element called `match` finds only the first one too. An id must be unique. Two of the same kind call for a class.

---

## Mission: The shifts belong together

Your page has three small headings: The Greenhouse, Morning Shift and Night Shift. Two of them are shifts, and the station may add an Evening Shift one day.

**Example**: Morning Shift and Night Shift show in the same color, which The Greenhouse doesn't have.

- Both shift headings have the class `shift`.
- Headings with the class `shift` have a color that the other small headings don't have.

Psst, there will be more shifts one day, so it's a class, not an id :)
