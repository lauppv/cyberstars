public class Main {
    public static void main(String[] args) {
        String day = "Monday";

        String shift = switch (day) {
            case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" -> "Weekday";
            case "Saturday", "Sunday" -> "Weekend";
            default -> "Unknown day";
        };
        System.out.println(shift);
    }
}
