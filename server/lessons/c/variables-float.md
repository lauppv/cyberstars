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
- (you'll also see **%lf** in some C books, mostly for **scanf**, not for **printf**. **%f** works fine for both with **printf**)

By default, **%f** prints **6 decimals**. If we want fewer, we can tell **printf** how many digits we want

```c
#include <stdio.h>

int main(void) {
    double pi = 3.14159;
    printf("%.2f\n", pi);
    printf("%.4f\n", pi);
    return 0;
}
```

Output

```text
3.14
3.1416
```

The **.2** and **.4** between **%** and **f** mean "this many decimals". A small trick that makes the output much cleaner

---

What is the difference between **float** and **double**?

- **float** uses less memory but keeps **fewer** correct digits
- **double** uses more memory but keeps **more** precise values

In practice, **use double** unless you have a strong reason not to. **double** is the default type for decimal numbers in C

Notice the **f** at the end of **3.14f** in the float example. This tells C "treat this as a float, not a double". Without the **f**, the value **3.14** would be a double. For **double** variables, you don't need any suffix

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

You'd expect **3.5**. But the output is **3.000000**. Why?

Because **a / b** is computed **first**, with both **a** and **b** being ints. The result is **3** (integer division). Only **after** that, **3** is stored in **result** as **3.0**. By that point, the **.5** is already lost forever

To get the real answer, **at least one** of the operands must be a decimal

```c
#include <stdio.h>

int main(void) {
    double a = 7;
    int b = 2;
    printf("%f\n", a / b);
    return 0;
}
```

Or we can use a **cast** to force one of them to be a double

```c
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;
    printf("%f\n", (double) a / b);
    return 0;
}
```

**(double)** in front of **a** says "treat this as a double for this operation". This is called a **cast**, and it's a tool you'll use a lot in C

---

## Mission: Machine Room Log

The computing center's machine room has a thermometer and a hygrometer connected to a teletype. Every shift, the operator reads the two values and logs them, rounded to 2 decimal places.

- Read two real numbers from the input, in this order: **temperature** and **humidity**
- Print **temperature** on one line, with the label `Temperature: `, rounded to **2 decimals**
- Print **humidity** on a separate line, with the label `Humidity: `, rounded to **2 decimals**

**Example**

Input

```text
21.6 45.5
```

Output

```text
Temperature: 21.60
Humidity: 45.50
```

**Example**

Input

```text
19.25 60.75
```

Output

```text
Temperature: 19.25
Humidity: 60.75
```
