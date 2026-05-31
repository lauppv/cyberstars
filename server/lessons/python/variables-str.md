A core concept in programming is storing information. Most of the time, we don’t just want to display something on the screen; we want to **process** it first, do something with it, and then maybe display the result

```py
print("My name is Tommy Vercetti")
```

In the previous lesson, we learned that this will display

```text
My name is Tommy Vercetti
```

**print()** does exactly that. However, wouldn’t it be more organized to **store** the name somewhere first and then say something like **My name is ...**, no matter what the name is? For example **My name is Lance Vance** or **My name is Paul**. Somehow, it doesn’t matter which name it is, what matters is that we can display it, **whichever** it may be

Well, yes, there is a way to not care about the specific name, but just display it. This is called a **variable** in programming

```py
name = "Tommy Vercetti"
print(name)

name = "Lance Vance"
print(name)

name = "Paul"
print(name)
print(name)
print(name)
```

If we run the code by pressing the Run Code button, we will see that Paul appears 3 times, because we used print(name) 3 times.
We can see that we don’t necessarily care what the name is, because it can change — what matters is that we can display it and use it

However, be careful: if we don’t put **""**, we will get an error. The code below will not work

```py
name = Paul
print(name)
```

Why doesn’t it work? Python thinks that **Paul** is a variable. If we want to tell it that it is not a variable, but **text**, we need to put it inside **""**. Text in programming is called a **string**

A slightly more advanced example, but worth studying, is:

```py
Kent = "Booooo"
name = Kent
print(name)
```

We might be tempted to think that **Kent** will be displayed, but that is not true. **Booooo** will be displayed instead. Why? Because if we don’t put **""**, Python thinks that **Kent** is a variable and not our name. It sees **name = Kent**, and since Kent doesn’t have "", it looks for a variable with that name defined earlier and replaces it with **Booooo**.

```py
Kent = "Booooo"
name = "Kent"
print(name)
```

## This code will indeed display the name exactly as we intended. Run it :)

So, anything we write between **" and "** is called a **string** and is used whenever we want to write text that Python should treat exactly as we intend, and **not** as a variable.

---

## Mission: Crew Roster

Three crew members are assigned to the station. Their names are stored in the variables `commander`, `pilot`, and `engineer` at the top of your code.

Print the three names, **each on its own line**, in this order: commander, pilot, engineer. Then the pilot is swapped out mid-mission — add a line that changes `pilot` to `"Jess"` and print `pilot` one more time.

**Input** (already set at the top of your code — change the values to test):

- `commander`, `pilot`, `engineer` — the crew member names

**Example**

With the starter values, your program should print

```text
Shadow
Lance
Quincy
Jess
```
