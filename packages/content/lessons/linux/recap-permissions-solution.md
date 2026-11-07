```bash
cat crew_roster.txt
chmod 600 launch_codes.txt
chmod 750 status_report.sh
chmod 640 crew_roster.txt
chmod 644 public_bulletin.txt
ls -l
```

```text
INTERNAL - crew only
Voss, Tanaka, Chen, Okafor
total 16
-rw-r----- 1 student student 48 May 16 10:00 crew_roster.txt
-rw------- 1 student student 32 May 16 10:00 launch_codes.txt
-rw-r--r-- 1 student student 40 May 16 10:00 public_bulletin.txt
-rwxr-x--- 1 student student 38 May 16 10:00 status_report.sh
```
