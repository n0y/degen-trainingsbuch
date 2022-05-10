const fs = require('fs');
const path = require('path');

const Cite = require('citation-js');

const cite = new Cite();
const parse = Cite.parse.input.chain;

const parsedBib = parse(fs.readFileSync(path.join('src', 'literatur.bib')).toString());
/** @type {string} */
const out = cite
    .set(parsedBib)
    .get({
        format: 'string',
        type: 'html',
        style: 'citation-harvard1',
        lang: 'de-DE'
    })
    .replaceAll(/ *<div data-csl-entry-id="([^"]*)"[^>]*>/g, '\n* [[[$1]]] ')
    .replaceAll(/<\/?i>/g, '_')
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll(/&#38;/g, '&');
fs.writeFileSync(path.join('repository', 'modules', 'ROOT', 'partials', 'bibliography', 'gen-bibliography.adoc'),
    '[bibliography]' + out);
