// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://zumarongi.github.io/",
  integrations: [
    react(),
    starlight({
      logo: { src: "/src/assets/logo/classic.png", replacesTitle: true },
      title: "Ignoramuz",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Zumarongi/",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          // items: [
          // 	// Each item here is one entry in the navigation menu.
          // 	{ label: 'Example Guide', slug: 'guides/example' },
          // ],
          autogenerate: { directory: "guides" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
