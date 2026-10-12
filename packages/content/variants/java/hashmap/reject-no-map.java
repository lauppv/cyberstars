public class Main {
    public static void main(String[] args) {
        int count1 = 47;
        int count2 = 12;
        int count3 = 8;
        int count4 = 23;
        String[] names = { "Tommy", "Lance", "Phil", "Mercedes" };
        int[] counts = { count1, count2, count3, count4 };
        for (int i = 0; i < 4; i++) {
            if (counts[i] > 15) {
                System.out.println(names[i] + ": " + counts[i]);
            }
        }
    }
}
