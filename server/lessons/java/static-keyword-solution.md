```java
class Visitor {
    String name;
    static int totalVisits = 0;

    Visitor(String name) {
        this.name = name;
        totalVisits++;
    }
}

public class Main {
    public static void main(String[] args) {
        Visitor v1 = new Visitor("Tommy");
        Visitor v2 = new Visitor("Lance");
        Visitor v3 = new Visitor("Cortez");
        System.out.println(Visitor.totalVisits);
    }
}
```
