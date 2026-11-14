# Web Development course map

One line per lesson: what it **introduces**. A lesson may use anything above it, nothing below it (`WEB_LESSONS.md`, rule 6). Every lesson follows `WEB_LESSONS.md`.

"From" names the lesson of today's course the idea comes from, or for parts 4 to 9 the topic of their ticket (CYB-113, CYB-114, CYB-115). A slug in **bold** is new.

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

## Part 6: Mission Dashboard (`dashboard.html`, `dashboard.js`)

The crew sees the station at a glance: cards with numbers, a clock, a short video. On a wide window the cards stand in a grid, on a narrow one under each other.

### HTML

| #   | Slug                        | Introduces                                                   | From                    |
| --- | --------------------------- | ------------------------------------------------------------ | ----------------------- |
| 1   | **`video-element`**         | `<video>` with `controls`: a video and its buttons           | Audio, Video and figure |
| 2   | **`video-on-its-own`**      | `autoplay`, `muted` and `loop`: a video that plays by itself | Audio, Video and figure |
| 3   | **`audio-element`**         | `<audio>`: a sound with its buttons                          | Audio, Video and figure |
| 4   | **`captions`**              | `<track>`: the words of a video, for those who can't hear it | Audio, Video and figure |
| 5   | **`figure-and-figcaption`** | `<figure>` and `<figcaption>`: a picture and its caption     | Audio, Video and figure |
| 6   | `dashboard-html-recap`      | No new idea                                                  | Recap                   |

### CSS

| #   | Slug                  | Introduces                                                         | From                     |
| --- | --------------------- | ------------------------------------------------------------------ | ------------------------ |
| 7   | **`display-grid`**    | `display: grid` and `grid-template-columns`: columns               | Columns, Rows and fr     |
| 8   | **`fr-unit`**         | `fr`: a share of the room left                                     | Columns, Rows and fr     |
| 9   | **`grid-rows`**       | `grid-template-rows`, and the rows a grid makes by itself          | Columns, Rows and fr     |
| 10  | **`grid-span`**       | `grid-column: span 2`: an item over two columns                    | Placing Items            |
| 11  | **`grid-lines`**      | `grid-column: 1 / 3` and `grid-row`: an item between two lines     | Placing Items            |
| 12  | **`grid-cell-align`** | `justify-items` and `align-items`: where an item sits in its cell  | Placing Items            |
| 13  | **`template-areas`**  | `grid-template-areas` and `grid-area`: the layout drawn in words   | Template Areas           |
| 14  | **`repeat`**          | `repeat()`: many columns written once                              | repeat, minmax, auto-fit |
| 15  | **`minmax`**          | `minmax()`: a column never narrower than you say                   | repeat, minmax, auto-fit |
| 16  | **`auto-fit`**        | `auto-fit`: as many columns as the room holds                      | repeat, minmax, auto-fit |
| 17  | **`flex-or-grid`**    | Flex for a line of items, grid for rows and columns                | Flex or Grid?            |
| 18  | **`media-queries`**   | `@media (max-width: …)`: rules for a narrow window                 | Media Queries            |
| 19  | **`breakpoints`**     | The width to pick: where the page breaks, not a phone's size       | Media Queries            |
| 20  | **`layout-by-width`** | Other columns or areas on a narrow window                          | Media Queries            |
| 21  | **`mobile-first`**    | The narrow page first, then `min-width` for the wide one           | Mobile First             |
| 22  | **`srcset`**          | `srcset` and `sizes`: the browser picks the picture's size         | Responsive Images        |
| 23  | **`picture-element`** | `<picture>` and `<source media>`: another picture on a narrow page | Responsive Images        |
| 24  | `dashboard-css-recap` | No new idea                                                        | Recap                    |

### JavaScript

