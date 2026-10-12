```java
public class Main {
    public static void main(String[] args) {
        int totalMagazine = 6;
        int magazinInchis = 3;
        int magazinPolitie = 5;

        int total = 0;
        for (int magazin = 1; magazin <= totalMagazine; magazin++) {
            if (magazin == magazinPolitie) {
                break;
            }
            if (magazin == magazinInchis) {
                continue;
            }
            System.out.println("Magazin " + magazin);
            total = total + magazin;
        }
        System.out.println("Total: " + total);
    }
}
```
