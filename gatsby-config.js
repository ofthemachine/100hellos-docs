module.exports = {
  pathPrefix: '/100hellos-docs',
  siteMetadata: {
    title: '100 Hellos',
    description: 'A showcase of ~100 programming languages with containerized execution environments',
    siteUrl: 'https://ofthemachine.github.io/100hellos-docs',
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'languages',
        path: `${__dirname}/src/content/languages`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/`,
        ignore: [
          '**/node_modules/**',
          '**/src/**',
          '**/public/**',
          '**/.cache/**',
          '**/static/**',
          '**/scripts/**',
        ],
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              noInlineHighlight: false,
            },
          },
          'gatsby-remark-autolink-headers',
        ],
      },
    },
    'gatsby-transformer-yaml',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: '100 Hellos',
        short_name: '100Hellos',
        start_url: '/100hellos-docs/',
        background_color: '#0a0a0a',
        theme_color: '#00ff88',
        display: 'minimal-ui',
        icon: 'static/favicon.svg',
      },
    },
  ],
}
