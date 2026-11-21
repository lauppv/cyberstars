public class Main {
    public static void main(String[] args) {
        String district = "Downtown";
        int rides = 3;
        int fare = switch (district) {
            case "Ocean Beach":
            case "Washington Beach":
                yield 12;
            case "Downtown":
                yield 15;
            case "Little Havana", "Little Haiti":
                yield 10;
            default:
                yield 20;
        };
        int total = fare * rides;
        System.out.println("Fare: " + fare);
        System.out.println("Total: " + total);
    }
}
