#!/bin/sh
TIMESTAMP=$(date)
echo "🔹 Project Update - $TIMESTAMP" >> project-log.txt
git diff >> project-log.txt
git add project-log.txt
git commit -m "Auto log update - $TIMESTAMP"
git push origin main
