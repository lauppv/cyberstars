```java
public class Main {
    static String locPentru(String prefix) {
        return switch (prefix) {
            case "305", "786" -> "Vice City";
            case "212" -> "Liberty City";
            case "415" -> "San Fierro";
            default -> "Distanta lunga";
        };
    }

    public static void main(String[] args) {
        String format = "305-555-0142";
        int minute = 3;

        String cifre = "";
        for (int i = 0; i < format.length(); i++) {
            char c = format.charAt(i);
            if (Character.isDigit(c)) {
                cifre = cifre + c;
            }
        }
        if (cifre.length() != 10) {
            System.out.println("Numar invalid");
            return;
        }

        String loc = locPentru(cifre.substring(0, 3));
        int tarif = switch (loc) {
            case "Vice City" -> 1;
            case "Liberty City", "San Fierro" -> 3;
            default -> 5;
        };
        int cost = tarif * Math.max(minute, 1);
        System.out.println("Apelez " + loc);
        System.out.println("Cost: " + cost + (cost == 1 ? " fisa" : " fise"));
    }
}
```
