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

Engineering wants a quick readout of `sensors.dat`: each sector with its value, without the column that says what kind of reading it is. Save it as `sensor-log/readout.txt`, the sector and its value separated by a space, the lowest value first.

**Expected result**

`sensor-log/readout.txt` holds two columns, sector and value, ordered from the lowest value to the highest.
