# Web Development course map

One line per lesson: what it **introduces**. A lesson may use anything above it, nothing below it (`WEB_LESSONS.md`, rule 6). Every lesson follows `WEB_LESSONS.md`.

"From" names the lesson of today's course the idea comes from. A slug in **bold** is new.

Parts 4 to 9 (CYB-113, CYB-114, CYB-115) are mapped here when their turn comes, in the same way.

## Part 1: Station Home (`index.html`, `style.css`)

HTML and CSS only. JavaScript starts in part 2.

### HTML

| #   | Slug                         | Introduces                                                                   | From                       |
| --- | ---------------------------- | ---------------------------------------------------------------------------- | -------------------------- |
| 1   | `first-page`                 | A tag: `<h1>`, opening and closing tag, element. The editor and the preview. | first-page                 |
| 2   | **`paragraphs`**             | `<p>`                                                                        | first-page                 |
| 3   | **`page-frame`**             | `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`; elements inside elements         | first-page                 |
| 4   | **`page-title`**             | `<title>`, the tab's name                                                    | first-page                 |
| 5   | **`attributes-and-lang`**    | An attribute, with `lang` as the first one                                   | first-page                 |
| 6   | **`any-letter`**             | `<meta charset="UTF-8">`                                                     | first-page                 |
| 7   | `headings`                   | `<h2>` to `<h6>`, levels                                                     | headings                   |
| 8   | **`headings-by-meaning`**    | Pick a heading by meaning, not size; one `h1`, no skipped level              | headings                   |
| 9   | `paragraphs-and-line-breaks` | The browser ignores spaces and Enter                                         | paragraphs-and-line-breaks |
| 10  | **`line-breaks`**            | `<br>`, and when not to use it                                               | paragraphs-and-line-breaks |
| 11  | `bold-italic-and-friends`    | `<strong>` and `<em>`                                                        | bold-italic-and-friends    |
| 12  | **`more-text-tags`**         | `<mark>`, `<small>`, `<sub>`, `<sup>`                                        | bold-italic-and-friends    |
| 13  | **`inline-and-block`**       | Inline and block elements                                                    | bold-italic-and-friends    |
| 14  | `comments`                   | HTML comments                                                                | comments                   |
| 15  | `links`                      | `<a href>`, link words that say where it leads                               | links                      |
| 16  | **`new-tab-links`**          | `target="_blank"`                                                            | links                      |
| 17  | **`email-links`**            | `mailto:`                                                                    | links                      |
| 18  | **`jump-links`**             | `id` and `#` links inside the page                                           | links                      |
| 19  | `images-and-alt`             | `<img src>`                                                                  | images-and-alt             |
| 20  | **`alt-text`**               | `alt`, and why it matters                                                    | images-and-alt             |
| 21  | **`image-size`**             | `width` and `height`                                                         | images-and-alt             |
| 22  | `home-html-recap`            | No new idea                                                                  | home-html-recap            |

### CSS

| #   | Slug                   | Introduces                                         | From                 |
| --- | ---------------------- | -------------------------------------------------- | -------------------- |
| 23  | `what-is-css`          | `style.css` and `<link>`, a first rule             | what-is-css          |
| 24  | **`css-rules`**        | Selector, property, value; several in one rule     | what-is-css          |
| 25  | **`browser-styles`**   | The browser's own styles                           | what-is-css          |
| 26  | `selectors`            | Classes                                            | selectors            |
| 27  | **`ids`**              | Ids in CSS                                         | selectors            |
| 28  | **`class-or-id`**      | Which one to use                                   | selectors            |
| 29  | **`two-rules`**        | Two rules on one element: the later one wins       | selectors            |
| 30  | `colors`               | Color names                                        | colors               |
| 31  | **`hex-colors`**       | Hex colors                                         | colors               |
| 32  | **`rgb-and-alpha`**    | `rgb()` and see-through colors                     | colors               |
| 33  | **`background-color`** | Text and background color together                 | colors               |
| 34  | **`contrast`**         | Contrast, and how to measure it                    | colors               |
| 35  | `text-and-fonts`       | `font-family` and fallbacks                        | text-and-fonts       |
| 36  | **`weight-and-style`** | `font-weight`, `font-style`, `text-transform`      | text-and-fonts       |
| 37  | **`text-spacing`**     | `line-height`, `letter-spacing`                    | text-and-fonts       |
| 38  | **`text-align`**       | `text-align`                                       | text-and-fonts       |
| 39  | `units`                | `px` and `font-size`                               | units                |
| 40  | **`rem`**              | `rem`, and why text sizes in it                    | units                |
| 41  | **`images-that-fit`**  | `max-width: 100%`                                  | units                |
| 42  | `home-css-recap`       | No new idea                                        | home-css-recap       |
| 43  | `crew-profile-project` | Project: a profile page in HTML and CSS, no button | crew-profile-project |

