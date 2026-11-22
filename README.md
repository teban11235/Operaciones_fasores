# Calculadora de Fasores Interactiva

Aplicación web interactiva desarrollada con **React**, **TypeScript**, **Tailwind CSS** y **Vite** para realizar operaciones fundamentales con fasores (suma, resta, multiplicación, división y rotación mediante el operador $j$) con representación gráfica en el plano complejo y explicación paso a paso.

## Características

- **Operaciones Fasoriales**:
  - **Suma y Resta**: Conversión automática a forma rectangular ($x + jy$) para operar partes reales e imaginarias.
  - **Multiplicación y División**: Operación directa en forma polar ($M \angle \theta^\circ$).
- **Representación Gráfica (`<canvas>`)**: Visualización interactiva con autoescalado en el plano complejo ($\text{Re}$ vs $\text{Im}$) de $\mathbf{V}_1$, $\mathbf{V}_2$ y el fasor resultante.
- **Procedimiento Matemático Detallado**: Desglose paso a paso de las conversiones y cálculos realizados.
- **Operador $j$**: Rotación rápida de $+90^\circ$ ($\times j$) y $-90^\circ$ ($\times -j$).

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- `npm` (incluido con Node.js)

## Ejecución en Local

1. Instalar las dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir en el navegador la URL indicada en la terminal (por defecto `http://localhost:5173`).

## Compilación para Producción

Para generar los archivos optimizados en la carpeta `dist/`:

```bash
npm run build
```

Para previsualizar la compilación de producción localmente:

```bash
npm run preview
```
