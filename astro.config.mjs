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
			title: 'Elmotorcykelprojektet',
			// Sajten och allt innehåll är på svenska.
			defaultLocale: 'root',
			locales: {
				root: { label: 'Svenska', lang: 'sv' },
			},
			// TODO: peka mot rätt GitHub-repo när det är skapat.
			// social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/<org>/mc-website' }],
			plugins: [
				starlightBlog({
					title: 'Byggdagbok',
					prefix: 'byggdagbok', // inlägg i src/content/docs/byggdagbok/, URL /byggdagbok
					authors: {
						tobias: { name: 'Tobias' },
					},
					metrics: { readingTime: true },
				}),
			],
			sidebar: [
				{
					label: 'Inverter',
					items: [{ label: 'Översikt', slug: 'inverter/oversikt' }],
				},
				{
					label: 'Motor',
					items: [{ label: 'Översikt', slug: 'motor/oversikt' }],
				},
				{
					label: 'Batteri',
					items: [
						{ label: 'Översikt', slug: 'batteri/oversikt' },
						{ label: 'Kopplingsbox', slug: 'batteri/kopplingsbox' },
					],
				},
				{
					label: 'Chassi',
					items: [{ label: 'Ram', slug: 'chassi/ram' }],
				},
			],
		}),
	],
});
