A core concept in programming is storing information. Most of the time, we don’t just want to display something on the screen; we want to **process** it first, do something with it, and then maybe display the result

Suppose we start with 2 apples:
```py
print("I have 2 apples")
```
What happens if Anna gives us **3** more apples? We will have **5**. Of course, we could say:
```py
print("Now I have 5 apples")
```
Then John comes and gives us **4** more apples. We will have **9** apples:
```py
print("Now I have 9 apples")
```
Every time, we have to remember how many apples we have, ourselves. But can the **computer** calculate and **remember** this for us? Absolutely!
```py
apples = 2
print(f"Now I have {apples} apples")

apples = apples + 3
print(f"Now I have {apples} apples")

apples = apples + 4
print(f"Now I have {apples} apples")
```
The output will be:
```py
Now I have 2 apples
Now I have 5 apples
Now I have 9 apples
```

Let’s pause a bit to understand the syntax:
```py
apples = apples + 3
print(f"Now I have {apples} apples")
```
**apples** is the variable *name* — the *name* of our “box” where we store something

On the right side of the **=** sign we have apples + 3. How many apples do we have **before** this operation? We had 2 apples, right? (See apples = 2 above)
So **apples** + 3 means 2 + 3, so 5

Therefore, **apples = apples + 3** means store whatever we have on the right

**Takeaway**: The computer first evaluates the right-hand side of **=** and then stores the result in the variable on the left-hand side. So **right comes first**

```py
apples = apples + 3
print(f"Now I have {apples} apples")
```
Notice the **{}** in the print. Why do we need it?

```py
print("Now I have apples apples")
```
would literally print: **Now I have apples apples**, and not **Now I have 5 apples**

What about the **f**? Well, what would the following code print?
```py
print("Now I have {apples} apples")
```
Correct, it would print **Now I have {apples} apples** and not the value stored in **apples**

So, if we want to display the value of a variable, we must use **f** and **{}**

---

We can also do other things with variables:

```py
name = "Nikola Tesla"
age = 52
profession = "inventor"

print(f"Hi! My name is {name}, I am {age} years old, and I am an {profession}")
```
This will display on the screen: **Hi! My name is Nikola Tesla, I am 52 years old, and I am an inventor**