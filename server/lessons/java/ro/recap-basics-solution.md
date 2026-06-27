```java
public class Main {
    public static void main(String[] args) {
        String produs1 = "Modul oxigen";
        double pret1 = 999.99;
        String produs2 = "Filtru apa";
        double pret2 = 29.50;
        String produs3 = "Baterie solara";
        double pret3 = 5.99;
        int taxa = 19;

        double subtotal = pret1 + pret2 + pret3;
        double valoareTaxa = subtotal * taxa / 100;
        double total = subtotal + valoareTaxa;

        System.out.println("Bon depozit");
        System.out.println(produs1 + ": " + String.format("%.2f", pret1) + " EUR");
        System.out.println(produs2 + ": " + String.format("%.2f", pret2) + " EUR");
        System.out.println(produs3 + ": " + String.format("%.2f", pret3) + " EUR");
        System.out.println("Subtotal: " + String.format("%.2f", subtotal) + " EUR");
        System.out.println("Taxa (" + taxa + "%): " + String.format("%.2f", valoareTaxa) + " EUR");
        System.out.println("Total: " + String.format("%.2f", total) + " EUR");
    }
}
```
