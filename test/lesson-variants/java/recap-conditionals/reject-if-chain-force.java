public class Main {
    public static void main(String[] args) {
        int stars = 3;
        if (stars == 0) {
            System.out.println("You are clean, no pursuit");
        } else if (stars == 1) {
            System.out.println("One police car spots you");
        } else if (stars == 2) {
            System.out.println("Several cars chase you");
        } else if (stars == 3) {
            System.out.println("A helicopter shows up");
        } else if (stars == 4) {
            System.out.println("Special forces arrive");
        } else if (stars == 5) {
            System.out.println("The FBI moves in");
        } else if (stars == 6) {
            System.out.println("The army rolls in tanks");
        } else {
            System.out.println("Invalid wanted level");
        }
        if (stars >= 5) {
            System.out.println("Critical situation, run now");
        } else if (stars >= 3) {
            System.out.println("High danger, escape fast");
        } else if (stars >= 1) {
            System.out.println("Under control, lose them in the streets");
        } else {
            System.out.println("All quiet");
        }
    }
}
