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

The file `sensors.dat` has three space-separated columns: sector, reading_type, and
value. Use `awk` to print **only columns 1 and 3** (sector and value).
