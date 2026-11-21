```java
public class Main {
    public static void main(String[] args) {
        int[][] seif = { { 100, 500, 20 }, { 0, 900, 50 } };

        int etajBun = 0;
        int casetaBuna = 0;
        for (int etaj = 0; etaj < seif.length; etaj++) {
            int total = 0;
            for (int caseta = 0; caseta < seif[etaj].length; caseta++) {
                total += seif[etaj][caseta];
                if (seif[etaj][caseta] > seif[etajBun][casetaBuna]) {
                    etajBun = etaj;
                    casetaBuna = caseta;
                }
            }
            System.out.println("Etajul " + (etaj + 1) + ": " + total);
        }
        System.out.println("Cea mai buna caseta: etajul " + (etajBun + 1) + ", caseta " + (casetaBuna + 1) + ", bani " + seif[etajBun][casetaBuna]);
    }
}
```
