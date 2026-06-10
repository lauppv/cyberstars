Combine **arrays**, **looping over arrays**, **break/continue**, and **functions**

---

## Mission: Crew Fitness Report

The station doctor, Lance, logged fitness scores for the crew. He needs a quick summary: how many passed, the top score, and the first failure so he can schedule a retest.

The data is already on the right. Do the following, in order:

1. Write **int count_passing(int grades[], int n)** — returns how many grades are **>= 50**. Use **continue** to skip grades below 50
2. Write **int find_max(int grades[], int n)** — returns the highest grade
3. Write **int find_first_fail(int grades[], int n)** — returns the **first** failing grade (below 50). Use **break** to stop as soon as you find one. Return **-1** if everyone passed

**Output**

```text
Passing: 6
Highest: 95
First fail: 42
```
