In programming we often want to **store** things so we can use them later. The simplest example: numbers. In Java, before storing something, we have to tell the language **what kind of value** we want to store. That is called a **type**

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

**int** is the **type** for whole numbers (1, 2, 100, -20, 0). We tell Java: "I am about to store a whole number, and its name is **age**"

Java is **strict** about types — it always wants to know what kind of value you put in a variable. The upside is that Java can catch many mistakes before the program even runs

---

We can do calculations with numbers

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

With the **=** sign, Java first computes what is on the **right**, then stores the result in the variable on the **left**. So **c = a + b** stores **8** in **c**

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

**n++** is the same thing as **n = n + 1**. Very common in Java

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

**Important**: if you try to store a decimal in an **int**, Java will refuse

```java
public class Main {
    public static void main(String[] args) {
        int x = 3.14;   // error
    }
}
```

Try it. Read the error. Java protects us from accidentally losing the decimal part

---

A little surprise that catches everyone. Try this

```java
public class Main {
    public static void main(String[] args) {
        int a = 7;
        int b = 2;
        System.out.println(a / b);
    }
}
```

You might expect **3.5**. But you will see **3**. Why? Because when we divide an **int** by an **int**, Java gives us back an **int**, dropping the decimals. To get **3.5**, we need at least one **double**

```java
public class Main {
    public static void main(String[] args) {
        double a = 7;
        int b = 2;
        System.out.println(a / b);
    }
}
```

Now we see **3.5**. Keep this in mind — it is a very common beginner bug

---

## Mission: Officer Badge

Commander Cortez needs a new badge printed. Set the correct values for `age` and `height`, then print the full line on the badge.

1. Set `age` to `57`
2. Set `height` to `1.67`
3. The final `println` already builds the message with **+** — just make sure the variables hold the right values

**Input** (already set at the top of your code — change the values to test):

- `age` — the officer's age (int)
- `height` — the officer's height in metres (double)

**Example**

With `age = 57` and `height = 1.67`, your program should print

```text
My name is Cortez, I am 57 years old and 1.67 m tall
```
