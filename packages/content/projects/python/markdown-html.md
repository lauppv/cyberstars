The robotics club at Theodore's school writes a newsletter every week. The members write it in plain text with a few marks: a `#` before a title, `**` around bold words, a `-` before each item of a list. This way of writing is called Markdown. But the school's website only shows HTML, the language of web pages. Every Friday evening Theodore changes the newsletter to HTML by hand. You will write the program that does it for him.

**The input** is a newsletter in Markdown:

````text
# Robotics Club News

This week we finally got the **line follower** to work.
It took *three* evenings and one burnt motor.

## What we did

- Soldered the new sensor board
- Wrote the code for the **PID** loop
- Tested on the [school track](https://example.org/track)

## Next meeting

1. Bring your laptops
2. Charge the batteries

Code for the motor test:

```
if speed > 100 && ready:
    run(<motor>)
```

Questions? Ask Ms. Lee & Mr. Fischer.
````

**The output** for this input, when the program is finished:

```text
<h1>Robotics Club News</h1>
<p>This week we finally got the <strong>line follower</strong> to work. It took <em>three</em> evenings and one burnt motor.</p>
<h2>What we did</h2>
<ul>
  <li>Soldered the new sensor board</li>
  <li>Wrote the code for the <strong>PID</strong> loop</li>
  <li>Tested on the <a href="https://example.org/track">school track</a></li>
</ul>
<h2>Next meeting</h2>
<ol>
  <li>Bring your laptops</li>
  <li>Charge the batteries</li>
</ol>
<p>Code for the motor test:</p>
<pre><code>
if speed &gt; 100 &amp;&amp; ready:
    run(&lt;motor&gt;)
</code></pre>
<p>Questions? Ask Ms. Lee &amp; Mr. Fischer.</p>
```

What each mark becomes:

| Markdown                                     | HTML                                          | Step                   |
| -------------------------------------------- | --------------------------------------------- | ---------------------- |
| lines of text, then an empty line            | `<p>...</p>`, a paragraph                     | Paragraphs             |
| `# Title`, `## Title`, `### Title`           | `<h1>`, `<h2>`, `<h3>`, a heading             | Headings               |
| `**bold**`                                   | `<strong>bold</strong>`                       | Bold, italic and links |
| `*italic*`                                   | `<em>italic</em>`                             | Bold, italic and links |
| `[text](address)`                            | `<a href="address">text</a>`, a link          | Bold, italic and links |
| `- item` lines                               | `<ul>` with `<li>` items, a list with dots    | Lists                  |
| `1. item` lines                              | `<ol>` with `<li>` items, a list with numbers | Lists                  |
| `&`, `<`, `>`                                | `&amp;`, `&lt;`, `&gt;`                       | Safe characters        |
| a block between two lines of three backticks | `<pre><code>...</code></pre>`                 | Code                   |

**To try your program**, press Run, click in the output box and paste the input. Then press **End input** under the output box (or Ctrl + D). The program reads all the lines until the input ends, then prints the HTML.

Build the program one step at a time, in one file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests give your program other newsletters. Passing them finishes the project.

## Paragraphs

Read all the lines until the input ends: when there are no more lines, `input()` stops with an error called `EOFError`.

Lines of text one after the other make one paragraph, and an empty line ends it. Take the spaces off both ends of each line, join the lines of a paragraph with one space, and put the result between `<p>` and `</p>`:

```text
This week we finally got the line follower to work.
It took three evenings and one burnt motor.
```

becomes

```text
<p>This week we finally got the line follower to work. It took three evenings and one burnt motor.</p>
```

Each paragraph, and each block from the next steps, goes on its own line, in the order they come.

Your program has to remember what it is in the middle of (a paragraph, a list, a block of code) and close it when something else starts. Keep the lines of the paragraph you are building in a list, and write a function that closes whatever is open.

## Headings

A line that starts with one, two or three `#` and then a space is a heading. It closes whatever was open, and becomes `<h1>`, `<h2>` or `<h3>`:

```text
## What we did
```

becomes

```text
<h2>What we did</h2>
```

A line that starts with `#` in another way (`#hashtag`, or four `#`) is normal text.

## Bold, italic and links

Inside paragraphs, headings and list items:

- text between two `**` becomes bold: `<strong>line follower</strong>`
- text between two `*` becomes italic: `<em>three</em>`
- `[school track](https://example.org/track)` becomes a link: `<a href="https://example.org/track">school track</a>`

Do the links first, then the `**` pairs, then the `*` pairs, each from left to right. A mark with no second mark to close it stays as it is.

`text.find(mark)` finds the first mark, and `text.find(mark, start + len(mark))` finds the one that closes it.

## Lists

A line that starts with `- ` is an item of a list with dots. A line that starts with a number, a dot and a space (`1. `) is an item of a list with numbers. Items one after the other make one list: `<ul>` for dots, `<ol>` for numbers. Each item goes on its own line, with two spaces in front:

```text
<ul>
  <li>Soldered the new sensor board</li>
  <li>Wrote the code for the <strong>PID</strong> loop</li>
</ul>
```

A list ends at an empty line, a heading, a normal line of text, or an item of the other kind, which starts a new list.

## Safe characters

In HTML, the characters `<`, `>` and `&` have a meaning of their own. A newsletter that says `Ms. Lee & Mr. Fischer` could confuse the browser. So before anything else in a piece of text, change `&` to `&amp;`, then `<` to `&lt;`, then `>` to `&gt;`, in this order:

```text
<p>Questions? Ask Ms. Lee &amp; Mr. Fischer.</p>
```

Think about it: why must `&` come first?

## Code

A line that is only three backticks opens a block of code, and the next line like it closes the block. Inside the block nothing changes except the safe characters: every line stays as it is, with all its spaces. The block becomes `<pre><code>` on its own line, then the lines of code, then `</code></pre>`:

```text
<pre><code>
if speed &gt; 100 &amp;&amp; ready:
    run(&lt;motor&gt;)
</code></pre>
```

A block of code closes whatever was open before it. If the text ends inside a block, close the block anyway. Now Theodore has his Friday evenings free.
