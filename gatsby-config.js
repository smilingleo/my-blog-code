module.exports = {
  pathPrefix: `/`,
  siteMetadata: {
    title: `Smilingleo's Blog`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src`
      }
    }
  ],
}
