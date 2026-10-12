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
        String[] names = {"Tommy", "Lance", "Cortez"};
        for (String n : names) {
            new Visitor(n);
        }
        System.out.println(Visitor.totalVisits);
    }
}
```
