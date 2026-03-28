module.exports = {
  siteMetadata: {
    title: '100 Hellos',
    description: 'A showcase of ~100 programming languages with containerized execution environments',
    siteUrl: 'https://100hellos.ofthemachine.com',
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
        name: 'pages',
        path: `${__dirname}/src/content/pages`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-autolink-headers',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              noInlineHighlight: false,
            },
          },
        ],
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: '100 Hellos',
        short_name: '100Hellos',
        start_url: '/',
        background_color: '#0a0a0a',
        theme_color: '#00ff88',
        display: 'minimal-ui',
        icon: 'static/favicon.svg',
      },
    },
  ],
}
