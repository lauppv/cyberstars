```java
class Caine {
    String nume;
    int varsta;
}

public class Main {
    public static void main(String[] args) {
        Caine c1 = new Caine();
        c1.nume = "Rex";
        c1.varsta = 5;

        Caine c2 = new Caine();
        c2.nume = "Buddy";
        c2.varsta = 3;

        System.out.println(c1.nume + " are " + c1.varsta + " ani");
        System.out.println(c2.nume + " are " + c2.varsta + " ani");
    }
}
```
