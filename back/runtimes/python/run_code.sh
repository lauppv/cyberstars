#!/bin/sh

# Script pentru rularea codului Python cu timeout
SRC_FILE=$1

# rulează codul Python cu timeout 5 secunde
timeout 5 python3 "$SRC_FILE"
if [ $? -eq 124 ]; then
  echo "Programul a depășit timpul maxim de execuție (5s) și a fost oprit."
fi