| #   | Slug                         | Introduces                                                    | From                            |
| --- | ---------------------------- | ------------------------------------------------------------- | ------------------------------- |
| 25  | **`array-includes`**         | `includes` and `indexOf` on an array                          | Array Methods                   |
| 26  | **`array-slice`**            | `slice` on an array: a part, and the array stays as it was    | Array Methods                   |
| 27  | **`join`**                   | `join`: an array as one text                                  | Array Methods                   |
| 28  | **`split`**                  | `split`: a text as an array                                   | Array Methods                   |
| 29  | **`map`**                    | `map`: a new array, each item changed                         | map                             |
| 30  | **`filter-then-map`**        | Methods one after another: `filter`, then `map`               | map                             |
| 31  | **`reduce`**                 | `reduce`: many values made into one                           | reduce                          |
| 32  | **`find`**                   | `find`: the first item that matches                           | find, some, every               |
| 33  | **`some-and-every`**         | `some` and `every`: is there one? are they all?               | find, some, every               |
| 34  | **`for-in`**                 | `for...in`: every key of an object                            | Looping over Objects            |
| 35  | **`object-keys-and-values`** | `Object.keys` and `Object.values`: an object's keys or values | Looping over Objects            |
| 36  | **`object-entries`**         | `Object.entries`: each key with its value                     | Looping over Objects            |
| 37  | **`dates`**                  | `new Date()`: now, and its parts                              | Dates                           |
| 38  | **`date-text`**              | `toLocaleDateString` and `toLocaleTimeString`: a date to read | Dates                           |
| 39  | **`days-between`**           | One date minus another: milliseconds, then days               | Dates                           |
| 40  | **`set-timeout`**            | `setTimeout`: once, a bit later                               | Timers                          |
| 41  | **`set-interval`**           | `setInterval`: again and again                                | Timers                          |
| 42  | **`clear-interval`**         | `clearInterval`: stop it                                      | Timers                          |
| 43  | **`play-and-pause`**         | `play()` and `pause()`: your own buttons for a video          | Audio and Video from JavaScript |
| 44  | **`mute-button`**            | `muted` from JavaScript                                       | Audio and Video from JavaScript |
| 45  | `dashboard-js-recap`         | No new idea                                                   | Recap                           |
| 46  | `mission-status-project`     | Project: a dashboard for every width, from an empty folder    | Project                         |

## Part 7: Settings and Themes (`settings.html`, `settings.js`, `theme.js`)

The visitor picks how the whole site looks: light or dark, with less movement. The choice is saved, and every page keeps it after a reload.

### HTML

| #   | Slug                   | Introduces                                             | From                        |
| --- | ---------------------- | ------------------------------------------------------ | --------------------------- |
| 1   | **`html-before-aria`** | A `<button>` beats a `<div>` with a `role`: HTML first | ARIA When HTML Isn't Enough |
| 2   | **`aria-pressed`**     | `aria-pressed`: a button that says it is on            | ARIA When HTML Isn't Enough |
| 3   | **`aria-hidden`**      | `aria-hidden`: a picture only for the eye              | ARIA When HTML Isn't Enough |
| 4   | `settings-html-recap`  | No new idea                                            | Recap                       |

### CSS

| #   | Slug                    | Introduces                                            | From                             |
| --- | ----------------------- | ----------------------------------------------------- | -------------------------------- |
| 5   | **`custom-properties`** | `--name` and `var()`: a value named once              | Custom Properties                |
| 6   | **`theme-variables`**   | New values on one class: the whole page changes       | Custom Properties                |
| 7   | **`transitions`**       | `transition`: a change that takes time                | Transitions                      |
| 8   | **`transition-timing`** | How the change moves: `ease`, `linear`, a delay       | Transitions                      |
| 9   | **`translate`**         | `transform: translate()`: move it, the others stay    | Transforms                       |
| 10  | **`rotate-and-scale`**  | `rotate()` and `scale()`                              | Transforms                       |
| 11  | **`keyframes`**         | `@keyframes` and `animation`                          | Keyframe Animations              |
| 12  | **`animation-repeat`**  | `infinite` and `alternate`: an animation that goes on | Keyframe Animations              |
| 13  | **`dark-mode`**         | `prefers-color-scheme`: the system's dark mode        | Dark Mode and Reduced Motion     |
| 14  | **`reduced-motion`**    | `prefers-reduced-motion`: less movement when asked    | Dark Mode and Reduced Motion     |
| 15  | **`visually-hidden`**   | Text only a screen reader reads                       | Hiding Content Only from the Eye |
| 16  | `settings-css-recap`    | No new idea                                           | Recap                            |

### JavaScript

