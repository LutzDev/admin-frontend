# Admin panel

The admin panel is used to manage interventions. Currently, projects, dialogs and variables can be managed.
The admin panel was implemented with the frontend framework Vue3. The template Vitesse is used as a starting point.

**Vitesse:** https://github.com/antfu/vitesse

## Requirements

The admin panel requires the following to run:

- [VS Code](https://code.visualstudio.com) for Code editing
- [Node](https://nodejs.org/en/) as JavaScript runtime environment

Optional:

- [Postman app](https://www.postman.com/downloads/) to test API-Endpoints is recommended

## Usage

To ensure communication between the services, the addresses (host+port) must be adapted.

### Development

Just run and visit http://localhost:4000

```bash
pnpm dev
```

### Build

To build the App, run

```bash
pnpm build
```

<br>

### Docker Production Build

First, build the vitesse image by opening the terminal in the project's root directory.

```bash
docker buildx build . -t vitesse:latest
```

Run the image and specify port mapping with the `-p` flag.

```bash
docker run --rm -it -p 8080:80 vitesse:latest
```

<br>

## Component library

Element Plus was used as the component library because it fully supports Vue3.

**Documentation:** https://element-plus.org/en-US/


## Specification file for Inky

The file enables custom snippets for a project, if the file is copied to the root folder of a inky project.
The file is located at ``Inky > template.settings.json``

<br>

## Plugins

The template vitesse comes with some plugins:

- [Vue Router](https://github.com/vuejs/vue-router)
  - [`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages) - file system based routing
  - [`vite-plugin-vue-layouts`](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) - layouts for pages
- [Pinia](https://pinia.esm.dev) - Intuitive, type safe, light and flexible Store for Vue using the composition api
- [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) - components auto import
- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - Directly use Vue Composition API and others without importing
- [`vite-plugin-pwa`](https://github.com/antfu/vite-plugin-pwa) - PWA
- [`vite-plugin-vue-markdown`](https://github.com/antfu/vite-plugin-vue-markdown) - Markdown as components / components in Markdown
  - [`markdown-it-prism`](https://github.com/jGleitz/markdown-it-prism) - [Prism](https://prismjs.com/) for syntax highlighting
  - [`prism-theme-vars`](https://github.com/antfu/prism-theme-vars) - customizable Prism.js theme using CSS variables
- [Vue I18n](https://github.com/intlify/vue-i18n-next) - Internationalization
  - [`vite-plugin-vue-i18n`](https://github.com/intlify/vite-plugin-vue-i18n) - Vite plugin for Vue I18n
- [VueUse](https://github.com/antfu/vueuse) - collection of useful composition APIs
- [`vite-ssg-sitemap`](https://github.com/jbaubree/vite-ssg-sitemap) - Sitemap generator
- [`@vueuse/head`](https://github.com/vueuse/head) - manipulate document head reactively
