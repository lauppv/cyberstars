In programming we often want to **store** things to use them later. The simplest example: numbers. In Java, before storing something, we need to tell the language **what kind of value** we want to store. This is called a **type**

```java
public class Main {
    public static void main(String[] args) {
        int age = 18;
        int x = 1;
        System.out.println(age);
        System.out.println(x);
    }
}
```
**int** is the **type** for whole numbers (1, 2, 100, -20, 0). We are telling Java: "I’m about to store a whole number, and its name is **age**"

This is **different from Python**. In Python we just wrote **age = 18**. Java is **stricter** — it wants to know the type. The advantage is that Java can catch many mistakes before the program even runs

---

We can do math with numbers, just like in Python
```java
public class Main {
    public static void main(String[] args) {
        int a = 2;
        int b = 6;
        int c = a + b;
        System.out.println(c);
    }
}
```
Same rule as Python: with **=**, Java first computes what is on the **right**, then stores the result on the **left**. So **c = a + b** stores **8** in **c**

The classic increment by 1
```java
public class Main {
    public static void main(String[] args) {
        int n = 10;
        n = n + 1;
        System.out.println(n);
    }
}
```
Java looks at **n + 1**, sees **10 + 1 = 11**, and stores **11** back into **n**

Java even has a **shortcut** for this
```java
public class Main {
    public static void main(String[] args) {
        int n = 10;
        n++;
        System.out.println(n);
    }
}
```
**n++** is the same as **n = n + 1**. Very common in Java

---

For numbers with decimals (like **3.14** or **1.75**), **int** is not enough. We use **double**
```java
public class Main {
    public static void main(String[] args) {
        double pi = 3.14159;
        int k = 33;
        System.out.println(pi + k);
    }
}
```
Output
```text
36.14159
```
The result is a **double** because we mixed an **int** with a **double**

**Important**: if you try to store a decimal into an **int**, Java will refuse
```java
public class Main {
    public static void main(String[] args) {
        int x = 3.14;   // ERROR
    }
}
```
Try it. Read the error. Java protects us from accidentally losing the decimal part

---

A small surprise that catches everyone. Try this
```java
public class Main {
    public static void main(String[] args) {
        int a = 7;
        int b = 2;
        System.out.println(a / b);
    }
}
```
You might expect **3.5**. But you’ll see **3**. Why? Because when we divide an **int** by an **int**, Java gives us back an **int**, throwing away the decimals. To get **3.5**, we’d need at least one **double**
```java
public class Main {
    public static void main(String[] args) {
        double a = 7;
        int b = 2;
        System.out.println(a / b);
    }
}
```
Now we see **3.5**. Remember this — it’s a very common bug for beginners :)

---

On the right, complete the code with values for **age** and **height**, then display
```text
My name is Cortez, I am 57 years old, and I am 1.67 tall
```
For now, build the message with **+** like this
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("My name is Cortez, I am " + age + " years old, and I am " + height + " tall");
    }
}
```
We’ll explain string concatenation properly in the next lessons. Just notice that **+** with strings means "glue them together"
