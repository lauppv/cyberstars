public class Main {
    static String force(int s) {
        return switch (s) {
            case 0 -> "You are clean, no pursuit";
            case 1 -> "One police car spots you";
            case 2 -> "Several cars chase you";
            case 3 -> "A helicopter shows up";
            case 4 -> "Special forces arrive";
            case 5 -> "The FBI moves in";
            case 6 -> "The army rolls in tanks";
            default -> "Invalid wanted level";
        };
    }

    static String danger(int s) {
        if (s > 4) return "Critical situation, run now";
        else if (s > 2) return "High danger, escape fast";
        else if (s > 0) return "Under control, lose them in the streets";
        return "All quiet";
    }

    public static void main(String[] args) {
        int stars = 3;
        System.out.println(force(stars) + "\n" + danger(stars));
    }
}
