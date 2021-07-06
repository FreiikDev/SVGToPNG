const {readdir, mkdir, readFile, writeFileSync} = require("fs"),
    svg2img = require("svg2img"),
    config = require("./config.json");

readdir(`${__dirname}/input`, async (err, files) => {
    if (err) console.log(err);

    if (files.length <= 0) throw new Error("There is no file in the input folder.")
    const folder = `${__dirname}/output/${new Date().toISOString().replace(/T/, ' ').replace(/\\..+/, '').replace(/:/g, '-').replace(/.[0-9]{2,3}Z/, '')}`
    await mkdir(folder, {recursive: true}, (err) => {
        if (err) throw err;
    });
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.endsWith(".svg")) return;
        readFile(`${__dirname}/input/${file}`, 'utf8', function (err, data) {
            if (err) return console.log(err);
            const dimensions = data.match(/width="(.[0-9])" height="(.[0-9])"/).map(x => Number(x));
            if (dimensions.length < 3 || dimensions.length > 3) throw new Error(`The file ${file} has a invalid SVG.`);
            svg2img(data, {
                'width': dimensions[1] * config.multiplicator,
                'height': dimensions[2] * config.multiplicator,
                preserveAspectRatio: true
            }, function (error, buffer) {
                writeFileSync(`${folder}/${file.replace(".svg", ".png")}`, buffer);
            });
        })
    }
})