**awk** is a powerful text-processing language built into Linux. At its simplest, it
splits each line into fields and lets you print the ones you want.

By default, awk splits on whitespace. Fields are numbered `$1`, `$2`, `$3`, etc. `$0`
is the entire line.

```bash
awk '{print $1}' crew.txt
```

This prints only the first word of each line.

### Printing multiple fields

```bash
awk '{print $1, $3}' data.txt
```

The comma inserts a space between fields in the output.

### Custom field separator with `-F`

If your data uses a different delimiter (like a colon), tell awk:

```bash
awk -F: '{print $2}' /etc/passwd
```

This splits on `:` and prints the second field.

### Adding text

```bash
awk '{print "Name:", $1}' crew.txt
```

```text
Name: Voss
Name: Tanaka
```

You can mix literal strings and field variables freely inside the print statement.

---

## Mission: Sensor Data Extract

Engineering has requested a quick readout of sector names and their sensor values — they do not need the reading type column cluttering the display.

1. Use `awk` to print **only columns 1 and 3** from `sensors.dat` (sector and value), and display them.
2. Save that two-column extract into a new file called `readout.txt`.
3. Create a folder called `sensor-log` and move `readout.txt` into it.
4. Sort the saved readout numerically by the second column so the lowest sensor value appears first.

**Expected result**

`sensor-log/readout.txt` holds each sector name followed by its numeric value, separated by a space.
