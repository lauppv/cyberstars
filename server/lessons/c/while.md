**for** loops are great when we know **how many times** we want to repeat. But sometimes we want to keep going **as long as** something is true, without knowing in advance how many iterations that means. That's the job of **while**

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

Output: **0** through **9**, one per line. Why doesn't **10** show up? Because **10 < 10** is **false**, so we exit before printing it

If we wanted **10** to be included

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

Now **10 <= 10** is **true**, so we go through one more time

---

**while** runs **as long as** the condition is **true**

**Be very careful**. If we forget to update **i** inside the loop, we get an **infinite loop**

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

**i** stays **0**, the condition is always **true**, and the program prints **0** forever. The platform stops it after 5 seconds. In real life, an infinite loop can freeze your entire computer

Whenever you write a **while**, ask yourself: "what makes this condition eventually become false?". If the answer is "nothing", you have a bug

---

When to choose **for** vs **while**?

- **for** when the count is known ("do this 10 times", "walk every element of an array")
- **while** when the stopping condition depends on something inside the loop ("keep going while there are still punch cards in the stack", "keep dividing the number until it's below 1")

Both are equally powerful — anything you can do with one, you can do with the other. Style and readability decide

---

C also has the **do { ... } while (...)** form, which runs the body **at least once** before checking the condition. We won't use it much in these lessons, but it's good to know it exists

---

## Mission: The Teleprinter Countdown

At Bell Labs, before kicking off a compile run on the mainframe, the shift operator started a countdown on the teleprinter, so everyone in the computing center knew when the tape noise was about to begin.

Write a program that, inside **main**

- declares an **int** named **n**
- uses a **while** loop that prints the value of **n**, then decreases it by 1, as long as **n** is greater than 0
- after the loop ends, prints **Start**

**Example**

For an **n** of 5, your program would print something like

```text
5
4
3
2
1
Start
```
