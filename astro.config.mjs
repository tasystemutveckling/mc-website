// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
	// Hostas på GitHub Pages, serveras på apex tasystemutveckling.se (custom-domän via public/CNAME).
	// DNS hos one.com: fyra A + fyra AAAA på apex mot GitHub Pages, samt CNAME www -> tasystemutveckling.github.io.
	// E-postens MX-poster lämnas orörda. Gamla WordPress ligger kvar på one.com men nås inte via domänen.
	site: 'https://tasystemutveckling.se',
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
								{ label: 'POC', slug: 'inverter/poc' },
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
