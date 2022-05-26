const locales = require('./locales.js');
const _all = require('./_all.js');
const type = "projects"

module.exports = async function getData(){
    console.log("Fetching projects...");

    var dataFinal = [];
    const dataAll = _all;

    for (let i in locales.langs) {
        const lang = locales.langs[i].code;

        for (let j=0; j<dataAll[lang][type].length; j++) {
            const counter = j+1 < 10? "0" + Number(j+1) : j+1;
            dataAll[lang][type][j].magazine_counter = counter;
        }

        dataFinal = [...dataFinal, ...dataAll[lang][type]]
    }

    return dataFinal;
}
