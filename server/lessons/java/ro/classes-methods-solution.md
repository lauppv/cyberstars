```java
class Afacere {
    String nume;
    int incasari;

    Afacere(String nume) {
        this.nume = nume;
        this.incasari = 0;
    }

    void adauga(int suma) {
        incasari += suma;
    }

    int getIncasari() {
        return incasari;
    }
}

public class Main {
    public static void main(String[] args) {
        Afacere a1 = new Afacere("Malibu Club");
        a1.adauga(200);
        a1.adauga(300);
        a1.adauga(150);

        Afacere a2 = new Afacere("Print Works");
        a2.adauga(500);
        a2.adauga(250);

        System.out.println(a1.nume + ": " + a1.getIncasari());
        System.out.println(a2.nume + ": " + a2.getIncasari());
    }
}
```
