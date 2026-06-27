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
        ContBancar cont = new ContBancar(1000);
        cont.depune(500);
        cont.retrage(200);
        cont.retrage(2000);
        System.out.println(cont.getSold());
    }
}
```
