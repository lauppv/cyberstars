public class Main {
    public static void main(String[] args) {
        int stars = 3;
        String[] forces = {
            "You are clean, no pursuit", "One police car spots you", "Several cars chase you",
            "A helicopter shows up", "Special forces arrive", "The FBI moves in", "The army rolls in tanks"
        };
        switch (stars) {
            case 0, 1, 2, 3, 4, 5, 6:
                System.out.println(forces[stars]);
                break;
            default:
                System.out.println("Invalid wanted level");
        }
        String msg;
        if (stars <= 0) {
            msg = "All quiet";
        } else if (stars <= 2) {
            msg = "Under control, lose them in the streets";
        } else if (stars <= 4) {
            msg = "High danger, escape fast";
        } else {
            msg = "Critical situation, run now";
        }
        System.out.println(msg);
    }
}
