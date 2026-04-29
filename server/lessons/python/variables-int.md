Just as we can store a piece of text in a variable, we can also store numbers

```py
age = 18
x = 1
print(age)
print(x)
```

With numbers we can perform operations
```py
a = 2
b = 6
c = a + b
print(c)
```
c = a + b is very important to understand. If we have the **=** sign, what is on the **right side is always executed first**, then the result is stored in whatever is on the left side
```text
x = 23 + 22
```
here 23 + 22 is done first. the result 45 is taken and stored in the variable **x**

Very often encountered in programming is **incrementing by 1**, meaning

```py
n = 10
n = n + 1
print(n)
```

Why is 11 displayed? Or better said, why does the program run? Why doesn’t it crash? What do you mean n = n + 1? Mathematically this makes no sense
Well, in programming, it does make sense. We already said that if we have an equals sign, **Python first does what’s on the right**, then stores the result in what’s on the left
```text
n = n + 1
```

Here it looks to the right of the = sign and sees n + 1, meaning 10 + 1, which is 11, and it stores that in the variable n

By the way, 1, 2, 5, -1, -2019, 2025, 1235123, 0, all of these are **integers**
There are also **floating-point** numbers, meaning with decimals, such as 3.14 or -15.6
```py

pi = 3.14159
k = 33

print(pi + k)
```

this displays ```text 36.159```


---

Complete the code on the right with **name**, **age** and **height**
Example:
```text
Hello. My name is Cortez, I am 57 years old, and I am 1.67 tall
```