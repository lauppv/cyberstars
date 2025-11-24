#!/bin/sh

SRC_FILE=$1

# rulează codul python cu timeout 2 secunde
timeout 2 python3 "$SRC_FILE"
