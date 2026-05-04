**Comments** are pieces of text in our code that Java **ignores**. We use them to **explain** what the code does, or to **disable** parts of the code without deleting them

In Java, a single-line comment starts with **//**

```java
public class Main {
    public static void main(String[] args) {
        // this is a comment
        int a = 1 + 2 + 3;
        System.out.println(a); // display variable a
    }
}
```
The lines after **//** are completely ignored by Java. The program runs as if they weren’t there

---

Comments are also great for **disabling** code temporarily
```java
public class Main {
    public static void main(String[] args) {
        int a = 1 + 2 + 3;
        // System.out.println(a);
    }
}
```
Now the program prints nothing, because we **commented out** the **println**. Very useful when debugging — instead of deleting code and rewriting it later, we just comment it out

---

For longer comments that span multiple lines, Java also supports **/\* ... \*/**
```java
/*
This is a
multi-line
comment
*/
```
However, in practice, most Java code uses **//** even for several lines in a row
```java
// this is how we will write
// our comments
// to give hints
// and to explain things
```

---

There’s also a special kind, **/\*\* ... \*/**, used to document classes and methods. We’ll meet it later in your Java journey. For now, **//** is all you need

---

The code on the right is correct, but you don’t want to print **everything**. Comment out **one line** so that the program displays only the **ship’s name**, **mission name**, and **maximum power**. Don’t delete anything — just **comment** the line you want to skip
