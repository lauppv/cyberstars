We already saw **+**, **-**, **\***, **/** in earlier lessons. Let’s look at the rest of C’s arithmetic toolkit

```c
#include <stdio.h>

int main(void) {
    int a = 17;
    int b = 5;

    printf("%d\n", a + b);   // addition
    printf("%d\n", a - b);   // subtraction
    printf("%d\n", a * b);   // multiplication
    printf("%d\n", a / b);   // division
    printf("%d\n", a % b);   // remainder (modulo)

    return 0;
}
```
Output
```text
22
12
85
3
2
```

The interesting one is **a / b = 3**, not **3.4**. Why? **a** and **b** are both **int**, so C does **integer division** and throws away the decimal part. We covered this in **variables-float**

---

The new operator is **%**, called **modulo** (or "remainder")
```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 17 % 5);   // 2
    printf("%d\n", 20 % 4);   // 0
    return 0;
}
```
**17 / 5 = 3** with remainder **2**, so **17 % 5 = 2**. **20 / 4 = 5** exactly, so the remainder is **0**

Classic use case: checking if a number is **even**
```c
#include <stdio.h>

int main(void) {
    int n = 10;
    if (n % 2 == 0) {
        printf("even\n");
    } else {
        printf("odd\n");
    }
    return 0;
}
```

---

C has handy **shortcuts** (same as Java)

- **a++** is the same as **a = a + 1**
- **a--** is the same as **a = a - 1**
- **a += 5** is the same as **a = a + 5**
- **a -= 3** is the same as **a = a - 3**
- **a *= 2** is the same as **a = a * 2**
- **a /= 4** is the same as **a = a / 4**

You’ll see **i++** in **for** loops literally everywhere :)

---

What about **powers**? C doesn’t have a built-in power operator. We use **pow()** from the math library
```c
#include <stdio.h>
#include <math.h>

int main(void) {
    printf("%f\n", pow(2, 3));   // 8.000000
    return 0;
}
```
**pow()** always returns a **double**, so even **2 ** 3** comes out as **8.000000**, not **8**

To use **pow()** we need **#include <math.h>**. On some systems, you also need to link the math library with **-lm** when compiling, but our platform handles that for us :)

---

The **order of operations** is the same as in math: **\*** and **/** before **+** and **-**
```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 2 + 3 * 4);     // 14, not 20
    printf("%d\n", (2 + 3) * 4);   // 20
    return 0;
}
```
When in doubt, **add parentheses**. They make the code easier to read anyway

---

You have two variables **a** and **b** on the right. Display **on separate lines** the result of
```text
a + b
a - b
a * b
a / b
a % b
```

For **a = 17** and **b = 5** the output should be
```text
22
12
85
3
2
```

Play around, **run** the code several times, see how the output changes :)
