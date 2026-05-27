# Easy · Counter Class

Create a **Counter** class that keeps track of an integer value. It should support three operations:

- `increment()` — adds 1 to the value
- `decrement()` — subtracts 1 from the value
- `getValue()` — returns the current value

The counter starts at **0**. Read commands from stdin (one per line): `inc`, `dec`, or `get`. For each `get` command, print the current value on a new line.

### Input

- Line 1: an integer N — the number of commands
- Next N lines: a command (`inc`, `dec`, or `get`)

### Output

- For each `get` command, print the current counter value on a separate line.

### Examples

```
Input:
5
inc
inc
get
dec
get

Output:
2
1
```

```
Input:
4
dec
dec
dec
get

Output:
-3
```

### Hints

- Use a private field to store the counter value and public methods to modify it.
- A constructor can initialize the value to 0 (or rely on Java's default for `int`).
- Only print when you encounter a `get` command.
- This is a great exercise for understanding encapsulation in Java!
