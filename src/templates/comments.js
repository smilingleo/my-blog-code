const React = require('react')
const ReactDisqusThread = require('react-disqus-thread')
const { SlackAPI, MyDomain } = require('../constant');

class Comments extends React.Component {
  constructor(props) {
    super(props)
  }

  handleNewComment(comment) {
    let msg = `New comment on: ${comment.blog}\n\n${comment.text}\n\n${MyDomain}${comment.path}#comment-${comment.id}`;
    const data = {
      comment: msg
    };
    // one possible is to send slack notification, but slack webhook stops supporting CORS.
    fetch(SlackAPI, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      mode: 'cors'
    })
    .then(resp => {
      return resp.json();
    })
    .then(json => console.log(JSON.stringify(json)));
  }

  render() {
    const id = `smilingleo/${this.props.path}`;
    return (
      <ReactDisqusThread
        shortname="smilingleo"
        identifier={id}
        title={this.props.title}
        onNewComment={(comment) => {
          comment.blog = this.props.title;
          comment.path = this.props.path;
          this.handleNewComment(comment);
        }}
      />
    )
  }
}

export default Comments
