We've seen **for** loops. Now let's put a loop **inside** another loop — a **nested loop**

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            printf("(%d, %d) ", i, j);
        }
        printf("\n");
    }
    return 0;
}
```

Output

```text
(1, 1) (1, 2) (1, 3)
(2, 1) (2, 2) (2, 3)
(3, 1) (3, 2) (3, 3)
```

The **outer loop** controls the **rows**, the **inner loop** controls the **columns**. For every single value of **i**, the inner loop runs **completely** from start to finish. Read the output carefully and trace through the code in your head :)

---

A classic use of nested loops: **printing a pattern**

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\n");
    }
    return 0;
}
```

Output

```text
*
* *
* * *
* * * *
* * * * *
```

Notice that the inner loop goes **up to i**, not up to 5. When **i = 1**, we print 1 star. When **i = 3**, we print 3 stars. This is how we build a **triangle**

---

Nested loops with arrays: imagine a **multiplication table**

```c
#include <stdio.h>

int main(void) {
    int nums[] = {2, 3, 4};
    int n = 3;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("%d * %d = %d\n", nums[i], nums[j], nums[i] * nums[j]);
        }
    }
    return 0;
}
```

This prints **every combination** of two elements from the array. If the array has **n** elements, nested loops give us **n \* n** combinations. When you hear "all pairs", think nested loops

---

Print the following pattern using nested loops

```text
1
1 2
1 2 3
1 2 3 4
1 2 3 4 5
```

Each row **i** prints numbers from **1** to **i**, separated by spaces. Use `printf("%d ", j)` inside the inner loop and `printf("\n")` after it
