const fs = require('fs')
const readline = require('readline')

async function processLineByLine(fileToProcess, outputFile) {
    if(fs.existsSync(outputFile)) {
        fs.rm(outputFile, (err) => {
            if(err) {
                console.log(err)
            }
            console.log('File Removed')
        })
    }
    const fileStream = fs.createReadStream(fileToProcess)

    const r1 = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    var buildString = "objectID,food_type,stars_count,reviews_count,neighborhood,phone_number,price_range,dining_style\n"
    for await (const line of r1) {
        var prepareLine = line.replace(/,/g, ' ')
        var changedLine = prepareLine.replace(/;/g, ',')
        if(!changedLine.includes("objectID")) {
            buildString += changedLine + "\n"
        }    
    }
    fs.appendFile(outputFile, buildString, (err) => {
        if(err) {
            console.log(err)
        }
        else {
            console.log("Line Appended")
        }
    })
}
module.exports = processLineByLine
