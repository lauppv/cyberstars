```bash
mkdir id-check
whoami > id-check/identity.txt
id >> id-check/identity.txt
chmod 600 classified.doc
cat id-check/identity.txt
```

```text
student
uid=1000(student) gid=1000(student) groups=1000(student)
```
