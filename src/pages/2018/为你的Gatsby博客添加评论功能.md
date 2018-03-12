---
path: "/2018/enable-comments-for-gatsby-blog"
date: "2018-03-12T10:07:43.000+08:00"
title: "为你的Gatsby博客添加评论功能"
tags: ['blog']
excerpt: "Gatsby打造的博客已经很不错了，但是缺少一个评论功能。本文简单介绍如何集成Disqus评论服务到你的博客站点。"
---

Gatsby打造的博客已经很不错了，但是缺少一个评论功能。

本文简单介绍如何集成Disqus评论服务到你的博客站点。

## How To

首先，添加`react-disqus-thread`组件。

```
yarn add react-disqus-thread
```

之后，新建一个`Comments`的React组件。

<!-- language: lang-js -->
    const React = require('react');
    const ReactDisqusThread = require('react-disqus-thread');

    class Comments extends React.Component{

        constructor(props) {
            super(props);
        }
        
        handleNewComment (comment) {
            
        }

        render () {
            const id = `smilingleo/${window.location.pathname}`;
            return (
                <ReactDisqusThread
                    shortname="smilingleo"
                    identifier={id}
                    title={this.props.title}
                    onNewComment={this.handleNewComment}/>
            );
        }
    };

    export default Comments;

注意:

* `identifier`需要是唯一的，这里我用了`smilingleo`作为前缀，加上`pathname`。
* `onNewComment`的响应函数中，可以做一些有意思的东西，比如给你的IM发一条消息，尝试了Slack Webhook，可惜不支持CORS.

最后，在`templates/blog-post.js`文件中添加：

<!-- language: lang-html -->
    <hr />
    <Comments title={title} />

搞定.


## References
1. [React Disqus thread component](https://github.com/mzabriskie/react-disqus-thread)