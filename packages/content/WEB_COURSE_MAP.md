# Web Development course map

One line per lesson: what it **introduces**. A lesson may use anything above it, nothing below it (`WEB_LESSONS.md`, rule 6). Every lesson follows `WEB_LESSONS.md`.

"From" names the lesson of today's course the idea comes from, or for parts 4 and 5 the topic of their ticket (CYB-113). A slug in **bold** is new.

Parts 6 to 9 (CYB-114, CYB-115) are mapped here when their turn comes, in the same way.

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

## Part 4: Boarding Form (`boarding.html`, `boarding.js`)

A passenger books a seat on one of the station's flights. The form asks, the page checks, and the script answers.

### HTML

| #   | Slug                      | Introduces                                                      | From                     |
| --- | ------------------------- | --------------------------------------------------------------- | ------------------------ |
| 1   | **`text-fields`**         | `<input>`: a box the visitor types in                           | Forms and Labels         |
| 2   | **`labels`**              | `<label for>`: a field's name, tied to it by its id             | Forms and Labels         |
| 3   | **`placeholder`**         | `placeholder`, a hint inside the field, and why it's no label   | Forms and Labels         |
| 4   | **`forms`**               | `<form>` and its button: sending what was typed                 | Forms and Labels         |
| 5   | **`field-names`**         | `name`: what a form sends, as `name=value`                      | What a Form Sends        |
| 6   | **`input-types`**         | `type="email"` and `type="tel"`: the type picks the keyboard    | Input Types              |
| 7   | **`number-fields`**       | `type="number"` with `min`, `max` and `step`                    | Input Types              |
| 8   | **`date-fields`**         | `type="date"`, and the value it gives: `2031-05-14`             | Input Types              |
| 9   | **`checkboxes`**          | `type="checkbox"`, its `value` and `checked`                    | Checkboxes and Radios    |
| 10  | **`radio-buttons`**       | `type="radio"`: one name, one choice                            | Checkboxes and Radios    |
| 11  | **`fieldset-and-legend`** | `<fieldset>` and `<legend>`: a question over a group of choices | Checkboxes and Radios    |
| 12  | **`select-lists`**        | `<select>` and `<option value>`                                 | Select, Textarea, Button |
| 13  | **`textareas`**           | `<textarea>`: room for a longer text                            | Select, Textarea, Button |
| 14  | **`button-types`**        | A button's `type`: `submit`, `button`, `reset`                  | Select, Textarea, Button |
| 15  | **`required-fields`**     | `required`, and the browser's own message                       | Built-in Validation      |
| 16  | **`length-limits`**       | `minlength` and `maxlength`                                     | Built-in Validation      |
| 17  | **`form-action`**         | `action` and `method`: where a form goes, and how               | What a Form Sends        |
| 18  | `boarding-html-recap`     | No new idea                                                     | Recap                    |

### CSS

| #   | Slug                    | Introduces                                                | From          |
| --- | ----------------------- | --------------------------------------------------------- | ------------- |
| 19  | **`fields-look`**       | Fields don't take the page's font: `font: inherit`        | Styling Forms |
| 20  | **`form-layout`**       | A label above its field, one field a line                 | Styling Forms |
| 21  | **`focus-visible`**     | `:focus-visible`: a ring for the keyboard only            | Styling Forms |
| 22  | **`valid-and-invalid`** | `:valid` and `:invalid`                                   | Styling Forms |
| 23  | **`user-invalid`**      | `:user-invalid`: only once the visitor has tried          | Styling Forms |
| 24  | **`checked-state`**     | `:checked`, and `+` to light up the chosen option's label | Styling Forms |
| 25  | **`disabled-fields`**   | `disabled` and `:disabled`                                | Styling Forms |
| 26  | **`accent-color`**      | `accent-color` for boxes and round buttons                | Styling Forms |
| 27  | **`spacing`**           | Room shows what belongs together                          | Design Basics |
| 28  | **`hierarchy`**         | The most important thing stands out the most              | Design Basics |
| 29  | `boarding-css-recap`    | No new idea                                               | Recap         |

