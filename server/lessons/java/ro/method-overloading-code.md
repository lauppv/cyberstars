public class Main {
    // Versiunea 1: doar numele articolului
    public static void descrie(String articol) {
        // afișează "Articol: X"
    }

    // Versiunea 2: numele articolului și cantitatea
    public static void descrie(String articol, int cantitate) {
        // afișează "Articol: X (x5)"
    }

    // Versiunea 3: numele articolului, cantitatea și prețul
    public static void descrie(String articol, int cantitate, double pret) {
        // afișează "Articol: X (x5) - $P"
    }

    public static void main(String[] args) {
        descrie("Sword");
        descrie("Shield", 5);
        descrie("Potion", 3, 9.99);
    }

}
