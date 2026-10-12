```java
class ContBancar {
    private String proprietar;
    private int sold;
    private int idCont;
    private static int urmatorulId = 1;
    private final int SOLD_MINIM = 0;

    ContBancar(String proprietar, int sold) {
        this.proprietar = proprietar;
        this.sold = sold;
        this.idCont = urmatorulId;
        urmatorulId++;
    }

    String getProprietar() {
        return proprietar;
    }

    int getSold() {
        return sold;
    }

    int getIdCont() {
        return idCont;
    }

    void depune(int suma) {
        sold += suma;
    }

    void retrage(int suma) {
        if (sold - suma >= SOLD_MINIM) {
            sold -= suma;
        } else {
            System.out.println("Fonduri insuficiente");
        }
    }

    @Override
    public String toString() {
        return "Cont #" + idCont + " (" + proprietar + ") - Sold: " + sold + "$";
    }

    static int getTotalConturi() {
        return urmatorulId - 1;
    }
}

public class Main {
    public static void main(String[] args) {
        String proprietar1 = "Tommy";
        int sold1 = 1000;
        String proprietar2 = "Lance";
        int sold2 = 500;

        ContBancar a1 = new ContBancar(proprietar1, sold1);
        ContBancar a2 = new ContBancar(proprietar2, sold2);

        int depunere1 = 250;
        int retragere1 = 200;
        int retragere2 = 400;

        a1.depune(depunere1);
        a2.retrage(retragere1);
        a2.retrage(retragere2);

        System.out.println(a1);
        System.out.println(a2);
        System.out.println("Total conturi: " + ContBancar.getTotalConturi());
    }
}
```
