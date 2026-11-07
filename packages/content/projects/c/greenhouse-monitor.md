A family grows tomatoes in a greenhouse outside Cluj, and last summer a hot afternoon cooked half the plants while nobody was looking. They've put sensors inside, for temperature, air humidity and soil moisture, wired to a small computer. You'll write the program that reads them: it checks every reading against its safe range, raises an alarm when something stays wrong, keeps the latest readings and saves them to a file.

You build it one step at a time, in one C file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads everything with `scanf` and writes everything with `printf`. Commands are words: `scanf("%s", cmd)` reads the next one, and `strcmp` tells which it is. Run it, then type the lines of an example yourself to see what it answers.

## The sensors

The program starts by reading the sensors: the first line is how many (at most 10), then one line per sensor with its id, what it measures and the lowest and highest safe values:

```text
3
T1 temperature 18 28
H1 humidity 50 80
S1 soil 30 60
```

Keep them in an array of structs, with the limits as `double`. Print `Monitoring 3 sensors`, then keep reading commands until someone types `quit`, and print `Stopped` then. Any other word prints `Unknown command: water`, and the rest of its line is skipped with `scanf("%*[^\n]")`.

## Take a reading

`read <sensor> <value>` records a reading and says whether it's safe. Values print with one decimal:

```text
read T1 22.5
T1 22.5 ok
read T1 29.5
T1 29.5 too high (max 28.0)
```

Below the minimum reads `too low (min 18.0)`. An unknown sensor prints `No sensor X9`, and a value that isn't a number `Usage: read <sensor> <value>`; both skip the rest of the line.

## Statistics

`stats <sensor>` sums up everything a sensor has read since the start:

```text
stats T1
T1: 7 readings, min 22.5, max 31.8, average 27.9
```

A sensor with no reading yet prints `H1 has no readings`. You don't need to keep every reading for this: a count, a sum, the lowest and the highest are enough, updated on every `read`.

## The alarm

One hot reading can be a sunbeam on the sensor; three in a row means trouble. When a sensor reads outside its range for the third time in a row, print an alarm right after the reading's line:

```text
read T1 30.2
T1 30.2 too high (max 28.0)
ALARM: T1 out of range 3 times in a row
```

The alarm sounds once for that run: the fourth bad reading in a row doesn't repeat it. A safe reading ends the run, and three bad ones after it sound the alarm again. Count the alarms of each sensor; the report needs them.

## The latest readings

Each sensor keeps its 10 newest readings in an array, oldest first. When an 11th comes in, the oldest is dropped: shift the others one place left and put the new one at the end.

`history <sensor> <count>` prints the newest readings, at most that many, oldest first:

```text
history T1 3
T1: 30.2 31.8 26.0
```

Asking for more than it has prints all it has, and a sensor with none prints `T1 has no readings`. A count that isn't a whole number of at least 1 prints `Usage: history <sensor> <count>`.

## The trend

Is it getting hotter? `trend <sensor>` compares the average of the 3 newest readings with the average of the 3 before them. A difference of more than 0.5 is `rising` or `falling`, anything less `steady`:

```text
trend T1
T1 is falling (25.2 -> 23.0)
```

With fewer than 6 readings kept, print `H1 needs 6 readings for a trend`.

## The report

`report` shows every sensor, in the order loaded, with its kind, its newest reading, whether that's safe, and how many alarms it raised:

```text
report
T1 temperature: 22.1 ok, 1 alarm
H1 humidity: 65.0 ok, 0 alarms
S1 soil: no readings
```

## Save to a file

The family wants to look at the readings on their laptop. `export <file>` writes every kept reading to a CSV file: a header line, then one line per reading, sensor by sensor in the order loaded, oldest first. Use `fopen`, `fprintf` and `fclose`:

```text
export log.csv
Saved 11 readings to log.csv
```

`show <file>` prints a file back, line by line with `fgets`, so you can check what was written:

```text
show log.csv
sensor,reading
T1,29.5
T1,31.0
...
H1,65.0
```

A file that can't be opened prints `Cannot read nope.csv` (or `Cannot write ...` for `export`): always check what `fopen` returns before using it.
