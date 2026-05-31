In real life, we are often faced with a decision: either I do this, or I do that. If it’s cold outside, I need a sweater, otherwise a t-shirt is enough. If I’m sleepy, I go to sleep, otherwise I program **:)** So we notice 2 branches:

**if** yes

**if** not (**else**)

In programming, we say

**if** it’s cold:
take a sweater

**else**:
take a t-shirt

```py
age = 18
if age < 18:
    print("Access denied because you are not 18 years old")
else:
    print("Welcome to the club")
```

This is like a story:
**if the age is less than 18**, they are not allowed to enter

**Otherwise**, it means they are 18 or older, so they can enter

After **if** and **else**, we put the colon **:**

Then everything we write after this **:** must be **indented**. Why? So Python knows which lines of code belong to the **if** block and which do not, and the same for **else**

```py
age = 18
if age < 18:
print("Access denied because you are not 18 years old")
else:
print("Welcome to the club")
```

Run the code. You can see the error. By the way, try to **read the errors** because they tell you exactly what you did wrong

The **<** sign means less than. If the age is less than 18: 17, 15, 10, etc

Similarly, we have:

**<=** means less than or equal to 18: 18, 17, 15, 4, 0, -12

**>** means greater than 18: 19, 20, 145

**>=** means greater than or equal to 18: 18, 19, 20, 1000

**==** means equal. Do not confuse it with **=** which is used to
**assign** a value to a variable

```py
x = 4
if x = 4:
    print("Boo")
```

This will generate an error. The correct way is

```py
x = 4
if x == 4:
    print("Boo")
```

By the way, we don’t always need an **else** after **if**. Let’s think about a car. **If** we turn the key, the engine starts, **otherwise** nothing happens. Here, we don’t necessarily need an **else**

However, there are cases where we do need **else**. **If** I get at least 50% on an exam, I pass, **otherwise** I don’t. Here we see that there are two possibilities: either you pass or you don’t

```py
username = "Tommy Vercetti"
isUserOnline = True

if isUserOnline == True:
    print(f"{username} is playing GTA Vice City")
else:
    print(f"{username} is offline")
```

**True** and **False** are pretty straightforward. **If** the user is **online**, we enter the **if** block and will **NOT** enter the **else**. We can see that the code in the **else** block does not execute. Change **isUserOnline** to **False** and run the code. What do you see?

```py
username = "Tommy Vercetti"
isUserOnline = False

if isUserOnline == True:
    print(f"{username} is playing GTA Vice City")
else:
    print(f"{username} is offline")
```

Here we see that the user is **offline** because **isUserOnline** = **False**, which means we won’t enter the **if** block, since we only enter **if** the condition is **true**. Since our condition is **false**, we enter the **else** block

---

## Mission: Reactor Watch

The reactor reports its temperature in `temp` (degrees Celsius). Write an **if / else** that checks it:

- if `temp` is **greater than 1000** → print `DANGER: reactor at`, the temperature, then `degrees - shutting down` (for `temp = 1200` that is `DANGER: reactor at 1200 degrees - shutting down`)
- otherwise → print `Reactor stable at`, the temperature, then `degrees` (for `temp = 800` that is `Reactor stable at 800 degrees`)

**Input** (already set at the top of your code — change the values to test):

- `temp` — reactor temperature in degrees Celsius

**Example**

With `temp = 1200`, your program should print

```text
DANGER: reactor at 1200 degrees - shutting down
```

Now set `temp = 800` and run again

```text
Reactor stable at 800 degrees
```

Here at **CyberStars** we encourage **curiosity** — change `temp` and see what happens :)
