```java
class Membru {
    String nume;
    int salariu;

    Membru(String nume, int salariu) {
        this.nume = nume;
        this.salariu = salariu;
    }
}

public class Main {
    static void maresteSalariu(int salariu, int suma) {
        salariu = salariu + suma;
    }

    static void maresteMembru(Membru m, int suma) {
        m.salariu = m.salariu + suma;
    }

    public static void main(String[] args) {
        String nume = "Lance";
        int salariu = 500;
        int suma = 100;

        Membru membru = new Membru(nume, salariu);
        maresteSalariu(salariu, suma);
        System.out.println("Dupa maresteSalariu: " + salariu);
        maresteMembru(membru, suma);
        System.out.println("Dupa maresteMembru: " + membru.nume + " castiga " + membru.salariu);
    }
}
```
