```java
class Vizitator {
    String nume;
    static int totalVizite = 0;

    Vizitator(String nume) {
        this.nume = nume;
        totalVizite++;
    }
}

public class Main {
    public static void main(String[] args) {
        Vizitator v1 = new Vizitator("Tommy");
        Vizitator v2 = new Vizitator("Lance");
        Vizitator v3 = new Vizitator("Cortez");
        System.out.println(Vizitator.totalVizite);
    }
}
```
