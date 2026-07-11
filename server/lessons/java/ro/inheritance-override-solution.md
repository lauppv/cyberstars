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
        int clienti = 120;
        int masini = 30;
        int pret = 8;

        Club c = new Club(clienti);
        Spalatorie s = new Spalatorie(masini, pret);
        System.out.println("Incasari club: " + c.incasari());
        System.out.println("Incasari spalatorie: " + s.incasari());
    }
}
```
