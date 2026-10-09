// Utilidades de fecha y dinero que usan varias pantallas.
// Las fechas viajan como texto 'AAAA-MM-DD', igual que las envía el backend.

// Convierte un Date en 'AAAA-MM-DD' usando la hora LOCAL (no UTC)
export function fechaComoTexto(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export function hoyComoTexto(): string {
  return fechaComoTexto(new Date());
}

// Suma (o resta, si dias es negativo) días a una fecha en texto
export function sumarDias(fechaTexto: string, dias: number): string {
  const [anio, mes, dia] = fechaTexto.split('-').map(Number);
  return fechaComoTexto(new Date(anio, mes - 1, dia + dias));
}

// '2026-10-08' -> 'jueves, 8 de octubre'
export function fechaLarga(fechaTexto: string): string {
  const [anio, mes, dia] = fechaTexto.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date(anio, mes - 1, dia));
}

const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

export function pesos(valor: number): string {
  return formatoPesos.format(valor);
}