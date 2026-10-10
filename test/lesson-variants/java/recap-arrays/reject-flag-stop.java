public class Main {
    static String[] filterSignals(String[] signals) {
        String[] buffer = new String[signals.length];
        int count = 0;
        boolean stopped = false;
        for (String s : signals) {
            if (s.equals("out")) {
                stopped = true;
            }
            if (stopped || s.equals("static")) {
                continue;
            }
            buffer[count++] = s.toUpperCase();
        }
        String[] names = new String[count];
        for (int i = 0; i < count; i++) {
            names[i] = buffer[i];
        }
        return names;
    }

    public static void main(String[] args) {
        String[] signals = { "tommy", "static", "lance", "out", "mercedes" };
        String[] names = filterSignals(signals);
        for (String n : names) {
            System.out.println(n);
        }
        System.out.println("Total: " + names.length);
    }
}
