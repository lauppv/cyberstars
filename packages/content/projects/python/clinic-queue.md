The walk-in clinic on Unirii Street sees patients in the order they need it, not the order they came in: a nurse at the door gives everyone a colour, red for urgent, yellow for soon, green for whenever a doctor is free. Today she keeps the line in her head. You'll write the program at her desk: it keeps the line in the right order, sends the next patient to a free doctor and tells the clinic at the end of the day how long people waited.

You build it one step at a time, in one file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Everything the program reads comes from `input()`, and everything it says goes through `print()`. Run it, then type the lines of an example yourself to see what it answers.

## Doctors on duty

The program starts by reading who works today: the first line is how many doctors, then one name per line.

```text
2
Popa
Marin
```

Print them on one line, in the order they came: `Doctors on duty: Popa, Marin`. Then keep reading commands, one per line, until the nurse types `close`, and print `Clinic closed` then.

Times are written `HH:MM`, all on the same day. A function that turns one into minutes since midnight will save you work in every step.

## Arrivals

`arrive <name> <priority> <time>` puts a patient in line. The priority is `red`, `yellow` or `green`. The line's order is: red before yellow before green, and inside a colour, whoever came first. Say where the patient stands:

```text
arrive Dan green 09:00
Dan is number 1 in line
arrive Ana yellow 09:05
Ana is number 1 in line
arrive Ioana green 09:10
Ioana is number 3 in line
```

Ana came after Dan but goes before him: yellow beats green. Refuse the patient when:

- the priority isn't one of the three: `Priority must be red, yellow or green`
- someone of that name is already waiting: `Ana is already waiting`

Patients are named by one word. Two who arrive at the same minute with the same colour keep the order they were typed in.

## The line

`queue` shows everyone waiting, in the order they'll be called, with their colour and arrival time:

```text
queue
1. Mihai (red, since 09:12)
2. Ana (yellow, since 09:05)
3. Dan (green, since 09:00)
4. Ioana (green, since 09:10)
```

With nobody waiting, print `Nobody is waiting`. Sorting with a key that puts the colour first and the arrival second gives this order in one go.

## Call the next patient

`next <doctor> <time>` sends the first patient in line to a doctor and says how long they waited:

```text
next Popa 09:15
Popa sees Mihai (red), waited 3 min
```

The patient leaves the line. Refuse, and change nothing, when:

- there is no doctor of that name: `No doctor named Pavel`
- the doctor is still with someone: `Popa is still with Mihai`
- nobody is waiting: `Nobody is waiting`

Check them in that order.

## The doctor is free

`done <doctor> <time>` says a doctor finished with their patient, who goes home:

```text
done Popa 09:35
Popa finished with Mihai after 20 min
```

A doctor without a patient prints `Popa has no patient`; an unknown name `No doctor named Pavel`. Only a free doctor can be sent the next patient.

## Getting worse

A patient whose pain gets worse moves up a colour. `worse <name>` makes green yellow and yellow red (red stays red), and keeps their arrival time, so they move up the line among their new colour:

```text
worse Ioana
Ioana is now yellow, number 1 in line
```

A name that isn't waiting prints `Ioana is not waiting`.

## Leaving without being seen

Some patients give up. `leave <name>` takes them out of the line:

```text
leave Dan
Dan left without being seen
```

A name that isn't waiting prints `Dan is not waiting`. Keep their names: the clinic counts them.

## End of the day

`report` tells the clinic how the day went:

```text
report
Patients called in: 3
Average wait, red: 3 min
Average wait, yellow: 23 min
Average wait, green: none
Left without being seen: Dan
Popa: 1 done
Marin: 1 done
```

- **Patients called in** counts every `next` that sent someone in.
- **Average wait** is per colour, from arriving to being called in, rounded to whole minutes; a colour nobody was called in from says `none`. The colour counted is the one the patient had when called in.
- **Left without being seen** lists their names, sorted, separated by commas, or `none`.
- One line per doctor, in the order they came at the start, with how many patients they finished (`done`), not counting the one they're still with.

## Survive bad input

A clinic is a busy place, and the nurse types in a hurry. Your program must never stop with an error:

- an empty line is skipped, with nothing printed
- a command it doesn't know prints `Unknown command: cure`
- a known command with the wrong number of words prints how to use it: `Usage: arrive <name> <priority> <time>`, `Usage: next <doctor> <time>`, `Usage: done <doctor> <time>`, `Usage: worse <name>`, `Usage: leave <name>`, and `Usage: queue` or `Usage: report` when words follow them
- a time that isn't two digits, a colon and two digits making a real time prints the same usage line

Use `try` / `except` where a conversion can fail, rather than checking every character yourself.
