```java
class ContBancar {
    private int sold;

    ContBancar(int sold) {
        this.sold = sold;
    }

    int getSold() {
        return sold;
    }

    void depune(int suma) {
        if (suma > 0) {
            sold += suma;
        }
    }

    void retrage(int suma) {
        if (suma > 0 && suma <= sold) {
            sold -= suma;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        int start = 1000;
        int depunere = 500;
        int retragere1 = 200;
        int retragere2 = 2000;

        ContBancar cont = new ContBancar(start);
        cont.depune(depunere);
        cont.retrage(retragere1);
        cont.retrage(retragere2);
        System.out.println(cont.getSold());
    }
}
```