## Part 2: Crew Directory (`crew.html`, `crew.js`)

### HTML

| #   | Slug                | Introduces                     | From            |
| --- | ------------------- | ------------------------------ | --------------- |
| 1   | **`second-page`**   | A second page and a link to it | paths           |
| 2   | `paths`             | Paths: folders and `../`       | paths           |
| 3   | **`nav`**           | `<nav>`, a menu on every page  | paths           |
| 4   | `lists`             | `<ul>` and `<li>`              | lists           |
| 5   | **`ordered-lists`** | `<ol>`                         | lists           |
| 6   | `nested-lists`      | A list inside an item          | nested-lists    |
| 7   | `div-and-span`      | `<div>`                        | div-and-span    |
| 8   | **`span`**          | `<span>`                       | div-and-span    |
| 9   | `crew-html-recap`   | No new idea                    | crew-html-recap |

### CSS

| #   | Slug                     | Introduces                                           | From                   |
| --- | ------------------------ | ---------------------------------------------------- | ---------------------- |
| 10  | `box-model`              | Every element is a box; `padding`                    | box-model              |
| 11  | **`borders`**            | `border`: width, style, color                        | box-model              |
| 12  | **`margins`**            | `margin`                                             | box-model              |
| 13  | **`one-side-or-four`**   | `padding-top`… and the 1, 2 and 4 value shorthands   | box-model              |
| 14  | **`inspect`**            | Seeing the boxes with Inspect                        | box-model              |
| 15  | **`margin-collapse`**    | Margins one above the other don't add up             | box-model              |
| 16  | `box-sizing-and-sizes`   | `width` and `height`                                 | box-sizing-and-sizes   |
| 17  | **`border-box`**         | `box-sizing: border-box`                             | box-sizing-and-sizes   |
| 18  | **`min-and-max`**        | `min-width`, `max-width`, `min-height`, `max-height` | box-sizing-and-sizes   |
| 19  | `margins-and-centering`  | `margin: 0 auto`                                     | margins-and-centering  |
| 20  | **`centering-text`**     | Centering text is not centering a box                | margins-and-centering  |
| 21  | **`body-is-a-box`**      | The body is a box too                                | margins-and-centering  |
| 22  | `display`                | `display`: `block`, `inline`, `inline-block`, `none` | display                |
| 23  | **`bigger-targets`**     | Padding on links to make them easier to press        | display                |
| 24  | `overflow`               | `overflow`                                           | overflow               |
| 25  | **`ellipsis`**           | Cutting a line with `...`                            | overflow               |
| 26  | `borders-radius-shadows` | `border-radius`                                      | borders-radius-shadows |
| 27  | **`one-border`**         | One side's border                                    | borders-radius-shadows |
| 28  | **`shadows`**            | `box-shadow`                                         | borders-radius-shadows |
| 29  | `crew-css-recap`         | No new idea                                          | crew-css-recap         |

### JavaScript: first steps

| #   | Slug                            | Introduces                                 | From                          |
| --- | ------------------------------- | ------------------------------------------ | ----------------------------- |
| 30  | `script-and-defer`              | `<script src>`, a first line               | script-and-defer              |
| 31  | `console-log`                   | The console and `console.log`              | console-log                   |
| 32  | **`console-errors`**            | Reading an error in the console            | console-log                   |
| 33  | **`js-comments`**               | `//` and `/* */`                           | console-log                   |
| 34  | **`defer`**                     | When a script runs, and `defer`            | script-and-defer              |
| 35  | `let-and-const`                 | `const`                                    | let-and-const                 |
| 36  | **`let`**                       | `let`, and which one to pick               | let-and-const                 |
| 37  | **`names`**                     | Good variable names                        | let-and-const                 |
| 38  | `strings-and-template-literals` | Strings and joining with `+`               | strings-and-template-literals |
| 39  | **`template-literals`**         | Template literals                          | strings-and-template-literals |
| 40  | **`string-length-and-case`**    | `length`, `toUpperCase()`, `toLowerCase()` | strings-and-template-literals |
| 41  | **`quotes-inside-quotes`**      | Quotes inside quotes                       | strings-and-template-literals |
| 42  | `selecting-elements`            | `querySelector`                            | selecting-elements            |
| 43  | **`text-content`**              | Reading and writing `textContent`          | selecting-elements            |
| 44  | `first-click`                   | `addEventListener('click', …)`             | first-click                   |
| 45  | `home-js-recap`                 | No new idea                                | home-js-recap                 |

