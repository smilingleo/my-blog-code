---
path: "/2018/support-pagination-for-gatsby-blog"
date: "2018-03-12T11:31:26.000+08"
title: "为Gatsby博客添加分页功能"
tags: ['blog', 'gatsby']
excerpt: "根据Egghead上的教程，做出的博客站点有个缺陷，那就是没有分页功能，对于勤奋的博主来说，在一个页面上显示所有文章列表有点不完美，这里我们改造一下，加入分页功能。"
---

根据Egghead上的教程，做出的博客站点有个缺陷，那就是没有分页功能，对于勤奋的博主来说，在一个页面上显示所有文章列表有点不完美，这里我们改造一下，加入分页功能。

## 步骤

1. 引入`gatsby-paginate`组件

```bash
yarn add gatsby-paginate
```

2. 增加一个分页链接组件

<!-- language: lang-js -->
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

3. `mv pages/index.js templates/` 然后编辑

<!-- language: lang-js -->
    import React from 'react'
    import Link from 'gatsby-link'
    +import PaginateLink from './paginateLink'
    +
    +const IndexPage = ({ data, pathContext }) => {
    +  // for pagination
    +  const { group, index, first, last } = pathContext;
    +  const prevUrl = index - 1 == 1 ? "" : (index - 1).toString();
    +  const nextUrl = (index + 1).toString();
    +  const total = data.allMarkdownRemark.edges.length;
    
    -const IndexPage = ({ data }) => {
    const { edges: posts } = data.allMarkdownRemark
    return (
        <div>
    -      {posts.map(({ node: post }, pIdx) => {
    +      <div className="posts">
    +      {group.map(({ node: post }, pIdx) => {
            const { frontmatter } = post
    -        
    +
            return (
            <div key={`post_${pIdx}`}>
                <h2>
    @@ -27,6 +35,18 @@ const IndexPage = ({ data }) => {
            </div>
            )
        })}
    +      </div>
    +      <div className="paginatation">
    +        <div className="prevLink">
    +            <PaginateLink tag={ first } url={ prevUrl } text="Prev Page" />
    +        </div>
    +
    +        <p>{index} of { Math.ceil(total/12)}</p>
    +
    +        <div className="nextLink">
    +            <PaginateLink tag={ last } url={ nextUrl } text="Next Page" />
    +        </div>
    +      </div>      
        </div>
    )
    }

4. 编辑`gatsby-node.js`

<!-- language: lang-js -->
    +const pagination = require('gatsby-paginate');

    const createTagPages = (createPage, posts) => {
    const tagPageTemplate = path.resolve(`src/templates/tags.js`)
    @@ -72,6 +73,15 @@ exports.createPages = ({ boundActionCreators, graphql }) => {
    
        createTagPages(createPage, posts)
    
    +      // default pagination to 10.
    +      pagination({
    +        edges: posts,
    +        createPage: createPage,
    +        pageTemplate: "src/templates/index.js",
    +        pageLength: 10
    +      });
    +
    +
        posts.forEach(({node}, index) => {
            createPage({
            path: node.frontmatter.path,


5. 编辑样式
6. 重新发布`yarn deploy`
