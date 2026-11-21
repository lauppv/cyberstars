Recursion works on arrays too. The trick is the same: solve a smaller copy of the problem. For an array of n values, the smaller copy is the same array with one value less

```c
#include <stdio.h>

int sum(int v[], int n) {
    if (n == 0) {
        return 0;
    }
    return v[n - 1] + sum(v, n - 1);
}

int main(void) {
    int v[] = { 4, 8, 15, 16 };
    printf("%d\n", sum(v, 4));
    return 0;
}
```

Output

```text
43
```

The sum of 4 values is the last value plus the sum of the first 3. The sum of 0 values is 0, that's our base case. We never copy the array: every call gets the same array and only a smaller n

---

Finding the biggest value works the same way. The biggest of n values is the bigger of two things: the last value, and the biggest of the first n - 1

```c
#include <stdio.h>

int biggest(int v[], int n) {
    if (n == 1) {
        return v[0];
    }
    int rest = biggest(v, n - 1);
    return v[n - 1] > rest ? v[n - 1] : rest;
}

int main(void) {
    int v[] = { 23, 42, 7, 19 };
    printf("%d\n", biggest(v, 4));
    return 0;
}
```

Output

```text
42
```

Here the base case is n == 1: one value is always the biggest of itself. An empty array has no biggest value, so this function needs n to be at least 1

---

Sometimes one size is not enough, and we pass two positions instead: where the part starts and where it ends. Is a word the same read from both ends? Compare the first and the last letter, then check the part between them

```c
#include <stdio.h>
#include <string.h>

int is_mirror(char word[], int left, int right) {
    if (left >= right) {
        return 1;
    }
    if (word[left] != word[right]) {
        return 0;
    }
    return is_mirror(word, left + 1, right - 1);
}

int main(void) {
    char a[] = "level";
    char b[] = "lever";
    printf("%d\n", is_mirror(a, 0, strlen(a) - 1));
    printf("%d\n", is_mirror(b, 0, strlen(b) - 1));
    return 0;
}
```

Output

```text
1
0
```

Each call moves both ends one step closer. When they meet or cross, there is nothing left to compare, so the answer is yes

---

## Mission: The Sensor Log

A temperature sensor in the machine room writes a reading every minute. The shift chief wants two answers from the log: how many readings went over a limit, and if the temperature only went up and never down

1. Read two whole numbers from input: n, the number of readings, and the limit. Then read the n readings into an array
2. Write a recursive function **int count_over(int v[], int n, int limit)** that returns how many of the first n readings are bigger than limit
3. Write a recursive function **int is_rising(int v[], int n)** that returns 1 when each of the first n readings is bigger than or equal to the one before it, and 0 otherwise. One reading counts as rising
4. Print the two answers, as in the example. Use loops only to read the input

n is from 1 to 100

**Example**

Input

```text
5 30
22 28 31 31 40
```

Output

```text
Over 30: 3
Rising: yes
```

**Example**

Input

```text
4 25
26 24 27 30
```

Output

```text
Over 25: 3
Rising: no
```
