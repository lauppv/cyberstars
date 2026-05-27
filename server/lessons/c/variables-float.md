For numbers with **decimals** (like **3.14** or **1.75**), **int** is not enough. C has two types for decimal numbers: **float** and **double**

```c
#include <stdio.h>

int main(void) {
    float pi = 3.14f;
    double price = 9.99;

    printf("%f\n", pi);
    printf("%f\n", price);

    return 0;
}
```

Output

```text
3.140000
9.990000
```

Two new format specifiers

- **%f** → for a **float** or **double**
- (you’ll also see **%lf** in some C books, mostly for **scanf**, not for **printf**. **%f** works fine for both with **printf**)

By default **%f** prints **6 decimals**. If we want fewer, we can tell **printf** how many digits we want

```c
#include <stdio.h>

int main(void) {
    double pi = 3.14159;
    printf("%.2f\n", pi);   // 2 decimals
    printf("%.4f\n", pi);   // 4 decimals
    return 0;
}
```

Output

```text
3.14
3.1416
```

The **.2** and **.4** between **%** and **f** mean "this many decimals". A small trick that makes output much cleaner

---

What’s the difference between **float** and **double**?

- **float** uses less memory but holds **fewer** correct digits
- **double** uses more memory but holds **more** precise values

In practice, **use double** unless you have a strong reason not to. **double** is the default kind of decimal number in C

Notice the **f** at the end of **3.14f** in the float example. This tells C "treat this as a float, not a double". Without the **f**, the value **3.14** would be a double. For **double** variables, you don’t need any suffix

---

Now, the famous trap from the previous lesson, fixed

```c
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;
    double result = a / b;
    printf("%f\n", result);
    return 0;
}
```

You’d expect **3.5**. But the output is **3.000000**. Why?

Because **a / b** is computed **first**, with both **a** and **b** being ints. The result is **3** (integer division). Only **after** that, **3** is stored in **result** as **3.0**. By that point, the **.5** is already lost forever

To get the real answer, **at least one** operand must be a decimal

```c
#include <stdio.h>

int main(void) {
    double a = 7;
    int b = 2;
    printf("%f\n", a / b);   // 3.500000
    return 0;
}
```

Or we can use a **cast** to force one to be a double

```c
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;
    printf("%f\n", (double) a / b);   // 3.500000
    return 0;
}
```

**(double)** in front of **a** says "treat this as a double for this operation". This is called a **cast**, and it’s a tool you’ll use a lot in C

---

On the right, complete the code so it prints

```text
My height is 1.75
Pi is approximately 3.14
```

Tip: use **%.2f** to display with 2 decimals only :)
