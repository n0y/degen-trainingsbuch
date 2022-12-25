const path = require('path');
const { resolve, relative } = path;
const fs = require('fs');
const { readdir } = fs.promises;
const Asciidoctor = require('@asciidoctor/core');
const asciidoctor = Asciidoctor()


const startDirectory = 'repository/modules/ROOT/partials';
const destDirectory =  'repository/modules/ROOT/pages/practices';
const pagePrefix = 'page$practices'

async function* getFiles(dir, filter  = (file) => true) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res, filter);
        } else if (filter(res)) {
            yield res;
        }
    }
}

function allFilters(filters) {
    return (file) => {
        for (const f of filters) {
            if (!f(file)) {
                return false;
            }
        }
        return true;
    }
}

function isUebung(doc) {
    const keywords = doc.getAttribute('keywords');
    if (keywords) {
        const kw = keywords.split(',').map(t => t.trim());
        if (kw.indexOf('uebung') >= 0) {
            return true;
        }
    }
    return false;
}

function ensureDirExists(dirName) {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, {recursive: true});
    }
}

function writeIndex(groups = new Map()) {
    const text = [];
    for (const group of groups.keys()) {
        text.push(`\n== ${group}\n`);
        for (const {file, title} of groups.get(group)) {
            const relFile = relative(destDirectory, file);
            text.push(`xref:${pagePrefix}/${relFile}[${title}]\n`);
        }
    }
    fs.writeFileSync(resolve(destDirectory, 'gen-practices.adoc'), text.join('\n'));
}

(async () => {
    const filters = allFilters([
        (file) => file.toLowerCase().endsWith('.adoc')
    ]);
    const groups = new Map();
    for await (const f of getFiles(startDirectory, filters)) {
        const doc = asciidoctor.loadFile(f);
        const group = doc.getAttribute('uebung-group') || "";
        if (isUebung(doc)) {
            const src = relative(startDirectory, f);
            const dst = resolve(destDirectory, src);
            ensureDirExists(path.dirname(dst));
            console.log(`To ${dst}`);
            fs.writeFileSync(dst, `:ownpage:\ninclude::partial$${src}[]\n`);
            if (!groups.has(group)) {
                groups.set(group, []);
            }
            groups.get(group).push({file: dst, title: doc.getDocumentTitle()});
            console.log(doc.getDocumentTitle());
        }
    }
    writeIndex(groups);
})()
