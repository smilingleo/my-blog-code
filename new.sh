#! /bin/bash


# Usage
# ./blog.sh 

if [ $# -ne 2 ]; then
    printf 'Missing arguments\nUsage:\n\tnew.sh <title> <pathname>\n'
    exit 1
fi


TITLE=$1
URL=$2

_YEAR=`date "+%Y"`
_DATE=`date "+%Y-%m-%dT%H:%M:%S.000+08"`
PATH="src/pages/$_YEAR"
FILE="$PATH/$TITLE.md"

# in case no folder existed.
if [ ! -d "$PATH" ]; then
    mkdir "$PATH"
fi

if [ -f "$FILE" ]; then
    echo "$FILE exists.";
    exit 1
fi

printf -- '---\npath: "%s"\ndate: "%s"\ntitle: "%s"\ntags: []\nexcerpt: ""\n---\n' "/$_YEAR/$URL" "$_DATE" "$TITLE" > "$FILE"