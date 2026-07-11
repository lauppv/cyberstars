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
        String nume1 = "Malibu Club";
        int vanzare1 = 200;
        int vanzare2 = 300;

        Afacere a1 = new Afacere(nume1);
        a1.adauga(vanzare1);
        a1.adauga(vanzare2);

        String nume2 = "Print Works";
        int vanzare3 = 500;
        int vanzare4 = 250;

        Afacere a2 = new Afacere(nume2);
        a2.adauga(vanzare3);
        a2.adauga(vanzare4);

        System.out.println(a1.nume + ": " + a1.getIncasari());
        System.out.println(a2.nume + ": " + a2.getIncasari());
    }
}
```
