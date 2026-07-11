```java
class Caine {
    String nume;
    int varsta;
}

public class Main {
    public static void main(String[] args) {
        String nume1 = "Rex";
        int varsta1 = 5;
        String nume2 = "Buddy";
        int varsta2 = 3;

        Caine c1 = new Caine();
        c1.nume = nume1;
        c1.varsta = varsta1;

        Caine c2 = new Caine();
        c2.nume = nume2;
        c2.varsta = varsta2;

        System.out.println(c1.nume + " are " + c1.varsta + " ani");
        System.out.println(c2.nume + " are " + c2.varsta + " ani");
    }
}
```
