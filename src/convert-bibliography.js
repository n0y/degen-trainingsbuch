const fs = require('fs');
const path = require('path');
const Cite = require('citation-js');
const parse = Cite.parse.input.chain;

const targetDirectory = path.join(process.cwd(), 'repository', 'modules', 'ROOT', 'partials', 'gen');
const fileContent = fs.readFileSync(path.join(process.cwd(), 'repository/modules/ROOT/literatur.bib'));
const cite = new Cite().set(parse(fileContent.toString()));

let cites = '\n';

for (var singleCitation of cite) {
    const singleCite = new Cite(singleCitation);

    cites = cites +
`
[[cite-${singleCitation.id}]]
//tag::${singleCitation.id}[]
ifndef::render-content[]
xref:bibliography.adoc#cite-${singleCitation.id}[${singleCite.format('citation')}]
endif::[]
//end::${singleCitation.id}[]
ifdef::render-content[]
${singleCite.get({format:'string', type:'string', style: 'citation-apa', lang: 'de-DE'})}endif::[]
`;
}

if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory, {recursive: true});
}


fs.writeFileSync(
    path.join(targetDirectory, 'bibliography.adoc'), cites);

console.log('OK');

