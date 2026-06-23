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

**forever**. This is called an **infinite loop**

---

## Stopping the loop with input()

The **while** loop becomes truly powerful together with **input()**. We can ask the user for something **again and again**, until they give us the answer we're waiting for

Imagine the station asks for a password. We want to keep asking **as long as** the password is wrong

```py
password = ""
while password != "starlet":
    password = input("Password: ")
print("Access granted!")
```

Let's follow what happens:

- at the start **password = ""** (empty), so **password != "starlet"** is true → we enter the loop
- the program asks for the password. If we type **moon**, then **password = "moon"**, still different from **"starlet"** → the loop repeats and asks again
- if we type **starlet**, then **password = "starlet"**, so **password != "starlet"** becomes **false** → the loop stops
- the program prints **Access granted!**

Notice the important thing: here we did **not** know how many times the loop would repeat. It depends entirely on what the user types. With a **for** loop it would have been hard, because **for** wants to know up front how many times to go. With **while** it's natural — we simply repeat **as long as** the condition is true

Why did we put **password = ""** before the loop? So that **while** has something to check on the first pass. If the variable didn't exist at all, **Python** would give an error when it reaches the condition

---

## Mission: Access Code

The station asks for an access code before it opens the door. Write a program that repeatedly asks for a code with **input()**, **as long as** the typed code is not the correct one. The correct code is **1234**

- as long as the user types a wrong code → print `Wrong code`
- when the user types the correct code → print `Access granted` and the loop stops

**Example**

If the user types `1111`, then `2222`, then `1234` in turn, the program prints

```text
Wrong code
Wrong code
Access granted
```
