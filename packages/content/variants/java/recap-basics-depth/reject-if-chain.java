public class Main {
    static String placeFor(String area) {
        if (area.equals("305") || area.equals("786")) return "Vice City";
        if (area.equals("212")) return "Liberty City";
        if (area.equals("415")) return "San Fierro";
        return "Long distance";
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
        int cost = rate * Math.max(minutes, 1);
        System.out.println("Calling " + place);
        System.out.println("Cost: " + cost + (cost == 1 ? " coin" : " coins"));
    }
}
