import React from 'react'

let stylesStr
if (process.env.NODE_ENV === `production`) {
  try {
    stylesStr = require(`!raw-loader!../public/styles.css`)
  } catch (e) {
    console.log(e)
  }
}

module.exports = class HTML extends React.Component {
  render() {
    let css
    if (process.env.NODE_ENV === `production`) {
      css = (
        <style
          id="gatsby-inlined-css"
          dangerouslySetInnerHTML={{ __html: stylesStr }}
        />
      )
    }
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          {this.props.headComponents}
          {css}

          <script
            src="/javascripts/jquery-1.9.0.min.js"
            type="text/javascript"
          />
          <script
            src="/javascripts/jquery_plantuml.js"
            type="text/javascript"
          />
          <script src="/javascripts/prettify.js" type="text/javascript" />

          <script src="/javascripts/main.js" type="text/javascript" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              var wsUri = 'ws://smilingleo.herokuapp.com/repl/byWebSocket';
              window.onload = init;
              `,
            }}
          />
        </head>
        <body {...this.props.bodyAttributes}>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}
