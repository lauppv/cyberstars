In the previous lesson we learned what a **for** loop is. We can make the computer do things multiple times **automatically**. Still, wouldn’t it also be useful to tell the computer to do something as long as… something? Well yes, that’s possible. This is where the **while** loop comes in

```py
i = 0
while i < 10:
    print(i)
    i = i + 1
```

this code will display

```text
0
1
2
3
4
5
6
7
8
9
```

Why not **10** as well? Because if **i = 10**, then **i < 10 is NOT true**, since **10 is NOT less than 10**

```py
i = 0
while i <= 10:
    print(i)
    i = i + 1

```

As a matter of fact we will have all the numbers from **0 to 10 inclusive**, because **10 <= 10 is true**

In other words, **while** runs as long as the condition is **true**

**Careful**! If we don’t write **i = i + 1**, we enter an **infinite loop**

```py
i = 0
while i <= 100:
    print(i)
```

Because **i stays 0**, therefore **print(i)** will always print **0**. Since **i <= 100** is always **true** in this case **(0 <= 100 always)**, the program will print

```text
0
0
0
0
0
...
```

**forever**. This is called an **infinite loop**. **Run** the code above to see what is printed, to see what the program does **:)**

---

## Mission: Battery Drain

The station runs on a battery that loses charge every cycle. You are given the starting `charge` (in percent) and how much it loses per cycle, `drain`.

Write a program that uses a **while** loop to keep running **as long as** `charge` is greater than **0**. On each cycle:

- if `charge` is **20 or below** → print the charge, then `% - LOW POWER` (for example `10% - LOW POWER`)
- otherwise → print the charge, then `%` (for example `70%`)

then reduce `charge` by `drain`. When the battery finally runs out, print `Battery dead` once at the end.

**Careful** — just like in the lesson above, if you forget to lower `charge` you will be stuck in an **infinite loop** :)

**Input** (already set at the top of your code — change the values to test):

- `charge` — starting battery level in percent
- `drain` — how much charge is lost per cycle

**Example**

With `charge = 100` and `drain = 30`, your program should print

```text
100%
70%
40%
10% - LOW POWER
Battery dead
```
