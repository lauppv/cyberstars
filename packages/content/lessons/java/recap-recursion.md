Put recursion to work on a problem where loops get stuck: trying every possibility, one choice at a time

---

## Mission: Safe Cracker

Tommy is in front of Diaz's safe. The combination has a known number of digits, and his informant swears the digits add up to a known number. Tommy wants a list of every combination that fits, so he can try them in order.

Store the number of digits in an `int` named `length` and the sum of the digits in an `int` named `target`. Print every combination of `length` digits, each digit from 0 to 9, whose digits add up to `target`, from the smallest to the biggest. Leading zeros count, so `03` is a combination of 2 digits. Then print `Found: N`.

The number of digits changes, so you can't write one loop per digit. Write a recursive method that picks one digit, then lets the next call pick the rest. Make it give back how many combinations it found.

**Example** for `length = 2` and `target = 3`

```text
03
12
21
30
Found: 4
```

**Example** for `length = 3` and `target = 1`

```text
001
010
100
Found: 3
```

**Example** for `length = 1` and `target = 12`

```text
Found: 0
```
