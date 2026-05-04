We already saw how to declare a **String** and combine strings with **+**. Time to look at the most useful **String methods** in Java

---

How long is a string? **.length()**
```java
String name = "Tommy Vercetti";
System.out.println(name.length());
```
Output **14**. Spaces count too. Notice the **parentheses** **()** at the end — in Java, **length** is a **method**, so we call it like one. (For arrays the syntax is different, just **arr.length** without parentheses. Java is full of small inconsistencies like this :)

---

Uppercase and lowercase
```java
String name = "tommy vercetti";
System.out.println(name.toUpperCase());   // TOMMY VERCETTI
System.out.println(name.toLowerCase());   // tommy vercetti
```

**Important**: these methods do **NOT** change the original variable. They give back a **new** string
```java
String name = "tommy";
name.toUpperCase();
System.out.println(name);   // still "tommy"
```
To actually keep the uppercase version
```java
name = name.toUpperCase();
System.out.println(name);   // "TOMMY"
```
This trap catches everyone in the beginning. Strings in Java are **immutable** — they cannot be changed. Methods always return a new string

---

Get a **substring** (a piece of the string)
```java
String name = "Tommy Vercetti";
System.out.println(name.substring(0, 5));   // Tommy
System.out.println(name.substring(6));      // Vercetti
```

**substring(start, end)** gives the characters from position **start** up to (but **not** including) position **end**. Just like **range()** in Python and slicing — the end is exclusive

**substring(start)** with one argument gives everything from **start** to the end of the string

Counting starts from **0**, like always in programming. **name.substring(0, 5)** means positions **0, 1, 2, 3, 4** which spell **Tommy**

---

Single character at a position
```java
String name = "Tommy Vercetti";
System.out.println(name.charAt(0));   // T
System.out.println(name.charAt(6));   // V
```
**charAt(i)** gives back a **char** (a single character). For our purposes, you can think of it as a tiny string

---

Comparing strings — and **the most common Java trap of all time**
```java
String a = "hello";
String b = "hello";

if (a == b) {
    System.out.println("equal");
} else {
    System.out.println("not equal");
}
```
This **might** print **equal**, but **it’s wrong**. With objects (and **String** is an object in Java), **==** compares whether they are the **same object in memory**, not whether they have the same content. The correct way is
```java
if (a.equals(b)) {
    System.out.println("equal");
}
```
**Always use .equals() to compare strings in Java**. Memorize this. You’ll thank yourself later :)

---

You have a variable **name** on the right, set to **"lance vance"**. Display **on separate lines**
```text
LANCE VANCE
lance vance
11
l
lance
vance
```

That is: uppercase, lowercase, length, first letter, the first 5 characters, and the last 5 characters (positions 6 to 11)

Try modifying the name to **"tommy"**, **"cortez"**, your own name — see what changes :)