### JavaScript

| #   | Slug                    | Introduces                                                   | From                           |
| --- | ----------------------- | ------------------------------------------------------------ | ------------------------------ |
| 30  | **`field-value`**       | `.value`: what is in a field now                             | Keyboard and Input             |
| 31  | **`event-object`**      | The event object and `event.target`                          | The Event Object               |
| 32  | **`input-event`**       | The `input` event: react while the visitor types             | Keyboard and Input             |
| 33  | **`change-event`**      | `change`, and `.checked` for a box                           | Keyboard and Input             |
| 34  | **`keyboard-events`**   | `keydown` and `event.key`                                    | Keyboard and Input             |
| 35  | **`submit-event`**      | Listening for `submit`                                       | submit and preventDefault      |
| 36  | **`prevent-default`**   | `preventDefault`: the page answers, the form isn't sent      | submit and preventDefault      |
| 37  | **`truthy-and-falsy`**  | Truthy and falsy: an empty text counts as false              | Truthy and Falsy               |
| 38  | **`or-default`**        | `\|\|` for a value to fall back on                           | Truthy and Falsy               |
| 39  | **`switch`**            | `switch`                                                     | switch                         |
| 40  | **`trim`**              | `trim()`                                                     | String Methods                 |
| 41  | **`string-includes`**   | `includes`, `startsWith`, `endsWith`                         | String Methods                 |
| 42  | **`string-slice`**      | `slice` and `indexOf` on a text                              | String Methods                 |
| 43  | **`regex-test`**        | A regular expression and `test`                              | Regex Basics                   |
| 44  | **`regex-patterns`**    | `[ ]`, `\d`, `{ }`, `^` and `$`                              | Regex Basics                   |
| 45  | **`pattern-attribute`** | `pattern`: the same rule in the HTML                         | Regex Basics                   |
| 46  | **`error-messages`**    | Writing the error next to its field                          | Validating Forms in JavaScript |
| 47  | **`custom-validity`**   | `setCustomValidity`: your rule, the browser's message        | Validating Forms in JavaScript |
| 48  | **`aria-describedby`**  | `aria-describedby` and `aria-invalid`: an error you can hear | Validating Forms in JavaScript |
| 49  | `boarding-js-recap`     | No new idea                                                  | Recap                          |
| 50  | `cargo-request-project` | Project: a request form, from an empty folder                | Project                        |

## Part 5: Station Wiki (`wiki.html`, `wiki-*.html`, `menu.js`)

Every page gets the same header, menu and footer. The wiki's pages join them next to the others, and the menu opens from a button on a phone.

### HTML

| #   | Slug                     | Introduces                                                  | From                    |
| --- | ------------------------ | ----------------------------------------------------------- | ----------------------- |
| 1   | **`header-and-footer`**  | `<header>` and `<footer>`                                   | Semantic Layout         |
| 2   | **`main-element`**       | `<main>`: the page's own part                               | Semantic Layout         |
| 3   | **`landmarks`**          | Landmarks: a screen reader jumps between them; `aria-label` | Semantic Layout         |
| 4   | **`section-element`**    | `<section>`: a part of the page, with its heading           | section, article, aside |
| 5   | **`article-element`**    | `<article>`: a piece that stands on its own                 | section, article, aside |
| 6   | **`aside-element`**      | `<aside>`: a note beside the main text                      | section, article, aside |
| 7   | **`meta-description`**   | `<meta name="description">`: the page in a sentence         | Meta Tags and the Head  |
| 8   | **`viewport`**           | `<meta name="viewport">`: a page made for the phone's width | Meta Tags and the Head  |
| 9   | **`special-characters`** | `&lt;`, `&gt;` and `&amp;`                                  | Special Characters      |
| 10  | **`non-breaking-space`** | `&nbsp;`: two words that stay on one line                   | Special Characters      |
| 11  | `wiki-html-recap`        | No new idea                                                 | Recap                   |

