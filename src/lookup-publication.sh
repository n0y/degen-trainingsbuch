#!/bin/sh

# Pubmed "PMID", "PMCID" mit:          "pmid:<ID>"
# DOI einfach mit der DOI als String:  "<ID>"

npx citation-js --plugins isbn,doi,pubmed -f string -s bibtex -t "$1"
