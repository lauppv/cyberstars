```java
record Vanzare(String produs, int pret, int cantitate) {
    int total() {
        return pret * cantitate;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] produse = { "Pistol", "Shotgun" };
        int[] preturi = { 100, 450 };
        int[] cantitati = { 3, 1 };

        int noapte = 0;
        for (int i = 0; i < produse.length; i++) {
            Vanzare vanzare = new Vanzare(produse[i], preturi[i], cantitati[i]);
            System.out.println(vanzare + " -> " + vanzare.total());
            noapte += vanzare.total();
        }
        System.out.println("Totalul noptii: " + noapte);
    }
}
```
