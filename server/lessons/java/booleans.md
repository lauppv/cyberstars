A **boolean** is a value that can only be **true** or **false**. We’ve already seen them inside **if** conditions. Java has its own type for them, called **boolean**

```java
boolean isOnline = true;
boolean hasKey = false;
System.out.println(isOnline);
System.out.println(hasKey);
```

**Important**: in Java, **true** and **false** are **lowercase**. (In Python they were **True** and **False** with a capital letter.) Don’t mix them up

Conditions like **age < 18** or **x == 5** also produce booleans
```java
int age = 20;
System.out.println(age < 18);    // false
System.out.println(age >= 18);   // true
```

---

We can combine booleans with logical operators

- **&&** means **and** (both conditions must be true)
- **||** means **or** (at least one must be true)
- **!** means **not** (flips the value)

Imagine: in order to drive a car, you need to be **at least 18 years old AND have a license**
```java
int age = 20;
boolean hasLicense = true;

if (age >= 18 && hasLicense) {
    System.out.println("You can drive");
} else {
    System.out.println("Sorry, no driving today");
}
```
Both conditions must be **true** for **&&** to be **true**. If even one is false, the whole thing is false

---

**||** (or) is more relaxed. Just **one** of the conditions being true is enough
```java
boolean isVIP = false;
boolean hasInvitation = true;

if (isVIP || hasInvitation) {
    System.out.println("Welcome to the club");
} else {
    System.out.println("Access denied");
}
```
**isVIP** is false, **hasInvitation** is true, so the **or** is true and the person enters

---

**!** flips a boolean. **!true** becomes **false**, **!false** becomes **true**
```java
boolean isLoggedIn = false;
if (!isLoggedIn) {
    System.out.println("Please log in first");
}
```
Reads almost like English: *if not logged in, log in*

---

Truth tables, just to have them in one place
```text
true  && true  = true
true  && false = false
false && true  = false
false && false = false

true  || true  = true
true  || false = true
false || true  = true
false || false = false

!true  = false
!false = true
```

---

You are writing the access system for **CyberStars HQ**. A person can enter if they are an **employee AND it’s a working day**, or if they are a **guest WITH an invitation**

You have these variables on the right
```java
boolean isEmployee
boolean isWorkingDay
boolean isGuest
boolean hasInvitation
```

Display **Access granted** if the person can enter, **Access denied** otherwise

Play with the values, **run** multiple times, check that all combinations behave correctly :)
