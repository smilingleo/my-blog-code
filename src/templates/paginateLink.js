import React from 'react'
import Link from 'gatsby-link'

const PaginateLink = ({ tag, url, text }) => {
    if (!tag) {
        return <span><Link to={ url }>{ text }</Link></span>
    } else {
        return <span>{ text }</span>
    }
}

export default PaginateLink