#!/usr/bin/env sh

if [ -d public ]; then rm -rf public; fi
mkdir public
(cd src && find . -regextype egrep -regex '.*\.(png|jpg|svg)$' -print0 | xargs -0 cp -t ../public/)
docker run -it --rm -v "$(pwd):/data" asciidoctor/docker-asciidoctor bash -c "cd /data/src; asciidoctor -t -v -r asciidoctor-bibtex -r asciidoctor-mathematical -a mathematical-format=svg -o /data/public/index.html /data/src/index.adoc"
