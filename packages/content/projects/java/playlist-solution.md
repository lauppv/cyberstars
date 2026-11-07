```java
import java.util.*;

public class Main {
    interface Track {
        String title();
        int seconds();
        String label();
    }

    record Song(String title, String artist, int seconds) implements Track {
        public String label() { return artist + " - " + title; }
    }

    record Episode(String title, String show, int number, int seconds) implements Track {
        public String label() { return show + " #" + number + ": " + title; }
    }

    static class Playlist<T extends Track> implements Iterable<T> {
        private final String name;
        private final List<T> tracks = new ArrayList<>();
        Playlist(String name) { this.name = name; }
        void add(T track) { tracks.add(track); }
        T remove(int i) { return tracks.remove(i); }
        int size() { return tracks.size(); }
        String name() { return name; }
        public Iterator<T> iterator() { return tracks.iterator(); }

        // The tracks in a shuffled order that the seed decides, the same every time
        Iterator<T> shuffled(long seed) {
            List<T> copy = new ArrayList<>(tracks);
            long state = seed;
            for (int i = copy.size() - 1; i > 0; i--) {
                state = (state * 1103515245L + 12345L) % 2147483648L;
                int j = (int) (state % (i + 1));
                T t = copy.get(i);
                copy.set(i, copy.get(j));
                copy.set(j, t);
            }
            return copy.iterator();
        }
    }

    static String time(int s) {
        return s >= 3600 ? String.format("%d:%02d:%02d", s / 3600, s / 60 % 60, s % 60) : String.format("%d:%02d", s / 60, s % 60);
    }

    static int seconds(String text) {
        String[] p = text.split(":");
        if (p.length != 2) throw new IllegalArgumentException("Not a length: " + text);
        int m = Integer.parseInt(p[0]), s = Integer.parseInt(p[1]);
        if (s > 59 || m < 0 || s < 0) throw new IllegalArgumentException("Not a length: " + text);
        return m * 60 + s;
    }

    static <T extends Track> int total(Iterable<T> list) {
        int sum = 0;
        for (T t : list) sum += t.seconds();
        return sum;
    }

    static <T extends Track> T longest(Iterable<T> list) {
        T best = null;
        for (T t : list) if (best == null || t.seconds() > best.seconds()) best = t;
        return best;
    }

    static <T extends Track> void play(Iterator<T> it) {
        int n = 0, sum = 0;
        while (it.hasNext()) {
            T t = it.next();
            n++;
            sum += t.seconds();
            System.out.println(n + ". " + t.label() + " (" + time(t.seconds()) + ")");
        }
        System.out.println(n == 0 ? "Nothing to play" : "Total " + time(sum));
    }

    static Playlist<Song> music = new Playlist<>("music");
    static Playlist<Episode> podcasts = new Playlist<>("podcasts");

    static Playlist<? extends Track> list(String name) {
        if (name.equals("music")) return music;
        if (name.equals("podcasts")) return podcasts;
        throw new IllegalArgumentException("Playlists are music and podcasts");
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (line.isEmpty()) continue;
            try {
                if (line.contains("|")) {
                    String[] f = line.split("\\|");
                    if (f[0].equals("song") && f.length == 4) {
                        music.add(new Song(f[1], f[2], seconds(f[3])));
                        System.out.println("Added to music: " + f[2] + " - " + f[1]);
                    } else if (f[0].equals("episode") && f.length == 5) {
                        Episode e = new Episode(f[1], f[2], Integer.parseInt(f[3]), seconds(f[4]));
                        podcasts.add(e);
                        System.out.println("Added to podcasts: " + e.label());
                    } else {
                        System.out.println("Use song|title|artist|m:ss or episode|title|show|number|m:ss");
                    }
                    continue;
                }
                String[] w = line.split("\\s+");
                switch (w[0]) {
                    case "quit" -> { System.out.println("Bye"); return; }
                    case "play" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: play <playlist>");
                        play(list(w[1]).iterator());
                    }
                    case "shuffle" -> {
                        if (w.length != 3) throw new IllegalArgumentException("Usage: shuffle <playlist> <seed>");
                        Playlist<? extends Track> p = list(w[1]);
                        play(p.shuffled(Long.parseLong(w[2])));
                    }
                    case "remove" -> {
                        if (w.length != 3) throw new IllegalArgumentException("Usage: remove <playlist> <number>");
                        Playlist<? extends Track> p = list(w[1]);
                        int i = Integer.parseInt(w[2]);
                        if (i < 1 || i > p.size()) { System.out.println("No track " + i + " in " + p.name()); break; }
                        System.out.println("Removed " + p.remove(i - 1).label());
                    }
                    case "fit" -> {
                        if (w.length != 3) throw new IllegalArgumentException("Usage: fit <playlist> <m:ss>");
                        Playlist<? extends Track> p = list(w[1]);
                        int limit = seconds(w[2]), used = 0, n = 0;
                        for (Track t : p) {
                            if (used + t.seconds() <= limit) {
                                used += t.seconds();
                                n++;
                                System.out.println(n + ". " + t.label() + " (" + time(t.seconds()) + ")");
                            }
                        }
                        System.out.println(n == 0 ? "Nothing fits" : n + (n == 1 ? " track, " : " tracks, ") + time(used) + " of " + time(limit));
                    }
                    case "stats" -> {
                        for (Playlist<? extends Track> p : List.of(music, podcasts)) {
                            Track l = longest(p);
                            System.out.println(p.name() + ": " + p.size() + (p.size() == 1 ? " track, " : " tracks, ") + time(total(p))
                                    + (l == null ? "" : ", longest " + l.label()));
                        }
                    }
                    default -> System.out.println("Unknown command: " + w[0]);
                }
            } catch (NumberFormatException e) {
                System.out.println("Not a number: " + e.getMessage().replace("For input string: ", "").replace("\"", ""));
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
```
