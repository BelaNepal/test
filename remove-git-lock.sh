#!/bin/bash
# Script to remove git lock files safely ok new test

LOCKFILE=".git/refs/remotes/origin/main.lock"

if [ -f "$LOCKFILE" ]; then
  echo "Removing lock file: $LOCKFILE"
  rm "$LOCKFILE"
  echo "Lock file removed."
else
  echo "No lock file found at $LOCKFILE"
fi
