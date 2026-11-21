public class Main {
    public static void main(String[] args) {
        String name = "vice";
        String tag = "";
        for (int i = name.length() - 1; i >= 0; i--) {
            if (tag.length() > 0) {
                tag = tag + "-";
            }
            tag = tag + Character.toUpperCase(name.charAt(i));
        }
        System.out.println(tag);
        System.out.println("Length: " + tag.length());
    }
}
