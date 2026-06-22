In real life, we are often faced with a decision: either I do this, or I do that. If it’s less than 15 degrees outside, I need a sweater, otherwise a t-shirt is enough. If I’m sleepy, I go to sleep, otherwise I program **:)** So we notice 2 branches:

**if** yes

**if** not (**else**)

In programming, we say

**if** it’s cold (the temperature is less than 15 degrees):
take a sweater

**else**:
a t-shirt is enough

```py
temperature = 14
if temperature < 15:
    print("Take a sweater")
else:
    print("A t-shirt is enough")
```

This is like a story:
**if the temperature outside is less than 15 degrees Celsius**, I need a sweater

**Otherwise**, a t-shirt is enough

After **if** and **else**, we put the colon **:**

Then everything we write after this **:** must be **indented**. Why? So Python knows which lines of code belong to the **if** block and which do not, and the same for **else**

```py
temperature = 14
if temperature < 15:
print("Take a sweater")
else:
print("A t-shirt is enough")
```

Run the code. You can see the error. By the way, try to **read the errors** because they tell you exactly what you did wrong

The **<** sign means less than. If the temperature is less than 15: 14, 10, 0, etc

Similarly, we have:

**<=** means less than or equal to 15: 15, 14, 10, 0, -12

**>** means greater than 15: 16, 20, 145

**>=** means greater than or equal to 15: 15, 16, 20, 1000

**==** means equal. Do not confuse it with **=** which is used to **assign** a value to a variable

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

However, there are cases where we do need **else**. **If** I get at least 50% on an exam, I pass, **otherwise** I don’t. Here we see that there are two possibilities: either you pass or you don’t. It’s not like you can say 'if I get 50% I pass, if not, nothing happens' — what actually happens is you fail the exam, meaning there is a consequence

```py
username = "Tommy Vercetti"
is_user_online = True

if is_user_online == True:
    print(f"{username} is playing GTA Vice City")
else:
    print(f"{username} is offline")
```

**True** and **False** are pretty straightforward. **If** the user is **online**, we enter the **if** block and will **NOT** enter the **else**. We can see that the code in the **else** block does not execute. Change **is_user_online** to **False** and run the code. What do you see?

```py
username = "Tommy Vercetti"
is_user_online = False

if is_user_online == True:
    print(f"{username} is playing GTA Vice City")
else:
    print(f"{username} is offline")
```

Here we see that the user is **offline** because **is_user_online** = **False**, which means we won’t enter the **if** block, since we only enter **if** the condition is **true**. Since our condition is **false**, we enter the **else** block

---

## Mission: Reactor Watch

The reactor reports its temperature in degrees Celsius. Write an **if / else** that checks it:

- if `temperature` is **greater than 1000** → print `Danger: reactor at`, the temperature, then `degrees - shutting down` (for `temperature = 1200` that is `Danger: reactor at 1200 degrees - shutting down`)
- otherwise → print `Reactor stable at`, the temperature, then `degrees` (for `temperature = 800` that is `Reactor stable at 800 degrees`)

Create a variable that stores the temperature

You could create the variable `temperature`. Technically, you could also create a variable `x`, but descriptive names are recommended. If someone else sees `x`, they’ll immediately wonder "what is x? Who is x?". We recommend `temperature`

**Example**

With `temperature = 1200`, your program should print

```text
Danger: reactor at 1200 degrees - shutting down
```

Now set `temperature = 800` and run again

```text
Reactor stable at 800 degrees
```

With `temperature = 1000`, your program should print

```text
Reactor stable at 1000 degrees
```

Why is the reactor stable at temperature = 1000?
