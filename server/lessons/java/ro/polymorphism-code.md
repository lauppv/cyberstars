class Forma {
    double arie() {
        return 0;
    }
}

class Cerc extends Forma {
    double raza;

    Cerc(double raza) {
        this.raza = raza;
    }

    @Override
    double arie() {
        return Math.PI * raza * raza;
    }

}

class Dreptunghi extends Forma {
    double latime, inaltime;

    Dreptunghi(double latime, double inaltime) {
        this.latime = latime;
        this.inaltime = inaltime;
    }

    @Override
    double arie() {
        return latime * inaltime;
    }

}

public class Main {
    public static void main(String[] args) {
        // Creează un array Forma[] cu un Cerc(5) și un Dreptunghi(4, 6)

        // Parcurge array-ul și afișează fiecare arie
        // Folosește String.format("%.2f", f.arie())
    }

}
