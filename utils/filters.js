const util = require('util');
const { format, formatISO } = require('date-fns');
const markdown = require('./markdown');
const site = require('../src/_data/_site');

module.exports = {
    format: format,
    formatISO: formatISO,
    log: (data) => console.log(`\n\n${util.inspect(data)}\n\n`),
    markdown: (content) => markdown.renderInline(content),
    url: url => url? url.replace(site.dataUrl, '/') : "/",
    lowercase: content => content.toLowerCase(),
    uppercase: content => content.toUpperCase(),
    split: (content,t1,t2) => content.split(t1).join(t2),
    splitwords: (content) => content.split(" "),
    replace: (text, st1, st2) => text.replace(st1, st2),
    slugify: (str) => str?.replace(/\s+/g, '-').toLowerCase(),
    half: (items) => {
        const temp = [...items];
        const half = Math.ceil(temp.length / 2);
        return [temp.slice(0, half), temp.slice(-(half - 1))];
    },
    urlico: (text) => {
        if(text.indexOf("mailto")>-1) {
            return "m";
        } if(text.indexOf("instagram")>-1) {
            return "@";
        } else {
            return text.slice(0, 1);
        }
    },
    decoName: (text) => text.replace("Be", "<b>Be</b>").replace("Ar", "<b>Ar</b>"),
    labelDeco: (text) => {
        let newText = "";
        text.split("").map(char => {
            newText = newText + "<span>" + char + "</span>";
        });
        return newText;
    },
};
