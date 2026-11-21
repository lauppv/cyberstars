```java
interface Vehicul {
    String nume();
    int viteza();

    default String descriere() {
        return nume() + " merge cu " + viteza() + " km/h" + (viteza() >= 200 ? ", rapid" : "");
    }
}

class Masina implements Vehicul {
    String nume;
    int viteza;

    Masina(String nume, int viteza) {
        this.nume = nume;
        this.viteza = viteza;
    }

    public String nume() {
        return nume;
    }

    public int viteza() {
        return viteza;
    }
}

class Barca implements Vehicul {
    String nume;
    int viteza;

    Barca(String nume, int viteza) {
        this.nume = nume;
        this.viteza = viteza;
    }

    public String nume() {
        return nume;
    }

    public int viteza() {
        return viteza;
    }

    @Override
    public String descriere() {
        return nume + " navigheaza cu " + viteza + " noduri";
    }
}

public class Main {
    public static void main(String[] args) {
        String numeMasina = "Infernus";
        int vitezaMasina = 240;
        String numeBarca = "Squalo";
        int vitezaBarca = 95;

        Vehicul masina = new Masina(numeMasina, vitezaMasina);
        Vehicul barca = new Barca(numeBarca, vitezaBarca);
        System.out.println(masina.descriere());
        System.out.println(barca.descriere());
    }
}
```
