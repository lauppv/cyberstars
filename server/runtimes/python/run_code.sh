#!/bin/sh
SRC_FILE=$1

# rulează codul python timp de max 5 secunde
timeout 5 python3 "$SRC_FILE"
# STATUS=$?

# # dacă timeout s-a întâmplat, trimite mesaj
# if [ $STATUS -eq 124 ]; then
#   echo "Ai intrat într-un loop infinit. Execuția a fost oprită după 5 secunde."
# fi
