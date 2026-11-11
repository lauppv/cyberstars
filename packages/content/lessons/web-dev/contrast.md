Have you tried reading your phone in bright sunshine? Grey text on a white screen almost disappears. Black text still reads fine. The difference between a text's color and its background is called **contrast**, and it decides whether people can read your page.

## Measuring it

Contrast is measured as a **ratio**, from 1:1 to 21:1:

- `1:1` means no difference at all: white text on white;
- `21:1` is the most there is: black on white;
- in between, the bigger the first number, the easier it is to read.

The rules every good website follows:

- normal text needs at least **4.5:1**;
- big text, like headings, needs at least **3:1**, because big letters are easier to make out.

You don't work the ratio out yourself. A **contrast checker** does it: search for "contrast checker", type in the text color and the background color, and it gives you the ratio. Your browser can show it too, as you'll see later in the course.

## Some examples on night blue

On a night blue background, `#0b1d3a`:

- `#f0f4ff`, almost white: about **15:1**. Plenty.
- `#8ecbff`, light blue: about **10:1**. Fine for any text.
- `#1d4e89`, the logo's deep blue: about **2:1**. Too dark, even for a heading.
- `firebrick`: about **2.5:1**. Too dark.

Dark colors that looked great on white fail on a dark page. A dark page needs light colors.

## Why it matters

Low contrast isn't only a problem for people with poor eyesight. It's hard for everyone on a phone outdoors, on a cheap screen, or late at night. Good contrast is one of the easiest things you can do for your visitors.

## Break it on purpose

Make a paragraph dark grey on the night blue, `color: #33415c`. Can you read it? A contrast checker says about 1.6:1. Now try `#c9d6ea`: much better, about 11:1.

---

## Mission: Readable at night

Your page went dark, and some colors that were fine on white now nearly disappear: the part headings, the warnings, maybe your links.

**Example**: every text on the page reads easily: headings in light colors, warnings in a light red on their strip, links in a light color of their own.

- Every paragraph has a contrast of at least 4.5:1 with its background.
- Every link has a contrast of at least 4.5:1.
- Every heading has a contrast of at least 3:1.

Psst, check each color in a contrast checker, with the background it actually sits on :)
