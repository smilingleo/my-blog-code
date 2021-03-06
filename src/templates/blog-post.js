import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import Comments from './comments'

class Template extends React.Component {
  constructor(props) {
    super(props)
  }

  /*
  * Once the blog page is loaded, run init() to prettyprint the code.
  */
  componentDidMount() {
    init()
  }

  render() {
    const { markdownRemark: post } = this.props.data
    const { frontmatter, html } = post
    const { title, date } = frontmatter
    const { next, prev } = this.props.pathContext

    return (
      <div>
        <Helmet title={`${frontmatter.title} - My Blog`} />

        <div>
          <h1>{title}</h1>
          <h3>{date}</h3>

          <div dangerouslySetInnerHTML={{ __html: html }} />

          <hr />
          <p>
            {prev && (
              <Link to={prev.frontmatter.path}>
                Prev: {prev.frontmatter.title}
              </Link>
            )}
          </p>
          <p>
            {next && (
              <Link to={next.frontmatter.path}>
                Next: {next.frontmatter.title}
              </Link>
            )}
          </p>
        </div>
        <hr />
        <Comments title={title} path={frontmatter.path} />
      </div>
    )
  }
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        path
        tags
        excerpt
      }
    }
  }
`

export default Template
