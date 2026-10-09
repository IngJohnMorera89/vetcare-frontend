// Lee un campo de un formulario por su atributo name, ya sin espacios sobrantes.
// Si el campo no existe o está vacío, devuelve ''.
export function leerCampo(datos: FormData, nombre: string): string {
    return String(datos.get(nombre) ?? '').trim();
  }