```java
public class Main {
    public static String[] filtreaza(String[] semnale) {
        int valide = 0;
        for (int i = 0; i < semnale.length; i++) {
            if (semnale[i].equals("out")) {
                break;
            }
            if (semnale[i].equals("static")) {
                continue;
            }
            valide++;
        }

        String[] rezultat = new String[valide];
        int pozitie = 0;
        for (int i = 0; i < semnale.length; i++) {
            if (semnale[i].equals("out")) {
                break;
            }
            if (semnale[i].equals("static")) {
                continue;
            }
            rezultat[pozitie] = semnale[i].toUpperCase();
            pozitie++;
        }
        return rezultat;
    }

    public static void main(String[] args) {
        String[] semnale = { "tommy", "static", "lance", "static", "cortez", "static", "diaz", "out", "mercedes" };

        String[] curatate = filtreaza(semnale);
        for (String s : curatate) {
            System.out.println(s);
        }
        System.out.println("Total: " + curatate.length);
    }
}
```
