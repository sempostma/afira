

const { searchFonts, listFonts, printFont, listIcons, getIcons, getName, getFilename } = require('.');
const { DOMParser, XMLSerializer } = require('xmldom');
const lodash = require('lodash');
const sharp = require('sharp');
const terminalImage = require('terminal-image');
const path = require('path');
const fs = require('fs-extra');

module.exports = async ({
    output,
    fill,
    rounded,
    margins,
    borderRadius,
    width,
    height,
    stroke,
    list,
    fontName,
    iconName,
    type,
    background
}) => {
    margins = +margins;

    try {
        if (fontName) {
            if (iconName) {
                const icons = await getIcons({ fontName, iconName });

                const exactMath = icons.find(ic =>
                    getName(ic) === iconName.toLowerCase()
                    || getFilename(ic) === iconName.toLowerCase());

                if (icons.length === 0) {
                    throw new Error(`Could not find icon ${iconName}.`);
                }

                else if (icons.length > 1 && !exactMath) {
                    console.log(`Found ${icons.length} icon${icons.length > 1 ? 's' : ''} with that name.`);
                    const display = icons.slice(0, 10).map(getName);
                    if (icons.length > 10) {
                        display.push('...');
                    }
                    console.log(display.join('\n'));
                } else {
                    const icon = exactMath || icons[0];

                    let svgString = icon.data.toString();
                    let xml = new DOMParser().parseFromString(svgString, 'image/svg+xml');

                    if (fill) {
                        const paths = Array.from(xml.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path'));
                        const circles = Array.from(xml.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'circle'));
                        const rects = Array.from(xml.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'rect'));
                        const ellipses = Array.from(xml.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'ellipse'));
                        const polygons = Array.from(xml.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'polygon'));
                        [
                            ...paths,
                            ...circles,
                            ...rects,
                            ...ellipses,
                            ...polygons
                        ].forEach(p => p.setAttribute('fill', fill));
                    }

                    if (stroke) {
                        const paths = Array.from(xml.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path'));
                        paths.forEach(p => p.setAttribute('stroke', stroke));
                    }

                    if (width && !height) {
                        const ratio = +width / +xml.documentElement.getAttribute('width');
                        xml.documentElement.setAttribute('width', width);
                        xml.documentElement.setAttribute('height',
                            xml.documentElement.getAttribute('height') * ratio);
                    }

                    else if (height && !width) {
                        const ratio = +height / +xml.documentElement.getAttribute('height');
                        xml.documentElement.setAttribute('height', height);
                        xml.documentElement.setAttribute('width',
                            xml.documentElement.getAttribute('width') * ratio);
                    }

                    else if (width && height) {
                        xml.documentElement.setAttribute('width', width);
                        xml.documentElement.setAttribute('height', height);
                    }

                    svgString = Buffer.from(
                        new XMLSerializer().serializeToString(xml)
                    );

                    if (output) {
                        let filename = path.resolve(process.cwd(), output);

                        if (type === 'png' || filename.endsWith('.png')) {
                            if (!filename.includes('.')) filename += '.png';
                            let sharpImg = sharp(Buffer.from(svgString))

                            const metadata = await sharpImg.metadata();

                            if (rounded) {

                                if (!margins) throw new Error('When specificing --rounded you need to specify the --margins option with a positive number.');

                                const br = borderRadius
                                    ? +borderRadius
                                    : Math.round(metadata.width / 2 + margins);

                                const roundedCorners = Buffer.from(
                                    `<svg><rect x="0" y="0" width="${metadata.width + margins * 2}" height="${metadata.height + margins * 2}" rx="${br}" ry="${br}"/></svg>`
                                );

                                sharpImg = await sharp(
                                    await sharp(
                                        await sharpImg
                                            .extend({ top: margins, left: margins, bottom: margins, right: margins, background: rounded })
                                            .flatten({
                                                background: rounded
                                            })
                                            .png()
                                            .toBuffer()
                                    )
                                        .composite([{
                                            input: roundedCorners,
                                            gravity: 'center',
                                            blend: 'dest-in'
                                        }])
                                        .png()
                                        .toBuffer()
                                )
                            }
                            else if (margins) {
                                sharpImg.extend({ top: margins, left: margins, bottom: margins, right: margins, background: '#00000000' })
                            }

                            if (background)
                                sharpImg.flatten({ background })

                            sharpImg
                                .png()
                                .toFile(filename);
                            console.log(`Wrote bitmap png file to "${filename}"`);
                        } else {
                            
                            if (!filename.includes('.')) filename += '.svg';
                            filename = path.resolve(process.cwd(), filename);
                            await fs.writeFile(filename, svgString);
                            console.log(`Wrote vector svg file to "${filename}".`);
                        }
                    } else {
                        let sharpTmp = await sharp(svgString)
                        sharpTmp
                            .resize(2000)

                        if (background) sharpImg
                            .flatten({ background })

                        sharpImg
                            .png()
                            .toBuffer();

                        const encodedImage = await terminalImage.buffer(buffer);

                        console.log(encodedImage);

                        console.log(getName(icon));
                    }
                }
            } else {
                if (list) {
                    const list = await listIcons({ cwd: process.cwd(), fontName })

                    if (!list) {
                        throw new Error(`Font with name ${fontName} was not found.`);
                    }

                    list.forEach((item, i) => console.log(i, item));
                } else {
                    const font = searchFonts({ cwd: process.cwd(), fontName })

                    if (!font) {
                        throw new Error(`Font with name ${fontName} was not found.`);
                    }

                    printFont(font);
                }
            }
        } else {
            if (list) {
                listFonts()
            } else {
                console.error('No arguments or options specified.');
                process.exit(1);
            }
        }
    } catch (err) {
        console.error(lodash.get(err, 'message', err));
        process.exit(1);
    }
}
