Chapter 6 was about turning raw text into answers: putting lines in order, counting repeats, taking out columns, replacing words and adding numbers up.

Most real questions need several of these joined together, and this mission is no different.

---

## Mission: Crew Activity Report

The station administrator needs a summary of crew activity from `raw_data.csv`, which records one task per line: who did it, what kind of task, and how many times. It is unsorted and the names repeat. Make two files, each straight from the data:

- `report.txt`: each crew member once, with how many records they have, the most active first;
- `scan-total.txt`: the number alone, how many scans the crew made in all, adding up the last column of every `scan` record.

**Expected result**

`report.txt` has one line per crew member with their number of records, the most active on top, and `scan-total.txt` holds one number.
