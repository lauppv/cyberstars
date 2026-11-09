No new theory: this project uses everything from the first part, HTML and CSS. You've built a whole home page, one piece at a time, with a lesson next to you for each one. Now you build a page on your own, from an empty folder: the profile of one crew member.

This is a project of its own, outside the station site, so nothing here touches the pages you've built. Whenever you're not sure how to do a step, open the lesson it comes from again.

## Your files

The folder starts empty. Make two files with **New file**: `index.html` for the page and `style.css` for its look.

## The steps

New crew members arrive every month, and the others want to know who they are. Pick a crew member, real or made up, and build their profile in this order:

1. **The frame.** `index.html` starts with `<!DOCTYPE html>`, says it's in English, can show any letter, and its tab is named **Crew Profile**.
2. **The name.** The crew member's name is the page's one biggest heading.
3. **The job.** Right under the name, a paragraph with their job on board, with the class `role`.
4. **Two parts.** At least two parts about them, each with its own heading one level under the name: their skills, their last mission, their favourite place on the station, whatever you like.
5. **Something important.** Somewhere in those parts, one thing a visitor must not miss, in `<strong>`.
6. **An email link.** A link that starts an email to them.
7. **The style sheet.** `style.css` is linked from the head, and every rule of the page's look is in it.
8. **Centered and slanted.** The name is centered, and the job is in italic.
9. **Colors.** Colors and fonts of your choice, with every paragraph at a contrast of at least 4.5:1 and every heading at least 3:1.
10. **Sizes.** Text sizes in `rem`, so the page grows when a visitor makes their browser's text bigger.
11. **A phone.** On a phone 375 pixels wide, nothing scrolls sideways.

**Example**: a finished profile could show something like this:

```text
Ada Okafor                       (big, centered)
Chief engineer, Docking Ring B   (italic)

Skills
Fixes solar panels in the dark and speaks four languages.

Last Mission
Forty hours outside the station to replace a cracked antenna.   (the first part in bold)

Write to Ada                     (a link)
```

Run the tests whenever you like: they tell you which steps are still missing.
