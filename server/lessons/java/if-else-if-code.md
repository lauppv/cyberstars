public class Main {
public static void main(String[] args) {
int seconds = 60;
boolean errorDetected = false;

        if (seconds == 100) {
            System.out.println("Starting all onboard computers");
        } else if (seconds == 60) {
            System.out.println("Checking connection with the control tower");
        } else if (seconds == 20) {
            System.out.println("Starting secondary engines");
        } else if (seconds == 10) {
            System.out.println("Starting the main engines");
        } else if (seconds < 10) {
            if (errorDetected) {
                System.out.println("Error detected. Canceling the mission");
            } else {
                System.out.println("No error detected. Taking off...");
            }
        } else {
            System.out.println(seconds + " seconds has no effect");
        }
    }

}
