public class Main {
    public static <T> int count(T[] items, T target) {
        int n = 0;
        for (int i = 0; i < items.length; i++) {
            if (target.equals(items[i])) n++;
        }
        return n;
    }

    public static <T> T lastOf(T[] items) {
        T last = null;
        for (T item : items) last = item;
        return last;
    }

    public static void main(String[] args) {
        String[] words = { "cash", "gun", "cash" };
        String word = "cash";
        Integer[] numbers = { 1000, 5, 1000, 1000 };
        Integer number = 1000;
        System.out.println(word + ": " + count(words, word) + " times");
        System.out.println(number + ": " + count(numbers, number) + " times");
        System.out.println("Last word: " + lastOf(words));
        System.out.println("Last number: " + lastOf(numbers));
    }
}
