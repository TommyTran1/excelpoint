var React       = require('../../lib/react-with-addons');
var PagerBox = require('../PagerBox/PagerBox');
var DrupalMixin = require('../../mixins/DrupalMixin');
var CommentList = require('./CommentList.jsx');
var CommentForm = require('./CommentForm.jsx');

/**
 * CommentBox
 */
var CommentBox = React.createClass({
  // Mixins
  mixins: [DrupalMixin],
  // React hook initialize state.
  getInitialState: function() {
    return {
      comments: [],
      user: {},
      updatedPid: false,
      pager: {
        total:        null,
        current:      1,
        visiblePages: 3
      }
    };
  },
  // Internal, fetch data from the server and populate state on success 
  // (that will trigger a render)
  getElements: function(selected) {
    var page = selected || this.state.pager.current;
    jQuery.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'GET',
      data: {
        'page': page - 1,
      },
      success: function(data) {
        data.updatedPid = false;
        this.replaceState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // React hook: the component has been rendered. Called once on init.
  // Set the poll interval and call getElements.
  componentDidMount: function() {
    this.getElements();
    setInterval(this.getElements, this.props.pollInterval);
  },
  // General Handler for a comment submission (new or reply).
  // Post the data to the server.
  handleCommentSubmit: function(comment) {
    jQuery.ajax({
      url: this.props.postUrl,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {        
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    
    if (this.state.user.postWithoutApprovalAccess == 1) { 
      if (!comment.id) {
        comment.id = 'tmp' + comment.pid;
        comment.date = this.Drupal.t('now');
        comment.status = 1;
        comment['new'] = 1;
        comment.tmp = 1;
      }
      if (!comment['authorURL'] && this.state.user['url']) {
        comment.authorURL = this.state.user.url;
      }
      this.mergeNewCommentInState(comment);
    }
  },
  mergeNewCommentInState: function(comment) {
    var newComments = this._mergeCommentsRecursive(this.state.comments, comment, 0);
    data = this.state;
    data.comments = newComments;
    this.replaceState(data);
  },
  _mergeCommentsRecursive(comments, comment, pid) {
    if (!comment.pid) {
      comments.push(comment);
      return comments;
    }
    var newComments = [];
    for (var key in comments) {
      newComments[key] = comments[key];
      if (comments[key]['childrens']) {
        newComments[key]['childrens'] = this._mergeCommentsRecursive(comments[key]['childrens'], comment, comments[key]['id']);
      }
    }
    if (comment.pid == pid) {
      newComments.push(comment);
    }
    
    return newComments;
  },
  handlePageChanged: function(data) {
    this.setState({pager: { current : data.selected }});
    this.getElements(data.selected);
  },
  render: function() {
    var commentBoxStyle = {
      maxWidth: '990px',
      margin: '0 auto 20px'
    };

    return (
      <div style={commentBoxStyle} className="comments-wrapper">
        <h2>{this.Drupal.t('Comments')}</h2>
        <CommentList user={this.state.user} onCommentSubmit={this.handleCommentSubmit} comments={this.state.comments} />
        {this.state['pager'] && this.state.pager['total'] > 1 ?
        <nav>
          <PagerBox clickCallback={this.handlePageChanged} selected={this.state.pager.current} pageNum={this.state.pager.total} />
       </nav>
        :null}
        {this.state.user.postAccess == 1 ?
          <CommentForm ref="comment_form" user={this.state.user} onCommentSubmit={this.handleCommentSubmit} />
        : null}
      </div>
    );
  }
});
  

module.exports = CommentBox;