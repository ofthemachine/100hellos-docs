const path = require('path')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const parent = getNode(node.parent)
    createNodeField({
      node,
      name: 'sourceInstanceName',
      value: parent.sourceInstanceName,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { fields: { sourceInstanceName: { eq: "languages" } } }
      ) {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const languageTemplate = path.resolve('./src/templates/language.js')

  result.data.allMarkdownRemark.nodes.forEach(node => {
    createPage({
      path: `/languages/${node.frontmatter.slug}`,
      component: languageTemplate,
      context: {
        slug: node.frontmatter.slug,
      },
    })
  })
}
