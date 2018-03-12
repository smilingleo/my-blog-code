import React from 'react'
import Link from 'gatsby-link'
import PaginateLink from './paginateLink'

const formatDate = (dateStr) => {
  const date = new Date(Date.parse(dateStr));
  return `${date.toLocaleDateString()}  ${date.toLocaleTimeString()}`;
}

const IndexPage = ({ data, pathContext }) => {
  // for pagination
  const { group, index, first, last } = pathContext;
  const prevUrl = index - 1 == 1 ? "" : (index - 1).toString();
  const nextUrl = (index + 1).toString();
  const total = data.allMarkdownRemark.edges.length;

  const { edges: posts } = data.allMarkdownRemark
  return (
    <div>
      <div className="posts">
      {group.map(({ node: post }, pIdx) => {
        const { frontmatter } = post
        console.log(Date.parse(frontmatter.date));
        return (
          <div key={`post_${pIdx}`}>
            <h2>
              <Link to={frontmatter.path}>{frontmatter.title}</Link>
            </h2>
            <p>{formatDate(frontmatter.date)}</p>
            <p>{frontmatter.excerpt}</p>
            <ul>
              {post.frontmatter.tags.map((tag, tagIdx) => {
                return (
                  <li key={`tag_${pIdx}_${tagIdx}`}>
                    <Link to={`/tags/${tag}`}>{tag}</Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
      </div>
      <div className="paginatation">
        <div className="prevLink">
            <PaginateLink tag={ first } url={ prevUrl } text="Prev Page" />
        </div>

        <p>{index} of { Math.ceil(total/12)}</p>

        <div className="nextLink">
            <PaginateLink tag={ last } url={ nextUrl } text="Next Page" />
        </div>
      </div>      
    </div>
  )
}

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
            tags
            excerpt
          }
        }
      }
    }
  }
`

export default IndexPage
