```java
public class Main {
    static int retrage(int sold, int suma) {
        if (suma <= 0) {
            throw new IllegalArgumentException("Suma trebuie să fie pozitivă");
        }
        if (suma > sold) {
            throw new IllegalArgumentException("Nu sunt destui bani");
        }
        return sold - suma;
    }

    public static void main(String[] args) {
        int sold = 1000;
        int[] retrageri = {300, 5000, -20, 700};

        for (int suma : retrageri) {
            try {
                sold = retrage(sold, suma);
                System.out.println("Am scos " + suma + ", a rămas " + sold);
            } catch (IllegalArgumentException e) {
                System.out.println("Refuzat: " + e.getMessage());
            }
        }
        System.out.println("Sold: " + sold);
    }
}
```
