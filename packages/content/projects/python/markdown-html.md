The robotics club at Gheorghe's school writes a newsletter every week. The members write it the easy way, in plain text with a few marks: a `#` for a title, `**` around bold words, a `-` in front of each item in a list. But the school's website only shows HTML. Gheorghe copies and fixes every tag by hand on Friday evenings. You'll write the converter that does it for him.

You build it one step at a time, in one file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests convert newsletters your program has never seen. Passing them finishes the project.

The program reads the whole text until the input ends (`input()` raises `EOFError` then), and prints the HTML.

## Paragraphs

Lines of text next to each other make one paragraph; an empty line ends it. Join a paragraph's lines with a single space, take the spaces off each line's ends, and wrap it in `<p>` and `</p>`:

```text
This week we finally got the line follower to work.
It took three evenings and one burnt motor.
```

```text
<p>This week we finally got the line follower to work. It took three evenings and one burnt motor.</p>
```

Put each paragraph, and every block in the next steps, on lines of its own, in the order they come. The converter needs to remember what it's in the middle of (a paragraph, a list, a block of code) and to close it when something else starts. Keep the lines of the paragraph being built in a list, and write a function that closes whatever is open.

## Headings

A line that starts with one, two or three `#` and a space is a heading of that level. It closes whatever was open, and becomes `<h1>`, `<h2>` or `<h3>`:

```text
## What we did
```

```text
<h2>What we did</h2>
```

A line starting with `#` that isn't one of those (`#hashtag`, or four `#`) is ordinary text.

## Bold, italic and links

Inside paragraphs, headings and list items:

- text between two `**` becomes bold: `<strong>line follower</strong>`
- text between two `*` becomes italic: `<em>three</em>`
- `[school track](https://example.org/track)` becomes a link: `<a href="https://example.org/track">school track</a>`

Do the links first, then the `**` pairs, then the `*` pairs, each from left to right. A mark without its closing partner stays as it is. Finding a mark with `text.find(mark)` and its partner with `text.find(mark, start + len(mark))` is all it takes.

## Lists

A line that starts with `- ` is an item of a bulleted list, and a line that starts with a number, a dot and a space (`1. `) an item of a numbered list. Items next to each other make one list, `<ul>` or `<ol>`, with each item on its own line, indented by two spaces:

```text
<ul>
  <li>Soldered the new sensor board</li>
  <li>Wrote the code for the <strong>PID</strong> loop</li>
</ul>
```

A list ends at an empty line, a heading, an ordinary line of text, or an item of the other kind, which starts a new list.

## Safe characters

In HTML, `<`, `>` and `&` mean something, so a newsletter that says `Ms. Pop & Mr. Ionescu` would confuse a browser. Before anything else in a piece of text, turn `&` into `&amp;`, `<` into `&lt;` and `>` into `&gt;`, in that order (why must `&` come first?):

```text
<p>Questions? Ask Ms. Pop &amp; Mr. Ionescu.</p>
```

## Code

A line that is only three backticks opens a block of code, and the next such line closes it. Inside, nothing is converted except the safe characters: every line stays exactly as it is, spaces included. The block becomes `<pre><code>` on a line of its own, the code's lines, and `</code></pre>`:

```text
<pre><code>
if speed &gt; 100 &amp;&amp; ready:
    run(&lt;motor&gt;)
</code></pre>
```

A block of code closes whatever was open before it. If the text ends inside a block, close it anyway. Gheorghe's Friday evenings are free again.
