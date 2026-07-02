Combine **arrays**, **looping over arrays**, **break/continue**, and **functions**

---

## Mission: The Operator Certification Report

The shift supervisor collected the grades from the teletype operators' certification test. He needs a quick summary: how many passed, the highest grade, and the first failure, so he can schedule a retest.

1. Read an integer **n** from input — the number of grades
2. Read **n** integer grades into an array
3. Write **int count_passing(int grades[], int n)** — returns how many grades are **>= 50**. Use **continue** to skip grades below 50
4. Write **int find_max(int grades[], int n)** — returns the highest grade
5. Write **int find_first_fail(int grades[], int n)** — returns the **first** failing grade (below 50), in the order it appears in the array. Use **break** to stop as soon as you find one. Return **-1** if everyone passed
6. Print the three results, exactly in the format shown in the example

**Example**

Input

```text
8
85 42 91 67 38 73 95 55
```

Output

```text
Passing: 6
Highest: 95
First fail: 42
```

**Example**

Input

```text
4
60 70 80 90
```

Output

```text
Passing: 4
Highest: 90
First fail: -1
```
