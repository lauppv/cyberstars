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

Take the program out of the infinite loop