#!/bin/sh

# Pubmed "PMID", "PMCID" mit "pmid:<ID>"

npx citation-js --plugins isbn,doi,pubmed -f string -s bibtex -t "$1"
