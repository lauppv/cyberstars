**for** loops are great when we know **how many times** to repeat. But sometimes we want to keep going **as long as** something is true, without knowing the exact count in advance. This is the job of **while**

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    while (i < 10) {
        printf("%d\n", i);
        i++;
    }
    return 0;
}
```

Output: **0** through **9**, one per line. Why no **10**? Because **10 < 10** is **false**, so we exit before printing it

If we wanted **10** included

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    while (i <= 10) {
        printf("%d\n", i);
        i++;
    }
    return 0;
}
```

Now **10 <= 10** is **true**, and we enter one more time

---

**while** runs **as long as** the condition is **true**

**Be very careful**. If we forget to update **i** inside the loop, we have an **infinite loop**

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    while (i <= 100) {
        printf("%d\n", i);
        // forgot i++
    }
    return 0;
}
```

**i** stays **0**, the condition is always **true**, the program prints **0** non-stop. The platform stops it after 5 seconds. In real life, an infinite loop can freeze your whole computer

Whenever you write a **while**, ask yourself: "what makes this condition eventually become false?". If the answer is "nothing", you have a bug

---

When to choose **for** vs **while**?

- **for** when the count is known ("do this 10 times", "go through every element of an array")
- **while** when the stopping condition depends on something inside the loop ("keep reading user input until they type **quit**", "keep dividing until the number is below 1")

Both are equally powerful — anything you can do with one, you can do with the other. Style and readability decide :)

---

C also has a **do { ... } while (...)** form that runs the body **at least once** before checking the condition. We won’t use it much in these lessons, but it’s good to know it exists

---

The code on the right is in an **infinite loop**. Fix it so the program prints

```text
I am online
Now I am offline
```

The loop should run **once** while the user is online, then end. You need to **change** the variable inside the loop so the condition eventually becomes false
