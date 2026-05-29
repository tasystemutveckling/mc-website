// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';

// https://astro.build/config
export default defineConfig({
	// Ersätter WordPress-sajten på sikt. DNS hos one.com, hostas på GitHub Pages.
	site: 'https://tasystemutveckling.se',
	integrations: [
		starlight({
			title: 'Electric Motorcycle Project',
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
						{ label: 'Inverter', slug: 'inverter/overview' },
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
