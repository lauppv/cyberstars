```java
import java.util.*;

public class Main {
    static class ParseError extends Exception {
        ParseError(int line, String message) { super("Line " + line + ": " + message); }
    }

    record Token(String text, int line, boolean string) {}

    static List<Token> tokens = new ArrayList<>();
    static int pos = 0;

    static void tokenize(List<String> lines) throws ParseError {
        for (int ln = 0; ln < lines.size(); ln++) {
            String s = lines.get(ln);
            int i = 0;
            while (i < s.length()) {
                char c = s.charAt(i);
                if (Character.isWhitespace(c)) { i++; continue; }
                if (c == '#') break; // a comment runs to the end of the line
                if ("{}[]:,".indexOf(c) >= 0) { tokens.add(new Token(String.valueOf(c), ln + 1, false)); i++; continue; }
                if (c == '"') {
                    int end = s.indexOf('"', i + 1);
                    if (end < 0) throw new ParseError(ln + 1, "a string that never ends");
                    tokens.add(new Token(s.substring(i + 1, end), ln + 1, true));
                    i = end + 1;
                    continue;
                }
                int j = i;
                while (j < s.length() && (Character.isLetterOrDigit(s.charAt(j)) || ".-_".indexOf(s.charAt(j)) >= 0)) j++;
                if (j == i) throw new ParseError(ln + 1, "unexpected " + c);
                tokens.add(new Token(s.substring(i, j), ln + 1, false));
                i = j;
            }
        }
    }

    static String shown(Token t) { return t.string() ? "\"" + t.text() + "\"" : t.text(); }

    static int lastLine() { return tokens.isEmpty() ? 1 : tokens.get(tokens.size() - 1).line(); }

    static Token next(String what) throws ParseError {
        if (pos >= tokens.size()) throw new ParseError(lastLine(), "the file ends before " + what);
        return tokens.get(pos++);
    }

    static void expect(String symbol) throws ParseError {
        Token t = next(symbol);
        if (t.string() || !t.text().equals(symbol)) throw new ParseError(t.line(), "expected " + symbol + " but found " + shown(t));
    }

    static Object value() throws ParseError {
        Token t = next("a value");
        if (t.string()) return t.text();
        switch (t.text()) {
            case "{" -> {
                Map<String, Object> map = new LinkedHashMap<>();
                if (peekIs("}")) { pos++; return map; }
                while (true) {
                    Token key = next("a name");
                    if (!key.string()) throw new ParseError(key.line(), "expected a name in quotes but found " + key.text());
                    if (map.containsKey(key.text())) throw new ParseError(key.line(), "\"" + key.text() + "\" twice");
                    expect(":");
                    map.put(key.text(), value());
                    Token sep = next("}");
                    if (sep.text().equals("}") && !sep.string()) return map;
                    if (!sep.text().equals(",") || sep.string()) throw new ParseError(sep.line(), "expected , or } but found " + shown(sep));
                }
            }
            case "[" -> {
                List<Object> list = new ArrayList<>();
                if (peekIs("]")) { pos++; return list; }
                while (true) {
                    list.add(value());
                    Token sep = next("]");
                    if (sep.text().equals("]") && !sep.string()) return list;
                    if (!sep.text().equals(",") || sep.string()) throw new ParseError(sep.line(), "expected , or ] but found " + shown(sep));
                }
            }
            case "true" -> { return Boolean.TRUE; }
            case "false" -> { return Boolean.FALSE; }
            case "null" -> { return null; }
            default -> {
                try {
                    if (t.text().contains(".")) return Double.parseDouble(t.text());
                    return Long.parseLong(t.text());
                } catch (NumberFormatException e) {
                    throw new ParseError(t.line(), "unexpected " + t.text());
                }
            }
        }
    }

    static boolean peekIs(String s) { return pos < tokens.size() && !tokens.get(pos).string() && tokens.get(pos).text().equals(s); }

    static final Object MISSING = new Object();

    @SuppressWarnings("unchecked")
    static Object find(Object root, String path) {
        Object cur = root;
        if (path.equals(".")) return cur;
        for (String part : path.split("\\.")) {
            String name = part;
            List<Integer> indexes = new ArrayList<>();
            while (name.endsWith("]") && name.contains("[")) {
                int open = name.lastIndexOf('[');
                try { indexes.add(0, Integer.parseInt(name.substring(open + 1, name.length() - 1))); }
                catch (NumberFormatException e) { return MISSING; }
                name = name.substring(0, open);
            }
            if (!name.isEmpty()) {
                if (!(cur instanceof Map) || !((Map<String, Object>) cur).containsKey(name)) return MISSING;
                cur = ((Map<String, Object>) cur).get(name);
            }
            for (int i : indexes) {
                if (!(cur instanceof List) || i < 0 || i >= ((List<Object>) cur).size()) return MISSING;
                cur = ((List<Object>) cur).get(i);
            }
        }
        return cur;
    }

    static String scalar(Object v) {
        if (v == null) return "null";
        if (v instanceof String s) return "\"" + s + "\"";
        if (v instanceof Double d) return d == Math.floor(d) && !d.isInfinite() ? String.format("%.1f", d) : String.valueOf(d);
        return String.valueOf(v);
    }

    static String count(int n, String word) { return n + " " + word + (n == 1 ? "" : "s"); }

    static String type(Object v) {
        if (v == null) return "null";
        if (v instanceof Map<?, ?> m) return "a group of " + count(m.size(), "setting");
        if (v instanceof List<?> l) return "a list of " + count(l.size(), "item");
        if (v instanceof String) return "text";
        if (v instanceof Boolean) return "yes or no";
        return v instanceof Double ? "a decimal number" : "a whole number";
    }

    @SuppressWarnings("unchecked")
    static void print(Object v, String indent, StringBuilder out) {
        if (v instanceof Map<?, ?> m) {
            if (m.isEmpty()) { out.append("{}"); return; }
            out.append("{\n");
            int k = 0;
            for (var e : ((Map<String, Object>) m).entrySet()) {
                out.append(indent).append("  \"").append(e.getKey()).append("\": ");
                print(e.getValue(), indent + "  ", out);
                out.append(++k < m.size() ? ",\n" : "\n");
            }
            out.append(indent).append("}");
        } else if (v instanceof List<?> l) {
            if (l.isEmpty()) { out.append("[]"); return; }
            out.append("[\n");
            for (int i = 0; i < l.size(); i++) {
                out.append(indent).append("  ");
                print(l.get(i), indent + "  ", out);
                out.append(i + 1 < l.size() ? ",\n" : "\n");
            }
            out.append(indent).append("]");
        } else out.append(scalar(v));
    }

    static int leaves(Object v) {
        if (v instanceof Map<?, ?> m) { int n = 0; for (Object x : m.values()) n += leaves(x); return n; }
        if (v instanceof List<?> l) { int n = 0; for (Object x : l) n += leaves(x); return n; }
        return 1;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (in.hasNextLine()) {
            String line = in.nextLine();
            if (line.trim().equals("---")) break;
            lines.add(line);
        }
        Object root;
        try {
            tokenize(lines);
            root = value();
            if (pos < tokens.size()) throw new ParseError(tokens.get(pos).line(), "more after the end: " + shown(tokens.get(pos)));
            if (!(root instanceof Map)) throw new ParseError(1, "the settings must be an object in { }");
        } catch (ParseError e) {
            System.out.println(e.getMessage());
            return;
        }
        System.out.println("Read " + leaves(root) + " values");
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (line.isEmpty()) continue;
            String[] w = line.split("\\s+");
            if (w[0].equals("quit")) { System.out.println("Bye"); return; }
            if (w.length != 2 || !(w[0].equals("get") || w[0].equals("type") || w[0].equals("print"))) {
                System.out.println("Use get, type or print with a path");
                continue;
            }
            Object v = find(root, w[1]);
            if (v == MISSING) { System.out.println("No such setting: " + w[1]); continue; }
            switch (w[0]) {
                case "get" -> System.out.println(v instanceof Map<?, ?> m ? "{" + count(m.size(), "setting") + "}"
                        : v instanceof List<?> l ? "[" + count(l.size(), "item") + "]" : scalar(v));
                case "type" -> System.out.println(w[1] + " is " + (v == null ? "empty (null)" : type(v)));
                default -> {
                    StringBuilder out = new StringBuilder();
                    print(v, "", out);
                    System.out.println(out);
                }
            }
        }
    }
}
```
