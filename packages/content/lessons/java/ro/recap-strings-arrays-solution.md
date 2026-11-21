```java
public class Main {
    public static void main(String[] args) {
        String raport = "XX.X/..X./XXXX";

        String[] etaje = raport.split("/");
        StringBuilder libere = new StringBuilder();
        int totalLibere = 0;
        for (int etaj = 0; etaj < etaje.length; etaj++) {
            int liber = 0;
            for (int loc = 0; loc < etaje[etaj].length(); loc++) {
                if (etaje[etaj].charAt(loc) == '.') {
                    liber++;
                    if (libere.length() > 0) {
                        libere.append(", ");
                    }
                    libere.append((etaj + 1) + "-" + (loc + 1));
                }
            }
            totalLibere += liber;
            System.out.println(String.format("Etajul %d | %s | %d libere", etaj + 1, etaje[etaj], liber));
        }
        System.out.println("Locuri libere: " + (totalLibere == 0 ? "niciunul" : libere.toString()));
        System.out.println("Total libere: " + totalLibere);
    }
}
```
