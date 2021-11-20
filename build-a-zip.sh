#!/bin/bash

# ./update-and-compile-translations.sh

EXT_ID=move-osd-windows@maestroschan.fr

cd $EXT_ID

glib-compile-schemas ./schemas

zip ../$EXT_ID.zip *.js
zip ../$EXT_ID.zip metadata.json

zip -r ../$EXT_ID.zip schemas
zip -r ../$EXT_ID.zip locale

shopt -s globstar

zip -d ../$EXT_ID.zip **/*.pot
zip -d ../$EXT_ID.zip **/*.po

