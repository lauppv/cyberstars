public class Main {
    static String[] filterSignals(String[] signals) {
        int count = 0;
        for (int i = 0; i < signals.length; i++) {
            if (signals[i].equals("out")) {
                break;
            }
            if (signals[i].equals("static")) {
                continue;
            }
            count++;
        }
        String[] names = new String[count];
        int k = 0;
        for (int i = 0; i < signals.length; i++) {
            if (signals[i].equals("out")) {
                break;
            }
            if (signals[i].equals("static")) {
                continue;
            }
            names[k] = signals[i].toUpperCase();
            k++;
        }
        return names;
    }

    public static void main(String[] args) {
        String[] signals = { "tommy", "static", "lance", "static", "cortez", "static", "diaz", "out", "mercedes" };
        String[] names = filterSignals(signals);
        for (String name : names) {
            System.out.println(name);
        }
        System.out.println("Total: " + names.length);
    }
}
