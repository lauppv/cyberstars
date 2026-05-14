An **interface** is like a contract. It says "any class that implements me MUST have these methods." It's similar to an abstract class, but even more strict — an interface can't have regular fields or constructors (with some exceptions we'll skip for now)

```java
interface Printable {
    void printInfo();
}
```

That's it. No body, no fields, just method signatures. Any class that says `implements Printable` MUST provide a `printInfo()` method

```java
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

In Python, you might use duck typing — "if it has a `printInfo` method, it's printable." Java doesn't trust you like that. Java wants a signed contract: `implements Printable`. Then it KNOWS at compile time that the method exists

---

The big difference between interfaces and abstract classes: a class can implement **multiple** interfaces, but can only extend **ONE** class

```java
interface Printable {
    void printInfo();
}

interface Saveable {
    void save();
}

class Document implements Printable, Saveable {
    @Override
    public void printInfo() {
        System.out.println("Document info");
    }

    @Override
    public void save() {
        System.out.println("Document saved!");
    }
}
```

This is Java's answer to multiple inheritance. In Python you can do `class Dog(Animal, Pet):` — in Java, you'd do `class Dog extends Animal implements Pet`. One parent class, but as many interfaces as you want

---

Think of it like GTA missions. Tommy Vercetti is a `Criminal` (his parent class). But he also `implements Swimmer, Driver, Shooter`. Those are all "contracts" — abilities he has. Different characters might implement different combinations. Lance implements `Driver, Shooter` but maybe not `Swimmer`. Cortez implements `Commander, Negotiator`

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
        Book b = new Book("1984", "George Orwell");
        Movie m = new Movie("Inception", "Christopher Nolan");
        b.printInfo();
        m.printInfo();
    }
}
```
Output
```text
Book: 1984 by George Orwell
Movie: Inception directed by Christopher Nolan
```

And just like with polymorphism, you can use the interface type for variables

```java
Printable[] items = { new Book("1984", "Orwell"), new Movie("Inception", "Nolan") };
for (Printable p : items) {
    p.printInfo();
}
```

---

**When to use interface vs abstract class?**

- **Interface**: when you want to define a capability that unrelated classes can share. Books and Movies aren't related, but both can be Printable
- **Abstract class**: when you have a family of related classes that share common code. Dogs and Cats are both Animals, and they share fields like `name`

You can even combine them: `abstract class Animal implements Printable`

---

Your turn! Create an interface `Printable` with a method `printInfo()`. Create a `Book` class with title and author fields that implements Printable — printInfo should print "Book: TITLE by AUTHOR". Create a `Movie` class with title and director fields — printInfo should print "Movie: TITLE directed by DIRECTOR". In main, create a Book("Vice City Stories", "Rockstar") and a Movie("Scarface", "Brian De Palma"), then call printInfo() on both
