public class Main {
    public static void main(String[] args) {
        Object[] evidence = { "knife", 3, "photo", 10 };
        int texts = 0, sum = 0;
        for (Object item : evidence) {
            System.out.println(item.getClass().getSimpleName() + ": " + item);
            String text = "" + item;
            if (text.matches("-?\\d+")) {
                sum += Integer.parseInt(text);
            } else {
                texts++;
            }
        }
        System.out.println("Text items: " + texts);
        System.out.println("Number sum: " + sum);
    }
}
