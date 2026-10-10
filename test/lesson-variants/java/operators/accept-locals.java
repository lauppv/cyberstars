public class Main {
    public static void main(String[] args) {
        int a = 3;
        int b = 4;
        int sum = a + b, diff = a - b, prod = a * b, quot = a / b, rem = a % b;
        int[] results = { sum, diff, prod, quot, rem };
        for (int r : results) {
            System.out.println(r);
        }
    }
}
