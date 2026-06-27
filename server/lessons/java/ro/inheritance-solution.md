```java
class Criminal {
    String nume;

    Criminal(String nume) {
        this.nume = nume;
    }

    void vorbeste() {
        System.out.println("...");
    }
}

class Sofer extends Criminal {
    Sofer(String nume) {
        super(nume);
    }

    void vorbeste() {
        System.out.println("Sunt soferul " + nume);
    }
}

class Tragator extends Criminal {
    Tragator(String nume) {
        super(nume);
    }

    void vorbeste() {
        System.out.println("Sunt tragatorul " + nume);
    }
}

public class Main {
    public static void main(String[] args) {
        Sofer s = new Sofer("Tommy");
        Tragator t = new Tragator("Lance");
        s.vorbeste();
        t.vorbeste();
    }
}
```
