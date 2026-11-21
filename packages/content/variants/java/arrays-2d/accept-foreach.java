public class Main {
    public static void main(String[] args) {
        int[][] vault = { { 100, 500, 20 }, { 0, 900, 50 } };
        int best = -1, bf = 0, bs = 0, floorNo = 0;
        for (int[] floor : vault) {
            floorNo++;
            int sum = 0;
            int safeNo = 0;
            for (int cash : floor) {
                safeNo++;
                sum += cash;
                if (cash > best) {
                    best = cash;
                    bf = floorNo;
                    bs = safeNo;
                }
            }
            System.out.println("Floor " + floorNo + ": " + sum);
        }
        System.out.println("Best safe: floor " + bf + ", safe " + bs + ", cash " + best);
    }
}
