Read until the input ends, split lines with strtok and turn text into numbers, all in one small program

---

## Mission: The Operator Console

The mainframe has a small console where operators type short commands. Each command is one short word, then its arguments, separated by spaces. You are writing the program that answers them

1. Read commands, one per line, until the input ends
2. Split each line into words with strtok. The first word is the command
3. Answer each command with one line
   - **add** followed by whole numbers: print their sum
   - **max** followed by whole numbers: print the biggest one
   - **echo** followed by any words: print the words with exactly one space between them
   - any other command: print `Unknown command: ` and the command
4. Check each number of add and max with strtol. If one of them is not a whole number, print `Bad number: ` and the first such word instead of the answer

add and max always get at least one argument. There are no empty lines, and each line has at most 100 characters

**Example**

Input

```text
add 3 4 5
max 7 2 9
echo hello   tape   room
add 2 x
jump 1
```

Output

```text
12
9
hello tape room
Bad number: x
Unknown command: jump
```
