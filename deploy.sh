#! /bin/bash

if [ $# -ne 1 ]; then
  printf "\e[34;1mError: Need to provide commit message as argument.\e[0m \n"
  printf "Usage:\n"
  printf "\t./deploy.sh 'commit message'\n"
  exit 1
fi

# Add all changes
git add .

git commit -m "$1"

git push origin master

yarn deploy

cd public

git add .
git commit -m "$1"
git push origin master