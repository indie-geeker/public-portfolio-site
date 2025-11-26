<a href="/README.md" style="margin-bottom:16px">中文说明</a>

# Designer Portfolio Site - Astro.js

### Site Preview

Rico's Blog:  <a href="https://blog.ricocc.com/" target="_blank">blog.ricocc.com</a>

Repository: <a href="https://github.com/ricocc/public-portfolio-site" target="_blank">github.com/ricocc/public-portfolio-site</a>


<img src="public/preview01.jpg" alt="Blog Preview" width="640" height="auto" style="display:inline-block;margin:12px;">

---

### Tech Stack

- Astro.js 5.7.5
- Sass 1.79.4
- TypeScript 5.6.2

---

### Font Selection

Chinese Title Font: HuiWen Mincho <a href="https://tieba.baidu.com/p/7193815211" target="_blank">Official Link</a>

Body Font: Noto Sans SC <a href="https://fonts.google.com/noto/specimen/Noto+Sans+SC?query=Noto+sans+sc" target="_blank">Google Font</a>

English Font: Special Elite <a href="https://fonts.google.com/specimen/Special+Elite" target="_blank">Google Font</a>

Due to the large file size of Chinese fonts, I chose to embed titles as SVG format. You can download the fonts yourself and convert them to replace the existing ones.

---

### Basic Usage Instructions

#### Website Main Information Data
The main website information is concentrated in `src/data/`. You can modify these files to customize your website:
- `content.ts`: Basic website information, including contact details, navigation, TDK, etc.
- `project.ts`: Project information, mainly displayed in the project list. However, detailed project pages need to be created manually
- `home.json`: Portfolio list displayed on the homepage, with various optional content information

For the About page, you need to manually add your personal introduction. For blog content, just add markdown files in the `content/blog/*` folder following the fixed format, and the blog list will automatically add titles and paths.

The main website information is stored in `src/data/content.ts`
Modify the corresponding data as needed
Some parts need to be modified manually in the pages

#### Environment Variables Configuration
The `.env` file is used to set environment variables for the application. You can copy the contents from `.env.example` to `.env` and fill in the required values. Note that the `.env` file should not be committed to version control, and Git will automatically ignore it.

In the `.env` file, you can set the following variables:

- `PUBLIC_SITE_URL`: The public URL of the site.
- `PUBLIC_SITE_NAME`: The name of the site.
- `PUBLIC_GA4_ID`: (Not required) Google Analytics 4 ID.
- `PUBLIC_UMAMI_ID`: (Not required) Umami ID.

**Google Analytics 和 Umami 分析**
- https://analytics.google.com/
- https://umami.is/

Ensure these variables are correctly set in both local development and production environments for proper application functionality.



#### Project Showcase on Index Page
Project data is stored in
`src/data/home.json`

```typescript
[
	{
		"id": "1",
		"cover": "/assets/cover/cover-todo.jpg",
		"title": "Web Todo List",
		"desc": "An excellent, clean-designed web version of Todolist",
		"url": "https://todo.uiineed.com/",
		"detail": "/detail/todo",
		"category": "web",
		"tag": "Web",
		"date": "2023-07-05",
		"mark": true,
	},
]

```

```Typescript
		"id" // Project ID (optional)
		"title"  // Project name (required)
		"cover"  // Project cover image (optional)
		"desc" // Project description (optional)
		"url" /// Project URL (optional)
		"detail" // Project detail page path (optional)
		"category" // Project category (optional, defaults to "other" if empty)
		"tag" // Project tag (optional, but recommended)
		"date" // Project creation date (optional)
		"mark" // Whether to display recommendation tag (optional, defaults to false)
```

#### Project List

Projects `/project`

```typescript
export interface ProjectItem {
	id?: number; // Unique identifier
	title: string // Project name
	title_en?: string // English project name
	description?: string  // Project description
	date?: string        // Publication date
	detail?: string // Detailed page path
  url?: string  // Live link
	tags?: string[] // Tags
	cover?: string[] // Cover images
}
```

#### Project Details
Specific project content needs new *.astro pages, manually created and stored in src/pages/detail/. The URL should be filled in the detail property in project.json. If not filled, the homepage project won't have a link.

`src/pages/detail/`

---

### 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│   ├── images/
│   ├── logo.svg
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── assets/
│   │   └── *Layout.astro*
│   ├── components/
│   │   ├── *
│   ├── layouts/
│   │   └── Layout.astro
│   ├── content/
│   │   └── *
│   ├── data/
│   │   ├── content.ts
│   │   ├── project.ts
│   │   └── home.json
│   ├── effets/
│   │   └── *.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── index.astro
│       ├── about.astro
│       ├── project.astro
│       ├── blog.astro
│       └── 404.astro
├── package.json
```

---

### 🧞 Commands

All commands are run from the root of the project, from a terminal:

Yarn Command:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `yarn install`         | Installs dependencies                            |
| `yarn dev`             | Starts local dev server at `localhost:4321`      |
| `yarn build`           | Build your production site to `./dist/`          |
| `yarn preview`         | Preview your build locally, before deploying     |
| `yarn astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `yarn astro --help`    | Get help using the Astro CLI                     |

---

### Roadmap

- **2025/04/28:** Added effects open-source need3d Abstraction series icons, available at [need3d.ru](https://need3d.ru/). The author is [@ilyarygin](https://www.instagram.com/ilyarygin).

- **2025/04/28:** Update version to `Astro.js 5.7.5`; Added .env.example file for configuring site information, with optional defaults for Google Analytics 4 and Umami IDs.

### Author

I'm Rico, a Web/UI designer currently focusing on web visual development. <a href="https://blog.ricocc.com/" target="_blank">Rico's Blog</a> - Here you can learn about some of my works or read my articles and notes.  Focus update on Twitter [@ricouii](https://x.com/ricouii).


#### Other Project
- 💡 Website Inspiration <a href="https://inspoweb.com/" target="_blank">InspoWeb.com</a>
- 🎉 UIUX UI/UX Tools & Resources <a href="https://uiuxdeck.com/" target="_blank"> UIUXDECK.com</a>
- 🎨 Free Gradients <a href="http://gradientshub.com/" target="_blank">GradientsHub</a>
- ✔️ Todo List <a href="https://github.com/ricocc/uiineed-todo-list/" target="_blank">Github</a>

