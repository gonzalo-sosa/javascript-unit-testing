# Testing

## ¿Cuánto testing es necesario realizar?

Las aplicaciones deben de ser probadas en algún punto,los puntos de vista de que el código no debe de ser probado o que el código debe ser probado en su totalidad son equivocados ya que cada proyecto es único y sus funcionalidades distintas, por lo que se debe de definir un grado de pruebas específico por proyecto. Es importante hallar el punto medio entre no realizar pruebas y probar todo el código debido a que no hacer pruebas lleva al proyecto a errores y costos superiores dependiendo de la etapa donde el error sea expuesto, y hacer probar todo el código es costoso por el tiempo que lleva escribir código de pruebas.

## Tipos de testing

Dependiendo del proyecto se aplicarán más tipos de pruebas que otros pero no realizar ninguno es un problema crítico.

### Unitarios

Pruebas a componentes aislados como módulos, clases, funciones, étc. Se trata de probar sólo una parte del proyecto. Este tipo de pruebas ayuda a hallar rápidamente errores en las fases iniciales del proyecto.

### Integration

Integra componentes o módulos para probarlos en conjunto, se prueba cómo los componentes anteriormente aislados trabajan en conjunto. Este tipo de pruebas son ideales para probar si el funcionamiento es el esperado al combinar distintos y comunicar módulos, y verificar si su compatibilidad es la adecuada.

### End to end

Estas pruebas simulan las iteracciones de un usuario con el sistema en su conjunto.

## Testing framework

Conjunto de herramientas para escribir y ejecutar pruebas.

1. Test Runner: ejecutar pruebas
2. Assertion Libraries: verificar si el comportamiento del código es el esperado
3. Mocking Tools: reemplazar módulos por otros 'falsos' para simular escenarios
4. Coverage Tools: analizar la cantidad de código que es probado en el proyecto

### Frameworks

- Jest
- Mocha
- Jasmine
- Vitest: soporta ESM, TypeScript y JSX
- Cypres
- Playwright

## Vitest

Se instala vitest como dependencia de desarrollo y se crea un comando en el package json para ejecutar vitest.

Instalar vitest con "npm" también puede ser pnpm.

```bash
npm i -D vitest
```

Agregar un script específico para ejecutar las pruebas.

```json
// package.json
"scripts": {
  "test": "vitest",
},
```

## Test driven development

El desarrollo del proyecto es guiado por las pruebas.

- Comenzar escribiendo código que falle una prueba
- Escribir el código mínimamente necesario para que las pruebas pasen
- Refactorizar el código de ser necesario

## Entorno gráfico

Además de contar con las consola para ver las pruebas que pasan y las que no vitest cuenta con un entorno gráfico en dónde se pueden observar las pruebas y un reporte. Esto se consigue instalando el componente "UI" de vitest.

```bash
npm i -D @vitest/ui
```

Y para ejecutarlo se agrega un comando al package json con las sentencias a ejecutar

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
}
```

## Code Coverage

Cobertura del código en producción con código de pruebas. Gracias al paquete coverage de vitest se pueden observar métricas acerca de las pruebas de un proyecto, los módulos cubiertos por pruebas y las líneas de código que están siendo respaldadas por pruebas.

## Características de buenas pruebas unitarias

- Mantenibles:
  - Nombre claro
  - Prueba una única funcionalidad
  - Son pequeñas
  - Poseen variables/constantes claras
  - Código con formato
- Robustas: resilientes al cambio de estructura del código
  - Probar la funcionalidad no la implementación
  - Evitar "tight assertions", textos exactos o errores ya que pueden cambiar a futuro
- Confiables
  - Pruebas que son confiables
  - Problemas en el código no en la prueba
  - Sin falsos positivos o negativos
  - Validar el correcto funcionamiento
  - Probar condiciones en los extremos
  - Son deterministas
  - No dependen de datos random
  - No dependen de la fecha o tiempo actual
  - No dependen de un estado global
