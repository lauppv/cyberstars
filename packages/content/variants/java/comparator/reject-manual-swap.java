public class Main {
    public static void main(String[] args) {
        String[] drivers = {"Tommy", "Lance", "Phil", "Candy"};
        int[] times = {61, 58, 75, 61};
        int n = drivers.length;
        String[] d = drivers.clone();
        int[] t = times.clone();
        for (int i = 0; i < n; i++)
            for (int j = 0; j + 1 < n - i; j++)
                if (t[j] > t[j + 1]) {
                    int x = t[j]; t[j] = t[j + 1]; t[j + 1] = x;
                    String y = d[j]; d[j] = d[j + 1]; d[j + 1] = y;
                }
        System.out.println("By time:");
        for (int i = 0; i < n; i++) System.out.println(d[i] + " - " + t[i] + " s");
        for (int i = 0; i < n; i++)
            for (int j = 0; j + 1 < n - i; j++)
                if (d[j].compareTo(d[j + 1]) > 0) {
                    int x = t[j]; t[j] = t[j + 1]; t[j + 1] = x;
                    String y = d[j]; d[j] = d[j + 1]; d[j + 1] = y;
                }
        System.out.println("By name:");
        for (int i = 0; i < n; i++) System.out.println(d[i] + " - " + t[i] + " s");
    }
}
