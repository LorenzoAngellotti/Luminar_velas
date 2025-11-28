export function calcularEnvio(codigoPostal: string, pesoTotal: number) {
  const cp = parseInt(codigoPostal);

  // Ejemplo de zonas:
  if (cp >= 1000 && cp <= 1499) {
    return 1500; // CABA
  }
  if (cp >= 1600 && cp <= 1899) {
    return 2000; // AMBA Norte
  }
  if (cp >= 1900 && cp <= 1999) {
    return 2200; // AMBA Sur
  }

  // Restos de Argentina
  if (cp >= 2000 && cp <= 9999) {
    return 3000;
  }

  // CP inválido
  return null;
}
