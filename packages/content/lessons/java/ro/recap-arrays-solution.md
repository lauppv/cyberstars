```java
public class Main {
    public static String[] filtreaza(String[] semnale) {
        int valide = 0;
        for (int i = 0; i < semnale.length; i++) {
            if (semnale[i].equals("gata")) {
                break;
            }
            if (semnale[i].equals("parazit")) {
                continue;
            }
            valide++;
        }

        String[] rezultat = new String[valide];
        int pozitie = 0;
        for (int i = 0; i < semnale.length; i++) {
            if (semnale[i].equals("gata")) {
                break;
            }
            if (semnale[i].equals("parazit")) {
                continue;
            }
            rezultat[pozitie] = semnale[i].toUpperCase();
            pozitie++;
        }
        return rezultat;
    }

    public static void main(String[] args) {
        String[] semnale = { "tommy", "parazit", "lance", "parazit", "cortez", "parazit", "diaz", "gata", "mercedes" };

        String[] curatate = filtreaza(semnale);
        for (String s : curatate) {
            System.out.println(s);
        }
        System.out.println("Total: " + curatate.length);
    }
}
```
