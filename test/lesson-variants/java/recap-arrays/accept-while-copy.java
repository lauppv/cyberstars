public class Main {
    public static String[] radioFilter(String[] in) {
        String[] buffer = new String[in.length];
        int n = 0;
        int i = 0;
        while (i < in.length && !in[i].equals("out")) {
            if (!in[i].equals("static")) {
                buffer[n++] = in[i].toUpperCase();
            }
            i++;
        }
        String[] out = new String[n];
        System.arraycopy(buffer, 0, out, 0, n);
        return out;
    }

    public static void main(String[] args) {
        String[] signals = { "tommy", "static", "lance" };
        String[] result = radioFilter(signals);
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < result.length; k++) {
            sb.append(result[k]).append("\n");
        }
        sb.append("Total: ").append(result.length);
        System.out.println(sb);
    }
}
