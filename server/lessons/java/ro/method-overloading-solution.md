```java
public class Main {
    public static void descrie(String nume) {
        System.out.println("Arma: " + nume);
    }

    public static void descrie(String nume, int cantitate) {
        System.out.println("Arma: " + nume + " - " + cantitate + " arme comandate");
    }

    public static void descrie(String nume, int cantitate, int pret) {
        int total = pret * cantitate;
        System.out.println("Arma: " + nume + " - " + pret + "$ x " + cantitate + " arme comandate - " + total + "$");
    }

    public static void main(String[] args) {
        String arma = "Sniper";
        int cantitate = 4;
        int pret = 10;

        descrie(arma);
        descrie(arma, cantitate);
        descrie(arma, cantitate, pret);
    }
}
```