### CSS

| #   | Slug                    | Introduces                                            | From                  |
| --- | ----------------------- | ----------------------------------------------------- | --------------------- |
| 12  | **`display-flex`**      | `display: flex`: children side by side                | display: flex         |
| 13  | **`flex-direction`**    | `flex-direction`: a row or a column                   | Flex Direction        |
| 14  | **`justify-content`**   | `justify-content`: where the items sit along the line | justify and align     |
| 15  | **`align-items`**       | `align-items`: where they sit across it               | justify and align     |
| 16  | **`gap`**               | `gap`: room between the items                         | wrap and gap          |
| 17  | **`flex-wrap`**         | `flex-wrap`: a new row when there is no room          | wrap and gap          |
| 18  | **`flex-grow`**         | `flex-grow`: share the room left                      | grow, shrink, basis   |
| 19  | **`flex-basis`**        | `flex-basis`: an item's size to start from            | grow, shrink, basis   |
| 20  | **`flex-shrink`**       | `flex-shrink`: who gives up room first                | grow, shrink, basis   |
| 21  | **`align-self`**        | `align-self`: one item sits its own way               | align-self and order  |
| 22  | **`flex-order`**        | `order`, and why the keyboard doesn't follow it       | align-self and order  |
| 23  | **`margin-auto`**       | `margin-left: auto`: push an item to the far end      | justify and align     |
| 24  | **`position-relative`** | `position: relative`: a nudge from its own place      | relative and absolute |
| 25  | **`position-absolute`** | `position: absolute`: a place inside its box          | relative and absolute |
| 26  | **`position-fixed`**    | `position: fixed`: it stays when the page scrolls     | fixed and sticky      |
| 27  | **`position-sticky`**   | `position: sticky`: it scrolls, then stays            | fixed and sticky      |
| 28  | **`z-index`**           | `z-index`: which one is on top                        | z-index               |
| 29  | `wiki-css-recap`        | No new idea                                           | Recap                 |

### JavaScript

| #   | Slug                       | Introduces                                                      | From                         |
| --- | -------------------------- | --------------------------------------------------------------- | ---------------------------- |
| 30  | **`arrow-functions`**      | An arrow function in a variable, and the short one that returns | Arrow Functions and Defaults |
| 31  | **`default-parameters`**   | A parameter's default value                                     | Arrow Functions and Defaults |
| 32  | **`scope`**                | A variable lives in its block                                   | Scope                        |
| 33  | **`style-property`**       | `element.style`: one style from JavaScript                      | Styles from JavaScript       |
| 34  | **`bubbling`**             | An event goes up through the parents                            | Bubbling and Delegation      |
| 35  | **`event-delegation`**     | One listener for many elements, with `closest`                  | Bubbling and Delegation      |
| 36  | **`shared-script`**        | One script on every page, which checks its element is there     | Recap                        |
| 37  | **`aria-expanded`**        | `aria-expanded`: a button says what it opened                   | Recap                        |
| 38  | `wiki-js-recap`            | No new idea: a menu that opens from a button                    | Recap                        |
| 39  | `spaceport-launch-project` | Project: a launch page, from an empty folder                    | Project                      |

## Moved out, because a later part teaches them

- Truthy and falsy (today in `if-else`): part 4 has "Truthy, Falsy, Logical Operators".
- `map`, `find`, `some` (today in `filter`, "Its cousins"): part 6 has `map` and "find, some, every".
- `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` (today in `div-and-span`): part 5 has "Semantic Layout".
- Grid and media queries: part 6. Part 5 lays its pages out with flex and `position` only.
- `??` and `?.` (next to `||` in `or-default`): part 7.
- `::before` (today mentioned in `box-sizing-and-sizes`): part 3 teaches it.
- `flex` and `grid` (today named in `display`): parts 5 and 6.

## Totals

Part 1: 43 lessons (today 22). Part 2: 68 (today 22). Part 3: 45 (today 22). Part 4: 50. Part 5: 39. In all, 245 lessons.
