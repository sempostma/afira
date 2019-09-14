const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const Color = require('color');

module.exports = async ({ cwd, img, color, output}) => {
    const filepath = path.resolve(cwd, img);
    const sharpImg = sharp(filepath)
    const metadata = await sharpImg.metadata();
    metadata.background = Buffer.from(
        Color(color).rgb()
            .array()
    );
    const metaDataBuffer = await sharp({create: metadata})
        .png()
        .toBuffer();
    const tintedImage = await sharp(await sharpImg
        .negate()
        .threshold(255)
        
        .png()
        .toBuffer()
    )
        .boolean(metaDataBuffer, `and`)
        .negate()
        .png()
        .toBuffer();

    const outputFilename = path.resolve(cwd, output);
    await fs.writeFile(outputFilename, tintedImage);
};
