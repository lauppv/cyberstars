```java
class Criminal {
    String nume;
    Criminal(String nume) { this.nume = nume; }
    void vorbeste() { System.out.println("..."); }
}

class Sofer extends Criminal {
    Sofer(String nume) { super(nume); }
    @Override
    void vorbeste() { System.out.println("Sunt soferul " + nume); }
}

class Tragator extends Criminal {
    Tragator(String nume) { super(nume); }
    @Override
    void vorbeste() { System.out.println("Sunt tragatorul " + nume); }
}

public class Main {
    public static void main(String[] args) {
        String nume1 = "Tommy";
        String nume2 = "Lance";

        Criminal[] banda = { new Sofer(nume1), new Tragator(nume2) };

        for (Criminal c : banda) {
            c.vorbeste();
        }
    }
}
```
