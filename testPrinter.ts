const escpos = require('escpos');
escpos.USB = require('escpos-usb');

// Buscar y listar las impresoras conectadas a tu PC
const devices = escpos.USB.findPrinter();

if (devices.length === 0) {
  console.log('No se encontraron impresoras conectadas.');
} else {
  console.log('Impresoras encontradas:', devices);

  // Probar la primera impresora encontrada
  const device = new escpos.USB(devices[0]);
  const printer = new escpos.Printer(device);

  device.open((error: Error | null) => {  // Especificamos el tipo de 'error' como Error o null
    if (error) {
      console.error("Error al abrir el dispositivo:", error);
      return;
    }

    printer
      .align('CT')
      .style('B')
      .size(1, 1)
      .text('Prueba de Impresora ESC/POS')
      .text('¡Este es un test de impresión!')
      .cut()
      .close();
  });
}
