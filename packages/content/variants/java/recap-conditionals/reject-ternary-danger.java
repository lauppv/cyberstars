public class Main {
    public static void main(String[] args) {
        int stars = 3;
        switch (stars) {
            case 0 -> System.out.println("You are clean, no pursuit");
            case 1 -> System.out.println("One police car spots you");
            case 2 -> System.out.println("Several cars chase you");
            case 3 -> System.out.println("A helicopter shows up");
            case 4 -> System.out.println("Special forces arrive");
            case 5 -> System.out.println("The FBI moves in");
            case 6 -> System.out.println("The army rolls in tanks");
            default -> System.out.println("Invalid wanted level");
        }
        String danger = stars >= 5 ? "Critical situation, run now"
                : stars >= 3 ? "High danger, escape fast"
                : stars >= 1 ? "Under control, lose them in the streets"
                : "All quiet";
        System.out.println(danger);
    }
}