| #   | Slug                      | Introduces                                                          | From                       |
| --- | ------------------------- | ------------------------------------------------------------------- | -------------------------- |
| 17  | **`methods`**             | A function inside an object                                         | Methods and this           |
| 18  | **`this-keyword`**        | `this`: the object the method was called on                         | Methods and this           |
| 19  | **`null-or-undefined`**   | `null` and `undefined`: two kinds of nothing                        | null, undefined, ?. and ?? |
| 20  | **`optional-chaining`**   | `?.`: stop at nothing instead of an error                           | null, undefined, ?. and ?? |
| 21  | **`nullish-default`**     | `??`: a value to fall back on only for nothing, unlike `\|\|`       | null, undefined, ?. and ?? |
| 22  | **`json-stringify`**      | `JSON.stringify`: data as a text                                    | JSON                       |
| 23  | **`json-parse`**          | `JSON.parse`: the text back to data                                 | JSON                       |
| 24  | **`local-storage`**       | `setItem` and `getItem`: kept after a reload                        | localStorage               |
| 25  | **`saving-objects`**      | An array or an object in `localStorage`, through JSON               | localStorage               |
| 26  | **`remove-item`**         | `removeItem`: forget one thing                                      | localStorage               |
| 27  | **`map-collection`**      | `Map`: a key of any kind and its value                              | Map and Set                |
| 28  | **`set-collection`**      | `Set`: each value once                                              | Map and Set                |
| 29  | **`focus-method`**        | `focus()`: take the keyboard to what just changed                   | Accessible Updates         |
| 30  | **`aria-live`**           | `aria-live`: a change a screen reader reads out                     | Accessible Updates         |
| 31  | **`theme-on-every-page`** | The saved theme on every page, before the page shows                | localStorage               |
| 32  | `settings-js-recap`       | No new idea                                                         | Recap                      |
| 33  | `todo-list-project`       | Project: a to-do list saved in `localStorage`, from an empty folder | Project                    |

## Part 8: Starship Tracker (`tracker.html`, `tracker.js`)

The crew follows the starships near the station. The page loads them from the practice API (`https://cyberstars.app/api/practice/starships`), shows something while it waits and a message when the load fails, and reports a new sighting with a POST.

### HTML

| #   | Slug                   | Introduces                                                    | From         |
| --- | ---------------------- | ------------------------------------------------------------- | ------------ |
| 1   | **`template-element`** | `<template>`: HTML the page keeps for later and doesn't show  | `<template>` |
| 2   | **`aria-busy`**        | `aria-busy`: a part of the page that says it is still loading | `aria-busy`  |
| 3   | `tracker-html-recap`   | No new idea                                                   | Recap        |

### CSS

| #   | Slug                | Introduces                                                      | From                   |
| --- | ------------------- | --------------------------------------------------------------- | ---------------------- |
| 4   | **`spinner`**       | A spinner: a round border with one colored side, turning        | Spinners and Skeletons |
| 5   | **`skeleton`**      | A skeleton: grey blocks where the text will come                | Spinners and Skeletons |
| 6   | **`shimmer`**       | A light that moves over the skeleton                            | Spinners and Skeletons |
| 7   | **`while-busy`**    | `[aria-busy="false"]`: the skeletons go once the list is loaded | Spinners and Skeletons |
| 8   | `tracker-css-recap` | No new idea                                                     | Recap                  |

### JavaScript

| #   | Slug                          | Introduces                                                                | From                     |
| --- | ----------------------------- | ------------------------------------------------------------------------- | ------------------------ |
| 9   | **`why-async`**               | The code doesn't wait: what comes after `setTimeout` runs first           | Why Async                |
| 10  | **`new-promise`**             | `new Promise` and `resolve`: a value that comes later                     | Promises                 |
| 11  | **`promise-then`**            | `.then`: do this when the value comes                                     | Promises                 |
| 12  | **`promise-catch`**           | `reject` and `.catch`: a promise that fails                               | Promises                 |
| 13  | **`async-await`**             | `async` and `await`: wait for a promise, line by line                     | async and await          |
| 14  | **`async-returns-promise`**   | An `async` function always gives a promise                                | async and await          |
| 15  | **`fetch-response`**          | `fetch`: ask an address, and the answer's `status`                        | fetch and JSON           |
| 16  | **`response-json`**           | `response.json()`: the answer's text as data                              | fetch and JSON           |
| 17  | **`clone-template`**          | `template.content.cloneNode(true)`: one card for each record              | fetch and JSON           |
| 18  | **`promise-all`**             | `Promise.all`: two loads at once, then both answers                       | fetch and JSON           |
| 19  | **`loading-state`**           | Busy before the load, not busy after it                                   | Loading and Error States |
| 20  | **`response-ok`**             | `response.ok`: an answer that is an error, like 404 or 500                | Loading and Error States |
| 21  | **`try-catch`**               | `try` and `catch`: no network, and the page still answers                 | try, catch, throw        |
| 22  | **`throw-error`**             | `throw new Error`: a bad answer goes to the same `catch`                  | try, catch, throw        |
| 23  | **`finally`**                 | `finally`: the spinner goes away whatever happened                        | try, catch, throw        |
| 24  | **`try-again-button`**        | A button that loads again after an error                                  | Loading and Error States |
| 25  | **`object-destructuring`**    | `const { name, crew } = ship`: an object's values in variables            | Destructuring            |
| 26  | **`array-destructuring`**     | `const [first, second] = ships`: an array's items in variables            | Destructuring            |
| 27  | **`destructured-parameters`** | `({ name }) =>`: take apart what a function gets                          | Destructuring            |
| 28  | **`spread-arrays`**           | `[...a, ...b]`: one array from others                                     | Spread and Rest          |
| 29  | **`spread-objects`**          | `{ ...ship, status: 'Docked' }`: a copy with one value changed            | Spread and Rest          |
| 30  | **`rest-parameters`**         | `(...names)`: a function that takes any number of values                  | Spread and Rest          |
| 31  | **`post-request`**            | `method: 'POST'`, `headers` and a JSON `body`: send a record              | Sending Data (POST)      |
| 32  | **`post-from-form`**          | The form's values sent with a POST, and the new record shown              | Sending Data (POST)      |
| 33  | `tracker-js-recap`            | No new idea                                                               | Recap                    |
| 34  | `space-quiz-project`          | Project: a quiz that loads its questions with fetch, from an empty folder | Project                  |

