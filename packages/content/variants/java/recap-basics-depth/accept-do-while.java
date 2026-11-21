public class Main {
    static String where(String code) {
        String place = switch (code) {
            case "305", "786" -> "Vice City";
            case "212" -> "Liberty City";
            case "415" -> "San Fierro";
            default -> "Long distance";
        };
        return place;
    }

    public static void main(String[] args) {
        String dialed = "305-555-0142";
        int minutes = 3;
        String digits = "";
        int i = 0;
        while (i < dialed.length()) {
            if (Character.isDigit(dialed.charAt(i))) digits += dialed.charAt(i);
            i++;
        }
        if (digits.length() == 10) {
            String place = where(digits.substring(0, 3));
            int perMinute = place.equals("Vice City") ? 1 : place.equals("Long distance") ? 5 : 3;
            int cost = perMinute * (minutes < 1 ? 1 : minutes);
            System.out.println("Calling " + place);
            System.out.println("Cost: " + cost + " " + (cost == 1 ? "coin" : "coins"));
        } else {
            System.out.println("Invalid number");
        }
    }
}
