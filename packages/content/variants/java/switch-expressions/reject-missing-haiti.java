public class Main {
    public static void main(String[] args) {
        String district = "Downtown";
        int rides = 3;
        int fare = switch (district) {
            case "Ocean Beach", "Washington Beach" -> 12;
            case "Downtown" -> 15;
            case "Little Havana" -> 10;
            default -> 20;
        };
        System.out.println("Fare: " + fare);
        System.out.println("Total: " + fare * rides);
    }
}