## Part 9: Tidy Code (no new page)

The site's scripts have grown long. The student splits them into modules and groups what belongs together into classes, then finds bugs with the browser's debugger. Every page keeps working as before.

### JavaScript

| #   | Slug                       | Introduces                                                        | From                             |
| --- | -------------------------- | ----------------------------------------------------------------- | -------------------------------- |
| 1   | **`module-script`**        | `<script type="module">`: a script whose variables stay inside it | import and export                |
| 2   | **`export`**               | `export`: what a file lets other files use                        | import and export                |
| 3   | **`import`**               | `import { … } from './file.js'`: use it in another file           | import and export                |
| 4   | **`export-default`**       | `export default`: the one main thing of a file                    | import and export                |
| 5   | **`shared-module`**        | One module that two pages import                                  | import and export                |
| 6   | **`classes`**              | `class`, `constructor` and `new`: many objects of one kind        | Classes                          |
| 7   | **`class-methods`**        | A method in a class, which every object of it has                 | Classes                          |
| 8   | **`extends`**              | `extends`: a class that starts from another                       | Inheritance                      |
| 9   | **`super`**                | `super()` and `super.method()`: what the first class already does | Inheritance                      |
| 10  | **`getters`**              | `get`: a value worked out when it is read                         | Getters, Setters, Private Fields |
| 11  | **`setters`**              | `set`: a value checked when it is written                         | Getters, Setters, Private Fields |
| 12  | **`private-fields`**       | `#name`: a value only the class can touch                         | Getters, Setters, Private Fields |
| 13  | **`debugger-breakpoints`** | The Sources tab and a breakpoint: stop the code on a line         | Debugging in DevTools            |
| 14  | **`step-through`**         | Step over and step into, and the values while it stops            | Debugging in DevTools            |
| 15  | **`debugger-keyword`**     | `debugger`: a breakpoint written in the code                      | Debugging in DevTools            |
| 16  | `tidy-code-recap`          | No new idea: the site's scripts as modules and classes            | Recap                            |
| 17  | `text-adventure-project`   | Project: a text adventure game in a page, from an empty folder    | Project                          |

## Moved out, because a later part teaches them

- Truthy and falsy (today in `if-else`): part 4 has "Truthy, Falsy, Logical Operators".
- `map`, `find`, `some` (today in `filter`, "Its cousins"): part 6 has `map` and "find, some, every".
- `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` (today in `div-and-span`): part 5 has "Semantic Layout".
- Grid and media queries: part 6. Part 5 lays its pages out with flex and `position` only.
- `??` and `?.` (next to `||` in `or-default`): part 7.
- `::before` (today mentioned in `box-sizing-and-sizes`): part 3 teaches it.
- `flex` and `grid` (today named in `display`): parts 5 and 6.

## Totals

Part 1: 43 lessons (today 22). Part 2: 68 (today 22). Part 3: 45 (today 22). Part 4: 50. Part 5: 39. Part 6: 46. Part 7: 33. Part 8: 34. Part 9: 17. In all, 375 lessons.
