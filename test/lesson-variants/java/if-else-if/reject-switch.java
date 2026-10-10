public class Main {
    public static void main(String[] args) {
        int seconds = 100;
        switch (seconds) {
            case 100 -> System.out.println("Starting all onboard computers");
            case 60 -> System.out.println("Checking connection with the control tower");
            case 20 -> System.out.println("Starting secondary engines");
            case 10 -> System.out.println("Starting the main engines");
            default -> System.out.println("Standing by...");
        }
    }
}
