Wait, what was that?

```py
name = "Quincy"
age = 32
height = 1.97

print(f"Hello. My name is {name}, I am {age} years old, and I am {height} tall")
```

What is that long, script-like **print()**? Well, first of all, let’s ask ourselves how we could display the values for **name**, **age**, and **height** inside a text

We could do it like this

```py
name = "Quincy"
age = 32
height = 1.90

print("Hello. My name is ", name, ", I am ", age, " years old, and I am ", height, " tall:")
```

The problem is that with this approach you have to be careful with spaces, commas, and quotes… **fun fact**: I messed up twice when I wrote this **XD**

We believe the best approach is the first one

```python
name = "Cortez"
age = 57
height = 1.67
print(f"Hello. My name is {name}, I am {age} years old, and I am {height} tall")
```

Obviously, **name**, **age**, and **height** are the variables. The **{}** symbols work as a _placeholder_. Inside them, if you put a variable, the **variable’s name will be replaced by its value**
However, we must not forget the **f**

```py
name = "Quincy"
age = 32
height = 1.90

print("Hello. My name is {name}, I am {age} years old, and I am {height} tall")
```

Now we **didn’t put that f**. What will be displayed? Correct, exactly the string

```text
Hello. My name is {name}, I am {age} years old, and I am {height} tall
```

And that’s because the **f** before the string tells Python, “hey, replace what’s inside {} with the respective values”
This process in programming is called **formatting** (hence the letter **f**)

---

```text
Create 3 variables:
1. username
2. userAge
3. requiredAge

Set them with the following values:
1.username -> any name you want
2.userAge -> a number less than 18
3.requiredAge -> 18
```

Since they don’t have the required age, display a message telling them something like

```text
Hello, <something>! I’m sorry but the minimum age is <something>. You are <something> years old
```
