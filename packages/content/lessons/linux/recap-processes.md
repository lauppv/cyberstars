Chapter 8 was about the system itself: which programs are running, stopping one, how much disk is used, and when things happened.

When something goes wrong on a real machine, this is where you start looking.

---

## Mission: System Health Inspection

The station is approaching a debris field, and the captain wants a systems check on file before entry. Check how much disk space the station has left, then write `inspection.txt`:

1. the date and time of the inspection, on the first line;
2. the process lines of the reactor monitor and of life support, to prove both are running;
3. how much room the `logs` folder takes, in all and readable at a glance, on the last line.

Every line comes straight from the system, not typed by hand.

**Expected result**

`inspection.txt` opens with the timestamp, shows the reactor monitor and life support running, and ends with the size of `logs`.
