#!/bin/bash

function error {
  printf "\e[91;5;81m$@\e[0m\n"
}

function success {
  printf "\e[32;5;81m$@\e[0m\n"
}

COUNT=$(find . -path ./node_modules -prune -false -o -name 'package-lock.json' | wc -l)

if [[ COUNT -gt 0 ]]; then
  error "This repository doesn't allow package-lock.json."
  exit 1
fi

success "All clean 😊 "
exit 0