const fs = require('fs');
const path = require('path');

const genDir = 'repository/modules/ROOT/partials/gen';

fs.copyFileSync('AUTOREN.adoc', path.join(genDir, 'AUTOREN.adoc'));
fs.copyFileSync('LICENSE.adoc', path.join(genDir, 'license-cc-sa-4.adoc'));
fs.copyFileSync('src/ui-bundle/LICENSE', path.join(genDir, 'license-mpl-2.txt'));
