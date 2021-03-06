#!/usr/bin/env bash
# npm exports original working directory as INIT_CWD
if [ -n "$INIT_CWD" ]; then
  cd "$INIT_CWD"
fi

if [ "$#" = "0" ]; then
  set -ex
  exec jest
else
  set -ex
  exec jest $@
fi
