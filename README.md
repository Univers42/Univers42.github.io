# UNIVERS42 — Web Platform (Astro v5)

Plataforma oficial del ecosistema open-source y laboratorio de ingeniería de sistemas de **Univers42** para la comunidad de **Escuela 42**.

## 🚀 Arquitectura Tecnológica

- **Framework**: [Astro v5](https://astro.build/) (Static Site Generation - SSG)
- **Diseño**: Sistema de diseño moderno, tema oscuro profundo y componentes modulares con *glassmorphism* inspirados en la estética SaaS de Titan.
- **Interactividad**:
  - Emulador de Shell POSIX (*Hellish CLI*) con comandos (`francinette`, `torturette`, `exam`, `norminette`, etc.).
  - Directorio interactivo de repositorios con filtrado por categorías, búsqueda en tiempo real (`Ctrl + K`) y copia de comandos `git clone`.
  - Constelación de partículas en Canvas y sintetizador procedural Web Audio API.
  - Mapeo del Cursus 42 (*Rank 00* a *Rank 06* y especialización).

## 📁 Estructura del Proyecto

```text
Univers42.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Despliegue automatizado en GitHub Pages
├── data/
│   └── projects.json           # Catálogo unificado de herramientas
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CyberBackground.astro # Canvas de partículas y sintetizador de sonido
│   │   ├── Footer.astro          # Footer corporativo y enlaces
│   │   ├── Header.astro          # Navbar con glassmorphism y audio toggle
│   │   ├── Hero.astro            # Hero con orbes de gradiente y marquee técnico
│   │   ├── Manifesto.astro       # Manifiesto y pilares del builder
│   │   ├── Projects.astro        # Directorio reactivo con filtros y búsqueda
│   │   ├── Roadmap.astro         # Mapeo del Cursus 42
│   │   ├── SectionHeader.astro   # Encabezados reutilizables
│   │   ├── Spotlights.astro      # Proyectos insignia y fragmentos de código
│   │   └── Terminal.astro        # Terminal interactivo Hellish
│   ├── layouts/
│   │   └── Layout.astro          # Layout base y tokens CSS globales
│   └── pages/
│       └── index.astro           # Página principal
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local (http://localhost:4321)
npm run dev

# Compilar para producción (genera bundle estático en ./dist)
npm run build

# Previsualizar el bundle de producción localmente
npm run preview
```

## 🌐 Despliegue en GitHub Pages

El repositorio incluye el workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Cada vez que realizas un `git push` a la rama `main`, GitHub Actions compila automáticamente el sitio Astro y lo despliega en `https://univers42.github.io`.
