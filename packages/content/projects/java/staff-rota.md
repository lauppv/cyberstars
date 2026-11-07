Cafe Boema opens from six in the morning to ten at night, seven days a week, with a cook, a barista and waiters on every shift. The manager builds the weekly rota in a spreadsheet and keeps getting it wrong: someone closes at ten and opens again at six, a part-timer ends up with too many shifts, Saturday evening has one waiter for a full house. You'll write the rota program: it refuses every shift that breaks a rule, shows the week, finds the shifts still short of people and works out the wages.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## The staff

The program starts by reading the staff: how many, then one line each with their name, role, hourly wage and the most shifts they can work in a week:

```text
5
Ana cook 30 5
Dan barista 25 4
Ioana waiter 22 5
Leo waiter 22 2
Sara barista 25 5
```

The roles are an `enum`, `COOK`, `BARISTA` and `WAITER`. Make a `Worker` class that remembers, for every day of the week, which shifts they work. Print `Cafe with 5 staff`, then keep reading commands until the manager types `quit`, and print `Bye` then. Any other word prints `Unknown command: work`.

## Days and shifts

The week runs `Mon` to `Sun`, typed in any case. There are two shifts a day, another `enum` holding their hours: `MORNING` from 6 to 14 and `EVENING` from 14 to 22, typed in any case and printed in small letters.

`assign <name> <day> <shift>` puts someone on a shift:

```text
assign Ana mon morning
Ana works Mon morning
```

A name that isn't on the staff prints `No one called Mara`, a day that isn't one of the seven `Days are mon to sun`, a shift that isn't one of the two `Shifts are morning and evening`, and someone already on that shift `Ana already works Mon morning`.

## The rules

The manager's rules, checked in this order after the ones above:

- no double shifts, both shifts of one day: `Ana already works Mon morning, no double shifts`
- no more shifts a week than the worker's limit: `Leo already has 2 shifts this week`
- enough rest: an evening shift ends at 22 and a morning one starts at 6, so nobody works an evening and the next day's morning, whichever is assigned first. Assigning Wed morning to someone on Tue evening prints `Ana works Tue evening, too little rest`, and assigning Tue evening to someone on Wed morning `Ana works Wed morning, too little rest`

Write the rules as one method that returns why a worker can't take a shift, or `null` when they can: the next steps use it again. Sunday evening and the next Monday belong to different weeks, so they don't clash.

## The week's rota

`rota` prints every shift of the week in order, with who works it, in the order the staff came:

```text
rota
Mon morning: Ana, Dan, Ioana
Mon evening: -
Tue morning: -
Tue evening: Ana
...
Sun evening: -
```

`drop <name> <day> <shift>` takes someone off a shift, `Ana is off Tue evening`, or prints `Ana doesn't work Tue evening`.

## Swapping shifts

Staff swap shifts among themselves. `swap <from> <to> <day> <shift>` gives one person's shift to another, if the other one could take it:

```text
swap Dan Sara mon morning
Sara takes Dan's Mon morning
```

Refuse, in this order, when the first person doesn't work that shift (`Dan doesn't work Mon morning`), the second has another role (`Dan is not a cook`), or the second breaks a rule (the rule's own line). Your rules method answers the last one.

## Short-handed shifts

Every shift needs at least 1 cook, 1 barista and 1 waiter, and 2 waiters on Saturday and Sunday. `gaps` lists every shift short of someone, in order, with what's missing, then how many shifts are short:

```text
gaps
Mon evening needs 1 cook, 1 barista, 1 waiter
Tue morning needs 1 cook, 1 barista, 1 waiter
...
Sun evening needs 1 cook, 1 barista, 2 waiters
13 shifts short
```

The roles come in the order of the enum. When everything is covered, print only `Every shift is covered`.

## Wages

`pay` works out the week's wages: every shift is 8 hours at the worker's hourly wage, and hours on Saturday and Sunday pay one and a half times as much. One line per worker, in the order they came, then the total:

```text
pay
Ana: 1 shift, 240.00
Dan: 0 shifts, 0.00
Ioana: 1 shift, 176.00
Leo: 2 shifts, 528.00
Sara: 1 shift, 200.00
Total: 1144.00
```

Let the shift's enum give its own hours (`end - start`), so changing the opening hours later changes the wages too. Finally, check that the program never stops with an exception: commands with the wrong number of words print their usage line (`Usage: assign <name> <day> <shift>`, `Usage: drop <name> <day> <shift>`, `Usage: swap <from> <to> <day> <shift>`).
