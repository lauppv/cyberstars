#!/bin/sh

SRC_FILE=$1
OUT_FILE="a.out"

gcc "$SRC_FILE" -o "$OUT_FILE" 2> compile_errors.txt

if [ -s compile_errors.txt ]; then
    cat compile_errors.txt
    exit
fi

# Rulează binarul, maxim 2 secunde
timeout 2 ./"$OUT_FILE"
