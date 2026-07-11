```java
class Criminal {
    String name;

    Criminal(String name) {
        this.name = name;
    }

    void speak() {
        System.out.println("...");
    }
}

class Driver extends Criminal {
    Driver(String name) {
        super(name);
    }

    void speak() {
        System.out.println("I'm the driver " + name);
    }
}

class Gunman extends Criminal {
    Gunman(String name) {
        super(name);
    }

    void speak() {
        System.out.println("I'm the gunman " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy";
        String name2 = "Lance";

        Driver d = new Driver(name1);
        Gunman g = new Gunman(name2);
        d.speak();
        g.speak();
    }
}
```
