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
        Driver d = new Driver("Tommy");
        Gunman g = new Gunman("Lance");
        d.speak();
        g.speak();
    }
}
```
