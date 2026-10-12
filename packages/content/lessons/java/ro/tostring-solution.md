```java
class Masina {
    String marca;
    int an;

    Masina(String marca, int an) {
        this.marca = marca;
        this.an = an;
    }

    @Override
    public String toString() {
        return marca + " (" + an + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        String marca1 = "Infernus";
        int an1 = 1986;
        String marca2 = "Cheetah";
        int an2 = 1984;

        Masina m1 = new Masina(marca1, an1);
        Masina m2 = new Masina(marca2, an2);

        System.out.println(m1);
        System.out.println(m2);
    }
}
```
