Four teams from the neighbourhood play a Sunday football league in the park, home and away, and the results get argued about all week because nobody keeps the table properly. You'll write the league's program: it takes each result, keeps the table in the right order and answers the questions that come up at the bar afterwards.

You build it one step at a time, in one file. Every step adds a command, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Everything the program reads comes from `input()`, and everything it says goes through `print()`. Run it, then type the lines of an example yourself to see what it answers.

## The teams

The program starts by reading the league: the first line is how many teams, then one team per line, each named by one word.

```text
4
Lions
Tigers
Bears
Wolves
```

Print `League of 4 teams`, then keep reading commands, one per line, until someone types `quit`, and print `Goodbye` then.

## Record a result

`result <home> <goals>-<goals> <away>` records a match, the home team's goals first:

```text
result Lions 2-1 Tigers
Lions 2-1 Tigers recorded
```

Every team hosts every other team once, so the Lions host the Tigers once and play at the Tigers' once. Refuse the result, and record nothing, when:

- a team isn't in the league: `No team named Eagles` (check the home team first)
- both names are the same team: `A team cannot play itself`
- the home team already hosted that team: `Lions already hosted Tigers`

Keep every match with both teams and both scores; everything else in this project is worked out from that list.

## The table

`table` ranks the teams. A win is worth 3 points, a draw 1, a loss nothing. Teams on the same points are ordered by goal difference (goals scored minus goals let in), then by goals scored, then by name.

```text
table
1. Lions: 4 pts, played 2 (W1 D1 L0), goals 4-3 (+1)
2. Tigers: 3 pts, played 2 (W1 D0 L1), goals 5-2 (+3)
3. Wolves: 2 pts, played 2 (W0 D2 L0), goals 2-2 (+0)
4. Bears: 1 pt, played 2 (W0 D1 L1), goals 0-4 (-4)
```

The goal difference always has its sign, `+0` included: the format `{:+d}` does it. A single point reads `1 pt`. A team that hasn't played yet is in the table too, with zeros.

Sorting by several things at once is easier than it sounds: sort a list of tuples whose first values are what matters most. Since the biggest number should come first, store it with a minus sign.

## A team's season

`team <name>` lists a team's matches in the order they were recorded, each with what it meant for that team:

```text
team Lions
Lions 2-1 Tigers (won)
Wolves 2-2 Lions (draw)
```

A team with no match yet prints `Bears have not played yet`; an unknown name `No team named Eagles`.

## Correct a score

The referee's notes sometimes come in late. `correct <home> <goals>-<goals> <away>` replaces the score of a match already recorded, and the table follows:

```text
correct Bears 1-0 Wolves
Bears 0-0 Wolves is now 1-0
```

A match that wasn't played prints `Wolves have not hosted Bears yet`; unknown teams and a team against itself get the same messages as `result`.

## What's left to play

`left` lists every match still to play, home team first, sorted by home team then away team:

```text
left
Bears - Lions
Bears - Tigers
Lions - Bears
Lions - Wolves
Tigers - Lions
Tigers - Wolves
Wolves - Bears
Wolves - Tigers
```

Once the season is over, it prints `Every match is played`.

## Records

`records` settles the arguments at the bar:

```text
records
Most goals scored: Tigers (5)
Fewest goals let in: Tigers (2)
Biggest win: Tigers 4-0 Bears
Goals per match: 3.00
```

- on a tie for most goals scored or fewest let in, the team first by name
- the biggest win is the match with the largest difference between the two scores; on a tie, the one recorded first
- goals per match is all goals divided by the matches played, with two decimals

Before any match, print `No matches yet`.

## Survive bad input

Your program must never stop with an error, whatever gets typed after a few drinks:

- an empty line is skipped, with nothing printed
- a command it doesn't know prints `Unknown command: tabel`
- a known command with the wrong number of words prints how to use it: `Usage: result <home> <goals>-<goals> <away>`, `Usage: correct <home> <goals>-<goals> <away>`, `Usage: team <name>`, and `Usage: table`, `Usage: left` or `Usage: records` when words follow them
- a score that isn't two whole numbers of zero or more joined by a `-` (`two-one`, `2:1`, `-1-2`) prints the usage line of its command

Write a function that turns a score into two numbers and raises an error for anything else, and catch it with `try` / `except`.
