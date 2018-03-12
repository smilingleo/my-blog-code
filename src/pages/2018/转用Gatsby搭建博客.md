---
path: "/2018/blog-with-gatsby"
title: "转用Gatsby打造基于github的博客站点"
date: "2018-03-08T17:01:00.000+08:00"
tags: ['blog', 'github', 'gatsby']
excerpt: "如何用Gatsby打造一个博客"
---

## 起因

原来的博客站点基于Jekyll搭建，各种问题，感觉很不爽。后来看到Gatsby，基于ReactJS, GraphQL，都是我的最爱，于是果断投诚！

## 遇到的问题

### 和prettyprint集成的问题

原来的prettyprint机制是在页面加载的时候调用`init()`，检查DOM中的`pre.code`元素。但是转到React之后，全部是前端Routing，原来写的`window.onload = init`不工作了。每次都要手动刷新。

解决办法是在Gatsby Link元素的`onClick`事件中注册一个timer:

<!-- language: js -->
    <Link to={frontmatter.path} onClick={() => setTimeout(init, 100)}>{frontmatter.title}</Link>

这样，在点击链接打开页面之后，就会调用`init`了。

**更新：**
上面的方法更像是一个Hack，因为毕竟Link的目的只是指向一个target，不应该把不属于Link的职责(解析页面DOM并设置pre.code的style)绑定到Link上。

重新思考了一下之后，重构了`templates/blog-post.js`，原来的`Template`是一个ES6箭头函数，因为我们希望的是在页面组件都Mount之后，调用`init`，所以，我们将其修改为一个扩展`React.Component`的class.

<!-- language:lang-js -->
    class Template extends React.Component {
        constructor(props) {
            super(props);
        }
        
        /*
        * Once the blog page is loaded, run init() to prettyprint the code.
        */
        componentDidMount() {
            init();
        }

        render() {
            const { markdownRemark: post } = this.props.data
            const { frontmatter, html } = post
            const { title, date } = frontmatter
            const { next, prev } = this.props.pathContext
        
            return (
                ...
            )  
        }
    }

这样，就达到目的了。

### 发布方法

原来以为是将这些源码直接push到 `smilingleo.github.io`，后来发现不对。

需要有两个github repos，一个 `my-blog-code`, 另外一个 `smilingleo.github.io`。

新的博文写完之后，需要`yarn deploy`，这样会发布到`public/`，然后将`public`目录指向`smilingleo.github.io`这个repo。

所以，一篇博客需要提交两个git repos。

### date格式问题

原来用Jekyll的时候，date可以是`YYYY-MM-dd HH:mm:ss`的格式，但是用Gatsby必须是`YYYY-MM-dd'T'HH:mm:ss`。

## 参考资料
1. [Egghead教程](https://egghead.io/courses/build-a-blog-with-react-and-markdown-using-gatsby)
2. [React.createClass vs. ES6 arrow function](https://stackoverflow.com/questions/37170809/react-createclass-vs-es6-arrow-function/37170998#37170998)

In summary:

The short answer is that you want to use Stateless Functional Components (SFC) as often as you can; the majority of your components should be SFC's.

Use the traditional Component class when:

You need local state (`this.setState`)
You need a lifecycle hook (`componentWillMount`, `componentDidUpdate`, etc)
You need to access backing instances via refs (eg. `<div ref={elem => this.elem = elem}>`)