import fs from 'fs';

test('generate typescript declaration for kml', async () => {
    const tour = await fs.promises.readFile("public/tours/libraries.kml");

    const kml = await require('xml2js').parseStringPromise(tour, {
        explicitArray : false,

    })

    const tsg = require('dts-gen');
    const declaration = tsg.generateModuleDeclarationFile("Kml", kml)
    console.log(declaration);

})


