public class Main {
    static String[] filter(String[] signals) {
        int valid = 0;
        for (String s : signals) {
            if (!s.equals("static") && !s.equals("out")) valid++;
        }
        String[] result = new String[valid];
        int p = 0;
        for (String s : signals) {
            if (!s.equals("static") && !s.equals("out")) result[p++] = s.toUpperCase();
        }
        return result;
    }

    public static void main(String[] args) {
        String[] signals = { "tommy", "static", "lance" };
        String[] cleaned = filter(signals);
        for (String s : cleaned) System.out.println(s);
        System.out.println("Total: " + cleaned.length);
    }
}