### JavaScript: numbers, lists and functions

| #   | Slug                             | Introduces                                               | From                           |
| --- | -------------------------------- | -------------------------------------------------------- | ------------------------------ |
| 46  | `numbers-and-operators`          | Numbers and `+ - * / %`                                  | numbers-and-operators          |
| 47  | **`rounding`**                   | `Math.round`, `floor`, `ceil`                            | numbers-and-operators          |
| 48  | **`numbers-from-the-page`**      | `Number()` and `NaN`                                     | numbers-and-operators          |
| 49  | `arrays`                         | Making an array, reading by index                        | arrays                         |
| 50  | **`changing-arrays`**            | `push`, `pop`, `length`                                  | arrays                         |
| 51  | **`query-selector-all`**         | `querySelectorAll`                                       | arrays                         |
| 52  | `for-loops`                      | The `for` loop                                           | for-loops                      |
| 53  | **`loop-through-array`**         | A `for` loop through an array                            | for-loops                      |
| 54  | **`building-a-string`**          | Building a string in a loop                              | for-loops                      |
| 55  | **`endless-loops`**              | A loop that never ends                                   | for-loops                      |
| 56  | `for-of`                         | `for...of`                                               | for-of                         |
| 57  | **`adding-up`**                  | Adding up in a loop                                      | for-of                         |
| 58  | `functions`                      | Making and calling a function                            | functions                      |
| 59  | **`parameters`**                 | Parameters                                               | functions                      |
| 60  | `return-values`                  | `return`                                                 | return-values                  |
| 61  | **`doing-or-working-out`**       | A function that does versus one that works something out | return-values                  |
| 62  | `creating-and-removing-elements` | `createElement` and `append`                             | creating-and-removing-elements |
| 63  | **`removing-elements`**          | `remove()`                                               | creating-and-removing-elements |
| 64  | **`old-lists`**                  | A list you read earlier doesn't see new elements         | creating-and-removing-elements |
| 65  | `textcontent-and-innerhtml`      | `innerHTML`                                              | textcontent-and-innerhtml      |
| 66  | **`innerhtml-danger`**           | Why `innerHTML` is dangerous, and the safe way           | textcontent-and-innerhtml      |
| 67  | `crew-js-recap`                  | No new idea                                              | crew-js-recap                  |
| 68  | `cargo-ledger-project`           | Project                                                  | cargo-ledger-project           |

## Part 3: Flight Schedule (`schedule.html`, `schedule.js`)

### HTML

| #   | Slug                       | Introduces                                   | From                     |
| --- | -------------------------- | -------------------------------------------- | ------------------------ |
| 1   | `tables`                   | `<table>`, `<tr>`, `<td>`                    | tables                   |
| 2   | **`table-headers`**        | `<th>`, and tables are for data              | tables                   |
| 3   | `table-sections-and-spans` | `<thead>`, `<tbody>`, `<tfoot>`, `<caption>` | table-sections-and-spans |
| 4   | **`spanning-cells`**       | `colspan` and `rowspan`                      | table-sections-and-spans |
| 5   | `schedule-html-recap`      | No new idea                                  | schedule-html-recap      |

### CSS

