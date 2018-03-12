const React = require('react');
const ReactDisqusThread = require('react-disqus-thread');

class Comments extends React.Component{

    constructor(props) {
        super(props);
    }
	
	handleNewComment (comment) {
        // one possible is to send slack notification, but slack webhook stops supporting CORS.
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