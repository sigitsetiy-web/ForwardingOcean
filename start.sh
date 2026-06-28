#!/bin/bash
set -a
source "$(dirname "$0")/.env"
set +a
exec node_modules/.bin/next start -p "${PORT:-3005}"
