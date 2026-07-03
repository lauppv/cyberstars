An **interface** is like a contract. It says "any class that implements me MUST have these methods." It's similar to an abstract class, but even more strict — an interface can't have regular fields or constructors (with some exceptions we'll skip for now)

```text
interface Printable {
    void printInfo();
}
```

That's it. No body, no fields, just method signatures. Any class that says `implements Printable` MUST provide a `printInfo()` method

```text
class Book implements Printable {
    String title;
    String author;

    Book(String title, String author) {
        this.title = title;
        this.author = author;
    }

    @Override
    public void printInfo() {
        System.out.println("Book: " + title + " by " + author);
    }
}
```

Notice the method in the class must be **public**. Interface methods are always public by default, so your implementation must be too

---

The big difference between interfaces and abstract classes: a class can implement **multiple** interfaces, but can only extend **ONE** class

```text
interface Driver {
    void drive();
}

interface Shooter {
    void shoot();
}

class Associate implements Driver, Shooter {
    @Override
    public void drive() {
        System.out.println("Driving the getaway car");
    }

    @Override
    public void shoot() {
        System.out.println("Covering the crew");
    }
}
```

This is Java's answer to multiple inheritance: one parent class, but as many interfaces as you want

---

Think of it like the abilities in Vice City. Tommy Vercetti is a `Criminal` (his parent class). But he also `implements Swimmer, Driver, Shooter` — those are "contracts," abilities he has. Different characters implement different combinations: Lance implements `Driver, Shooter` but maybe not `Swimmer`. Cortez implements `Commander, Negotiator`

---

Here's a complete example

```java
interface Printable {
    void printInfo();
}

class Book implements Printable {
    String title, author;

    Book(String title, String author) {
        this.title = title;
        this.author = author;
    }

    @Override
    public void printInfo() {
        System.out.println("Book: " + title + " by " + author);
    }
}

class Movie implements Printable {
    String title, director;

    Movie(String title, String director) {
        this.title = title;
        this.director = director;
    }

    @Override
    public void printInfo() {
        System.out.println("Movie: " + title + " directed by " + director);
    }
}

public class Main {
    public static void main(String[] args) {
        Book b = new Book("The Mobster's Handbook", "Sonny Forelli");
        Movie m = new Movie("Scarface", "Brian De Palma");
        b.printInfo();
        m.printInfo();
    }
}
```

Output

```text
Book: The Mobster's Handbook by Sonny Forelli
Movie: Scarface directed by Brian De Palma
```

And just like with polymorphism, you can use the interface type for variables

```java
public class Main {
    public static void main(String[] args) {
        Printable[] items = { new Book("The Mobster's Handbook", "Sonny Forelli"), new Movie("Scarface", "Brian De Palma") };
        for (Printable p : items) {
            p.printInfo();
        }
    }
}
```

---

**When to use interface vs abstract class?**

- **Interface**: when you want to define a capability that unrelated classes can share. A book and a movie aren't related, but both can be Printable
- **Abstract class**: when you have a family of related classes that share common code. A `Driver` and a `Shooter` are both `Criminal` and share fields like `name`

You can even combine them: `abstract class Criminal implements Printable`

---

## Mission: Tommy's Catalog

Tommy keeps a mixed collection in his Vice City mansion: books and movies. He wants a catalog that lists every item, no matter the type. Build it using a shared `Printable` interface so every item can describe itself.

1. Create an interface `Printable` with a method `printInfo()`
2. Create a `Book` class with `title` and `author` fields that implements `Printable` — `printInfo()` prints `"Book: TITLE by AUTHOR"`
3. Create a `Movie` class with `title` and `director` fields that implements `Printable` — `printInfo()` prints `"Movie: TITLE directed by DIRECTOR"`
4. In `main`, create a `Book("Vice City Chronicles", "Tommy Vercetti")` and a `Movie("Top Gun", "Tony Scott")`, then call `printInfo()` on both

**Output**

```text
Book: Vice City Chronicles by Tommy Vercetti
Movie: Top Gun directed by Tony Scott
```
