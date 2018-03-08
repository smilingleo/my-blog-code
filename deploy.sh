#! /bin/bash

# Add all changes
git add .

git commit -m "$1"

git push origin master

yarn deploy

cd public

git add .
git commit -m "$1"
git push origin master