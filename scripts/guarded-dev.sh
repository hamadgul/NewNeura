#!/usr/bin/env bash
# Run a dev server (or any long command) under a memory watchdog.
#
# Why this exists: on 2026-09-10 `next dev` in a source repo on Next <16.3 inferred its
# workspace root as $HOME (a stray ~/package-lock.json) and crawled the whole home
# directory — 48GB gone in ~2 minutes, five kernel panics. The stray files are gone,
# but nothing else stops the next runaway. This wrapper does: it puts the command in
# its own process group, samples the group's total RSS every 2s, and kills the whole
# group if it exceeds the limit, if system free memory drops too low, or if it runs
# past the deadline.
#
# Usage:
#   scripts/guarded-dev.sh [--limit-mb N] [--min-free-pct N] [--max-secs N] [--log FILE] -- <command...>
# Example:
#   scripts/guarded-dev.sh --limit-mb 4096 --log /tmp/pizzeria-dev.log -- npx next dev --port 3103
#
# Exit codes: 0 command exited cleanly; 97 killed for RSS; 98 killed for low free memory;
# 99 killed for deadline; otherwise the command's own exit code.
set -u

LIMIT_MB=4096
MIN_FREE_PCT=15
MAX_SECS=5400
LOG=""
while [ $# -gt 0 ]; do
  case "$1" in
    --limit-mb) LIMIT_MB="$2"; shift 2 ;;
    --min-free-pct) MIN_FREE_PCT="$2"; shift 2 ;;
    --max-secs) MAX_SECS="$2"; shift 2 ;;
    --log) LOG="$2"; shift 2 ;;
    --) shift; break ;;
    *) echo "guarded-dev: unknown option $1" >&2; exit 2 ;;
  esac
done
[ $# -gt 0 ] || { echo "guarded-dev: no command given" >&2; exit 2; }

# New process group so we can kill every descendant (next spawns workers) in one call.
if [ -n "$LOG" ]; then
  python3 -c 'import os,sys; os.setsid(); os.execvp(sys.argv[1], sys.argv[1:])' "$@" >"$LOG" 2>&1 &
else
  python3 -c 'import os,sys; os.setsid(); os.execvp(sys.argv[1], sys.argv[1:])' "$@" &
fi
CHILD=$!
# setsid runs inside the child after fork; wait until its pgid equals its pid before
# trusting it, otherwise we would watch (and later kill) our own process group.
PGID=""
for _ in $(seq 1 50); do
  PGID=$(ps -o pgid= -p "$CHILD" 2>/dev/null | tr -d ' ')
  [ "$PGID" = "$CHILD" ] && break
  sleep 0.1
done
[ "$PGID" = "$CHILD" ] || { echo "guarded-dev: child never became its own process group (pgid=$PGID)" >&2; kill -KILL "$CHILD" 2>/dev/null; exit 2; }
START=$(date +%s)
echo "guarded-dev: pid $CHILD pgid $PGID limit ${LIMIT_MB}MB min-free ${MIN_FREE_PCT}% deadline ${MAX_SECS}s" >&2

group_rss_mb() { ps -ax -o pgid=,rss= | awk -v g="$PGID" '$1==g {s+=$2} END {printf "%d", s/1024}'; }
free_pct() { memory_pressure 2>/dev/null | awk -F': ' '/System-wide memory free percentage/ {gsub("%","",$2); print $2+0}'; }
die() { echo "guarded-dev: $2 — killing pgid $PGID" >&2; kill -TERM -- -"$PGID" 2>/dev/null; sleep 2; kill -KILL -- -"$PGID" 2>/dev/null; exit "$1"; }
trap 'kill -TERM -- -"$PGID" 2>/dev/null; sleep 1; kill -KILL -- -"$PGID" 2>/dev/null; exit 130' INT TERM

PEAK=0
while kill -0 "$CHILD" 2>/dev/null; do
  RSS=$(group_rss_mb); FREE=$(free_pct); NOW=$(date +%s)
  [ "$RSS" -gt "$PEAK" ] && PEAK=$RSS
  [ "$RSS" -gt "$LIMIT_MB" ] && die 97 "process group RSS ${RSS}MB exceeded ${LIMIT_MB}MB"
  [ -n "$FREE" ] && [ "$FREE" -lt "$MIN_FREE_PCT" ] && die 98 "system free memory ${FREE}% below ${MIN_FREE_PCT}%"
  [ $((NOW - START)) -gt "$MAX_SECS" ] && die 99 "deadline ${MAX_SECS}s reached"
  sleep 2
done
wait "$CHILD"; RC=$?
echo "guarded-dev: command exited $RC (peak group RSS ${PEAK}MB)" >&2
exit $RC
