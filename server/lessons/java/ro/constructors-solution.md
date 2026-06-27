```java
class Jucator {
    String nume;
    int scor;

    Jucator(String nume, int scor) {
        this.nume = nume;
        this.scor = scor;
    }
}

public class Main {
    public static void main(String[] args) {
        Jucator p1 = new Jucator("Tommy Vercetti", 500);
        Jucator p2 = new Jucator("Lance Vance", 300);

        System.out.println(p1.nume + " are " + p1.scor + " puncte");
        System.out.println(p2.nume + " are " + p2.scor + " puncte");
    }
}
```
