public class Main {
    public static void main(String[] args) {
        int seconds = 100;
        String action;
        if (10 == seconds) {
            action = "Starting the main engines";
        } else if (20 == seconds) {
            action = "Starting secondary engines";
        } else if (60 == seconds) {
            action = "Checking connection with the control tower";
        } else if (100 == seconds) {
            action = "Starting all onboard computers";
        } else {
            action = "Standing by...";
        }
        System.out.println(action);
    }
}
