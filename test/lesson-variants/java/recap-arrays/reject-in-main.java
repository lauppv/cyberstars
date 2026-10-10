public class Main {
    public static void main(String[] args) {
        String[] signals = { "tommy", "static", "lance" };
        int total = 0;
        for (String s : signals) {
            if (s.equals("out")) break;
            if (s.equals("static")) continue;
            System.out.println(s.toUpperCase());
            total++;
        }
        System.out.println("Total: " + total);
    }
}
