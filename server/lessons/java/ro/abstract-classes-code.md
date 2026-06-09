abstract class Vehicul {
    String nume;

    Vehicul(String nume) {
        this.nume = nume;
    }

    abstract String tipCombustibil();

}

// Creează o clasă MasinaElectrica care extinde Vehicul
// tipCombustibil() ar trebui să returneze "Electric"

// Creează o clasă CamionBenzina care extinde Vehicul
// tipCombustibil() ar trebui să returneze "Benzina"

public class Main {
    public static void main(String[] args) {
        // Creează o MasinaElectrica numită "Tesla"
        // Creează un CamionBenzina numit "Ford"
        // Afișează: "Tesla: Electric"
        // Afișează: "Ford: Benzina"
    }
}
