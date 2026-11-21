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
            if (Character.isDigit(dialed.charAt(i))) digits += dialed.charAt(i);
        }
        if (digits.length() != 10) {
            System.out.println("Invalid number");
            return;
        }
        String place = placeFor(digits.substring(0, 3));
        int rate = place.equals("Vice City") ? 1 : place.equals("Long distance") ? 5 : 3;
        int cost = rate * minutes;
        System.out.println("Calling " + place);
        System.out.println("Cost: " + cost + (cost == 1 ? " coin" : " coins"));
    }
}
