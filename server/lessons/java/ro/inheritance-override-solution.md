```java
class Afacere {
    int incasari() {
        return 0;
    }
}

class Club extends Afacere {
    int clienti;

    Club(int clienti) {
        this.clienti = clienti;
    }

    @Override
    int incasari() {
        return clienti * 50;
    }
}

class Spalatorie extends Afacere {
    int masini;
    int pret;

    Spalatorie(int masini, int pret) {
        this.masini = masini;
        this.pret = pret;
    }

    @Override
    int incasari() {
        return masini * pret;
    }
}

public class Main {
    public static void main(String[] args) {
        Club c = new Club(120);
        Spalatorie s = new Spalatorie(30, 8);
        System.out.println("Incasari club: " + c.incasari());
        System.out.println("Incasari spalatorie: " + s.incasari());
    }
}
```
