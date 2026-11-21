public class Main {
    public static void main(String[] args) {
        String district = "Downtown";
        int rides = 3;
        int fare;
        switch (district) {
            case "Ocean Beach", "Washington Beach" -> fare = 12;
            case "Downtown" -> fare = 15;
            case "Little Havana", "Little Haiti" -> fare = 10;
            default -> fare = 20;
        }
        System.out.println("Fare: " + fare);
        System.out.println("Total: " + fare * rides);
    }
}
