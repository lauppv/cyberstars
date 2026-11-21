Put together negative indexes and slices with steps, split and join, format specs, and the codes of the characters

---

## Mission: Systems Report

Every hour the station sends a short log of its systems: each system's name and how well it works, in percent. The log is one line, with a `;` between the systems and a `=` between a name and its value

1. Start your program with a variable **log**, a string. For example `log = "ion drive=93.456;shield=7.1;life support=100"`
2. For each system, print one line: the name in a column 14 characters wide, on the left, then the value in a column 6 characters wide, on the right, with 1 decimal, then ` %`
3. Print `Code: ` and the first letter of each system's name, in capitals, from the last system to the first
4. Print `Key: ` and the total of the codes of the letters in the Code

**log** has from 1 to 8 systems. A name has from 1 to 14 characters, small letters and spaces, and never starts with a space. A value is a number from 0 to 100, with at most 3 decimals

**Example** for log = "ion drive=93.456;shield=7.1;life support=100"

```text
ion drive       93.5 %
shield           7.1 %
life support   100.0 %
Code: LSI
Key: 232
```

`L` comes first because life support is the last system. The Key is 76 + 83 + 73, the codes of `L`, `S` and `I`
