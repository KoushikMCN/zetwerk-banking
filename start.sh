#!/bin/bash

set -e

trap 'kill 0' EXIT

echo "Starting backend..."
(
    cd backend
    npm run start:dev
) &

echo "Starting frontend..."
(
    cd frontend
    npm run dev
) &

wait