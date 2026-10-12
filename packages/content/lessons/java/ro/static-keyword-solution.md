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
        String[] nume = {"Tommy", "Lance", "Cortez"};
        for (String n : nume) {
            new Vizitator(n);
        }
        System.out.println(Vizitator.totalVizite);
    }
}
```
