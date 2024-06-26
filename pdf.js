const PDFDocument = require('pdfkit');
const fs = require('fs');

function createPDF() {
    // Crear un documento PDF
    const doc = new PDFDocument();

    // Guardar el PDF en el sistema de archivos
    doc.pipe(fs.createWriteStream('example.pdf'));

    // Agregar texto
    doc.fontSize(18).text('Hello, PDF!', 20, 20);

    // Agregar una imagen (asegúrate de tener una imagen llamada 'exampleImage.png' en el mismo directorio)
    //doc.image('exampleImage.png', 20, 80, { width: 100, height: 100 });

    // Agregar líneas
    doc.moveTo(20, 200).lineTo(500, 200).lineWidth(1).strokeColor('red').stroke();
    doc.moveTo(20, 220).lineTo(500, 220).lineWidth(5).strokeColor('blue').stroke();

    // Agregar una tabla
    const tableTop = 240;
    const cellHeight = 40;
    const numberOfColumns = 3;
    const numberOfRows = 5;
    const cellWidth = (doc.page.width - 40) / numberOfColumns;

    doc.strokeColor('black');
    for (let i = 0; i <= numberOfRows; i++) {
        for (let j = 0; j <= numberOfColumns; j++) {
            const x = 20 + j * cellWidth;
            const y = tableTop + i * cellHeight;
            doc.rect(x, y, cellWidth, cellHeight).stroke();
            if (i < numberOfRows && j < numberOfColumns) {
                doc.fontSize(12).text(`R${i + 1}C${j + 1}`, x + 10, y + 10);
            }
        }
    }

    // Finalizar el documento
    doc.end();
}

createPDF();
