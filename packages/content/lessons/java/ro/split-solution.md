```java
public class Main {
    public static void main(String[] args) {
        String rezultate = "Tommy:120;Lance:85;Ken:40";

        int total = 0;
        int scorMaxim = -1;
        String celMaiBun = "";
        for (String inregistrare : rezultate.split(";")) {
            String[] campuri = inregistrare.split(":");
            int scor = Integer.parseInt(campuri[1]);
            System.out.println(campuri[0] + " - " + scor);
            total += scor;
            if (scor > scorMaxim) {
                scorMaxim = scor;
                celMaiBun = campuri[0];
            }
        }
        System.out.println("Total: " + total);
        System.out.println("Cel mai bun: " + celMaiBun);
    }
}
```
