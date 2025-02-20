#!/bin/bash
touch .env.local
echo "VITE_TOKEN=''" >> .env.local
echo "VITE_BACKEND_HOST=''" >> .env.local
echo "VITE_BACKEND_PORT=''" >> .env.local
echo "VITE_FRONTEND_PORT=''" >> .env.local