public class Main {
    static int checkCode(String code) throws Exception {
        if (code.length() == 4) return Integer.parseInt(code);
        throw new Exception("needs 4 characters");
    }

    public static void main(String[] args) {
        String[] codes = {"1986", "12345", "19x6", "0042"};
        int ok = 0;
        for (int i = 0; i < codes.length; i++) {
            String line;
            try {
                checkCode(codes[i]);
                line = "Code ok: " + codes[i];
                ok += 1;
            } catch (NumberFormatException nfe) {
                line = "Not a number: " + codes[i];
            } catch (Exception ex) {
                line = "Bad code: " + ex.getMessage();
            }
            System.out.println(line);
        }
        System.out.println("Good codes: " + ok);
    }
}
