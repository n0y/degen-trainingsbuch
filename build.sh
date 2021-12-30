#!/usr/bin/env sh

docker run -it --rm -v "$(pwd):/data" asciidoctor/docker-asciidoctor bash -c "cd /data/src; asciidoctor -t -v -r asciidoctor-bibtex -r asciidoctor-mathematical -a mathematical-format=svg -o ../public/index.html index.adoc"
