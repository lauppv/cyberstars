We saw how to store numbers. But what about **text**? In Java, the type for text is called **String** (with a capital **S**, this matters)

```java
public class Main {
    public static void main(String[] args) {
        String name = "Tommy Vercetti";
        System.out.println(name);
    }
}
```
Run it. You’ll see **Tommy Vercetti**

We can change the value just like with numbers
```java
public class Main {
    public static void main(String[] args) {
        String name = "Tommy Vercetti";
        System.out.println(name);

        name = "Lance Vance";
        System.out.println(name);

        name = "Paul";
        System.out.println(name);
        System.out.println(name);
        System.out.println(name);
    }
}
```
Output
```text
Tommy Vercetti
Lance Vance
Paul
Paul
Paul
```
Notice that the **second time** we change **name**, we **don’t** write **String** again. We only write the type **once**, when we **first declare** the variable. After that, Java already knows the type :)

---

Just like in Python, **don’t forget the quotes**. The code below will not work
```java
public class Main {
    public static void main(String[] args) {
        String name = Paul;   // ERROR
    }
}
```
Java thinks **Paul** is a variable, doesn’t find one with that name, and gives an error. To say "this is text, treat it exactly as written", we put it in **""**

A subtle example
```java
public class Main {
    public static void main(String[] args) {
        String Kent = "Booooo";
        String name = Kent;
        System.out.println(name);
    }
}
```
This prints **Booooo**, not **Kent**. Why? Because **Kent** without quotes is treated as a **variable**, and that variable holds **"Booooo"**. To actually print the word **Kent** we’d write
```java
public class Main {
    public static void main(String[] args) {
        String name = "Kent";
        System.out.println(name);
    }
}
```

---

A nice extra in Java: text variables behave a bit like objects. We can already peek at one useful trick
```java
public class Main {
    public static void main(String[] args) {
        String name = "Tommy Vercetti";
        System.out.println(name.length());
    }
}
```
Output **14**. **.length()** tells us how many characters the text has. Spaces count too. We’ll explore many more of these methods in a later lesson, for now just notice the **dot syntax**

---

The code on the right doesn’t work. Modify it so it displays
```text
Shrek
Fiona
Donkey
```
Don’t forget that text needs **""** around it, and don’t forget the **;** at the end of every line :)
