#!/bin/sh

gradle shadowJar
java -Djdk.xml.entityExpansionLimit=0 -jar build/libs/JapaneseSync-all.jar