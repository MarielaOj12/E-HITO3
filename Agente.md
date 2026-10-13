# Agente de IA — E-HITO3, iPortfolio

## Rol
Actúa como especialista en Angular, TypeScript, Bootstrap 5, HTML y CSS. Lee la estructura actual del proyecto antes de modificar cualquier archivo.

## Objetivo
Mantener un portafolio personal multimedia con **la interfaz original iPortfolio** de BootstrapMade: menú lateral oscuro, retrato de portada, foto circular, tipografía, colores y animaciones. No rediseñar el sitio ni cambiar la identidad visual.

## Tecnologías
- **Frontend:** Angular 22 (componentes standalone), TypeScript, Bootstrap 5 y CSS.
- **Datos:** un solo archivo `public/data/cv.json` servido por Angular con `HttpClient`.
- **Herramientas de IA:** ChatGPT y GitHub Copilot para apoyar el desarrollo.
- **Publicación:** repositorio GitHub con compilación para GitHub Pages.
- **Sin PHP, XAMPP ni MariaDB.**

## Secciones obligatorias
1. **Inicio**: fotografía personal y presentación con animación de texto.
2. **Acerca de**: foto, descripción y formación básica.
3. **Habilidades**: tecnologías y barras de habilidades desde JSON.
4. **Currículum**: resumen, educación y experiencia académica desde JSON.
5. **Contacto**: ubicación, enlaces públicos autorizados y formulario de preparación de correo.

## Datos y fotografías
- La fuente única de textos editables, imágenes, enlaces, navegación y currículum es `public/data/cv.json`.
- Las imágenes viven en `public/assets/img/`. La foto del perfil es `Ruth.jpeg` y la portada es `portada-personal.jpg`.
- No inventar datos personales, números telefónicos, correos, redes sociales ni experiencia laboral.
- Si no existe un correo válido en el JSON, el formulario debe mostrar que no puede enviar nada. No simular envíos ni registros persistidos.

## Estructura de trabajo
- `src/app/core/portfolio.model.ts`: contratos de datos.
- `src/app/core/cv.service.ts`: lectura de JSON con HttpClient.
- `src/app/app.component.ts`: estado, navegación y formulario.
- `src/app/app.component.html`: estructura visual y bucles `@for`.
- `src/index.html`: carga de Bootstrap y estilos.
- `public/assets/css/main.css`: estilos **originales, sin sobrescribir**.
- `public/assets/css/hito3.css`: ajustes puntuales de contraste y responsive.

## Instrucciones para GitHub Copilot

1. `@workspace Lee Agente.md y explica cómo se organizan Angular, Bootstrap y cv.json sin editar archivos.`
2. `@workspace Revisa que Inicio, Acerca de, Habilidades, Currículum y Contacto obtengan todo su contenido desde cv.json.`
3. `@workspace Comprueba la versión móvil y las imágenes sin alterar public/assets/css/main.css.`
4. `@workspace Ejecuta npm run build, corrige errores y conserva la estructura actual.`
5. `@workspace Verifica el workflow de GitHub Pages y el base-href del repositorio.`

## Criterios de aceptación
- `npm.cmd install` y `npm.cmd start` permiten levantar el frontend en `localhost:4200`.
- `data/cv.json` permite cambiar textos, estudios, habilidades y contactos sin tocar el HTML.
- El diseño mantiene la apariencia de iPortfolio y las fotografías personales.
- No se incluyen bases de datos, credenciales privadas ni el directorio `node_modules` en el ZIP.
- El código fuente conserva formato legible, separación de responsabilidades y créditos de la plantilla.
