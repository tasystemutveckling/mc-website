// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
	// Ersätter WordPress-sajten på sikt. DNS hos one.com, hostas på GitHub Pages.
	// Före DNS-cutover serveras sajten som projekt-sajt under /mc-website/.
	// Vid cutover: byt site till 'https://tasystemutveckling.se', ta bort base
	// och lägg till public/CNAME (se CLAUDE.md, DNS-cutover-punkten).
	site: 'https://tasystemutveckling.github.io',
	base: '/mc-website',
	// LaTeX-matematik: $…$ (inline) och $$…$$ (block), renderas med KaTeX.
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	},
	integrations: [
		starlight({
			title: 'Electric Motorcycle Project',
			// KaTeX-stilmall för matematik (npm-modulspecifierare).
			customCss: ['katex/dist/katex.min.css'],
			// Sajtens innehåll är på engelska (CLAUDE.md/intern dok är på svenska).
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
			},
			// TODO: peka mot rätt GitHub-repo när det är skapat.
			// social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/<org>/mc-website' }],
			plugins: [
				starlightBlog({
					title: 'Build Log',
					prefix: 'blog', // inlägg i src/content/docs/blog/, URL /blog
					navigation: 'none', // länkas i vänstermenyn (sidebar) i stället för headern
					authors: {
						tobias: { name: 'Tobias' },
					},
					metrics: { readingTime: true },
				}),
			],
			sidebar: [
				{ label: 'Overview', link: '/' },
				{ label: 'Build Log', link: '/blog/' },
				{
					label: 'Documentation',
					items: [
						{
							label: 'Inverter',
							items: [
								{ label: 'Overview', slug: 'inverter/overview' },
								{ label: 'Design', slug: 'inverter/design' },
							],
						},
						{ label: 'Motor', slug: 'motor/overview' },
						{
							label: 'Battery',
							items: [
								{ label: 'Overview', slug: 'battery/overview' },
								{ label: 'Junction box', slug: 'battery/junction-box' },
							],
						},
						{ label: 'Chassis', slug: 'chassis/frame' },
					],
				},
			],
		}),
	],
});
