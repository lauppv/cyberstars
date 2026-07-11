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
        String nume1 = "Tommy Vercetti";
        int scor1 = 500;
        String nume2 = "Lance Vance";
        int scor2 = 300;

        Jucator p1 = new Jucator(nume1, scor1);
        Jucator p2 = new Jucator(nume2, scor2);

        System.out.println(p1.nume + " are " + p1.scor + " puncte");
        System.out.println(p2.nume + " are " + p2.scor + " puncte");
    }
}
```
