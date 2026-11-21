public class Main {
    public static void main(String[] args) {
        String name = "vice";
        StringBuilder back = new StringBuilder(name.toUpperCase()).reverse();
        StringBuilder tag = new StringBuilder();
        for (int i = 0; i < back.length(); i++) {
            tag.append(back.charAt(i));
            if (i < back.length() - 1) {
                tag.append("-");
            }
        }
        String done = tag.toString();
        System.out.println(done);
        System.out.println("Length: " + done.length());
    }
}