| #   | Slug                              | Introduces                                    | From                            |
| --- | --------------------------------- | --------------------------------------------- | ------------------------------- |
| 6   | `combinators`                     | Descendant selector (space)                   | combinators                     |
| 7   | **`child-combinator`**            | `>`                                           | combinators                     |
| 8   | **`sibling-combinators`**         | `+` and `~`                                   | combinators                     |
| 9   | **`table-borders`**               | `border-collapse`                             | combinators                     |
| 10  | `attribute-selectors`             | `[attr]` selectors                            | attribute-selectors             |
| 11  | `pseudo-classes`                  | `:hover`                                      | pseudo-classes                  |
| 12  | **`focus`**                       | `:focus`                                      | pseudo-classes                  |
| 13  | **`first-last-nth`**              | `:first-child`, `:last-child`, `:nth-child`   | pseudo-classes                  |
| 14  | `pseudo-elements`                 | `::before` and `::after`                      | pseudo-elements                 |
| 15  | **`more-pseudo-elements`**        | `::first-letter`, `::marker`, `::placeholder` | pseudo-elements                 |
| 16  | `cascade-specificity-inheritance` | Specificity                                   | cascade-specificity-inheritance |
| 17  | **`order-wins`**                  | Same specificity: the later rule wins         | cascade-specificity-inheritance |
| 18  | **`inheritance`**                 | Inheritance                                   | cascade-specificity-inheritance |
| 19  | **`important`**                   | `!important`, and why to avoid it             | cascade-specificity-inheritance |
| 20  | `backgrounds-and-gradients`       | `background-image` and its size and position  | backgrounds-and-gradients       |
| 21  | **`gradients`**                   | `linear-gradient`, `radial-gradient`          | backgrounds-and-gradients       |
| 22  | `schedule-css-recap`              | No new idea                                   | schedule-css-recap              |

### JavaScript

| #   | Slug                         | Introduces                                      | From                     |
| --- | ---------------------------- | ----------------------------------------------- | ------------------------ |
| 23  | `booleans-and-equality`      | `true` and `false`, comparisons                 | booleans-and-equality    |
| 24  | **`triple-equals`**          | `===` versus `==`                               | booleans-and-equality    |
| 25  | **`and-or-not`**             | `&&`, `\|\|`, `!`                               | booleans-and-equality    |
| 26  | `if-else`                    | `if` and `else`                                 | if-else                  |
| 27  | `else-if-and-the-ternary`    | `else if`                                       | else-if-and-the-ternary  |
| 28  | **`ternary`**                | `? :`                                           | else-if-and-the-ternary  |
| 29  | `while-loops`                | `while`                                         | while-loops              |
| 30  | **`for-or-while`**           | Which loop to pick                              | while-loops              |
| 31  | `break-and-continue`         | `break`                                         | break-and-continue       |
| 32  | **`continue`**               | `continue`                                      | break-and-continue       |
| 33  | `objects`                    | Making an object, reading a property            | objects                  |
| 34  | **`changing-objects`**       | Changing and adding properties                  | objects                  |
| 35  | `arrays-of-objects`          | An array of objects                             | arrays-of-objects        |
| 36  | **`objects-from-the-page`**  | Building objects from the page's rows           | arrays-of-objects        |
| 37  | `filter`                     | `filter`                                        | filter                   |
| 38  | `sort`                       | `sort` with a comparator                        | sort                     |
| 39  | **`sort-changes-the-array`** | `sort` changes the array                        | sort                     |
| 40  | **`reordering-the-page`**    | Putting the page's rows in a new order          | sort                     |
| 41  | `attributes-and-classlist`   | `getAttribute`, `setAttribute`                  | attributes-and-classlist |
| 42  | **`classlist`**              | `classList.add`, `remove`, `contains`           | attributes-and-classlist |
| 43  | **`toggle-button`**          | `classList.toggle`, a button that stays pressed | attributes-and-classlist |
| 44  | `schedule-js-recap`          | No new idea                                     | schedule-js-recap        |
| 45  | `launch-board-project`       | Project                                         | launch-board-project     |

## Moved out, because a later part teaches them

- Truthy and falsy (today in `if-else`): part 4 has "Truthy, Falsy, Logical Operators".
- `map`, `find`, `some` (today in `filter`, "Its cousins"): part 6 has `map` and "find, some, every".
- `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` (today in `div-and-span`): part 5 has "Semantic Layout".
- `::before` (today mentioned in `box-sizing-and-sizes`): part 3 teaches it.
- `flex` and `grid` (today named in `display`): parts 5 and 6.

## Totals

Part 1: 43 lessons (today 22). Part 2: 68 (today 22). Part 3: 45 (today 22). In all, 156 lessons where there are 66 today.
