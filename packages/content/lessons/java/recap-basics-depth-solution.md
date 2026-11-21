```java
public class Main {
    static String placeFor(String area) {
        return switch (area) {
            case "305", "786" -> "Vice City";
            case "212" -> "Liberty City";
            case "415" -> "San Fierro";
            default -> "Long distance";
        };
    }

    public static void main(String[] args) {
        String dialed = "305-555-0142";
        int minutes = 3;

        String digits = "";
        for (int i = 0; i < dialed.length(); i++) {
            char c = dialed.charAt(i);
            if (Character.isDigit(c)) {
                digits = digits + c;
            }
        }
        if (digits.length() != 10) {
            System.out.println("Invalid number");
            return;
        }

        String place = placeFor(digits.substring(0, 3));
        int rate = switch (place) {
            case "Vice City" -> 1;
            case "Liberty City", "San Fierro" -> 3;
            default -> 5;
        };
        int cost = rate * Math.max(minutes, 1);
        System.out.println("Calling " + place);
        System.out.println("Cost: " + cost + (cost == 1 ? " coin" : " coins"));
    }
}
```
