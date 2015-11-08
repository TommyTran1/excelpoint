var React       = require('../../lib/react-with-addons');
var DrupalMixin = require('../../mixins/DrupalMixin');
var CommentForm = require('./CommentForm.jsx');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

/**
 * CommentList
 */
var CommentList = React.createClass({
  render: function() {
    var onCommentSubmit = this.props.onCommentSubmit;
    var user = this.props.user;
    var updatedPid = this.props.updatedPid;
    var items = this.props.comments.map(function (item, i) {
      var childrens = false;
      var countChildrens = 0;
      if (item.childrens && item.childrens[0]) {
        childrens = item.childrens;
        countChildrens = item.childrens.length;
      }
      
      return (
        <CommentItemWrapper 
          key={item.key}
          item={item}
          childrens={childrens}
          countChildrens={countChildrens}
          user={user} 
          onCommentSubmit={onCommentSubmit}
        />
      );
    });
    
    return (
      <div className="comment-list">
        {items}
      </div> 
    );
  }
});


/**
 * CommentItemWrapper
 */
var CommentItemWrapper = React.createClass({
  getInitialState: function() {
    return {
      threadOpen:false,
      replyOpen:false,
      editOpen:false
    };
  },
  handlerOnToggleThread: function() {
    this.setState({threadOpen: !this.state.threadOpen});
  },
  handlerOnToggleReply: function(button) {
    this.setState({replyOpen: !this.state.replyOpen});
  },
  handlerOnToggleEdit: function(button) {
    this.setState({editOpen: !this.state.editOpen});
  },
  handlerOnDelete: function(button) {
    var comment = this.props.item;
    comment.toDelete = 1;
    comment.cid = this.props.item.id;
    this.props.onCommentSubmit(comment);
  },
  handlerOnApprove: function(button) {
    var comment = this.props.item;
    comment.toPublish = 1;
    comment.cid = this.props.item.id;
    this.props.onCommentSubmit(comment);
  },
  handlerOnSubmit: function(comment) {
    if (comment.id != this.props.item.id) {
      this.setState({threadOpen: true});
    }
    
    this.setState({replyOpen:false});
    this.setState({editOpen:false});
    this.props.onCommentSubmit(comment);
  },
  componentWillReceiveProps: function(nextProps) {
  },
  // Before rendering, states or props are received.
  componentWillUpdate: function(prevProps, prevState) {
    
  },
  // After rendering, the DOM has been updated to the new state.
  componentDidUpdate: function(prevProps, prevState) {
    if (this.state.threadOpen && !prevState.threadOpen) {}
    if ((this.state.replyOpen && !prevState.replyOpen) || 
        (this.state.editOpen && !prevState.editOpen)) {
      this.refs.commentForm.refs.body.getDOMNode().focus();
    }
  },
  render: function() {
    // Style
    var commentItemWrapperStyle = {
      margin: '10px 0',
      overflow: 'hidden'
    };
    if (this.state.threadOpen) {
      commentItemWrapperStyle.padding = '0 0 40px';
      commentItemWrapperStyle.backgroundColor = '#F';
    }
    var commentItemWrapperInnerStyle = {
      position: 'relative',
      width: '70%',
      overflow: 'hidden',
      border: '1px solid #ccc',
      float: 'left',
      backgroundColor:'#fff'
    };
    var CommentItemTextWrapperStyle = {
      padding: '10px',
      minHeight: '100px'
    };
    
    var subject_reply = 'Re: ' + this.props.item.subject;
   
    return (
      <div ref="wrapper" style={commentItemWrapperStyle} className="comment-item-wrapper">
        <CommentItemAttribution item={this.props.item} />
        <div style={commentItemWrapperInnerStyle} className="comment-item-wrapper-inner">
          
          <div style={CommentItemTextWrapperStyle} className="comment-text">
            {this.state.editOpen ?
              <CommentItem item={this.props.item} subject={this.props.item.subject} body={this.props.item.body} />
            :
              <CommentItem item={this.props.item} subject={this.props.item.subject} body={this.props.item.body} />
            }
            <CommentActionLinks>
              {this.props.user.postAccess ? 
                <CommentButtonToggleReply onToggleReply={this.handlerOnToggleReply} replyOpen={this.state.replyOpen} />
                : null}   
              {!this.props.item.status && this.props.user.moderateAccess ? 
                <CommentButtonApprove onApprove={this.handlerOnApprove} />
                : null}  
              {this.props.user.editAccess && !this.props.item['tmp'] ? 
                <CommentButtonToggleEdit onToggleEdit={this.handlerOnToggleEdit} editOpen={this.state.editOpen} />
                : null} 
              {this.props.user.deleteAccess ? 
                  <CommentButtonDelete haveChildrens={this.props.countChildrens} onDelete={this.handlerOnDelete} />
                  : null} 
              {this.props.countChildrens ?
                  <CommentButtonToggleThread ref="btnToggleThread" count={this.props.countChildrens} threadOpen={this.state.threadOpen} onToggleThread={this.handlerOnToggleThread} />
                : null}
            </CommentActionLinks>
          </div>
        </div>
        
        {this.state.replyOpen ?
          <CommentForm ref="commentForm" subject={subject_reply} user={this.props.user} pid={this.props.item.id} onCommentSubmit={this.handlerOnSubmit} />    
        : null}

        {this.state.editOpen ?
          <CommentForm ref="commentForm" user={this.props.user} editComment={this.props.item} onCommentSubmit={this.handlerOnSubmit} />    
        : null}
        
        {this.state.threadOpen && this.props.childrens[0] ?
          <CommentChildrens user={this.props.user} onCommentSubmit={this.props.onCommentSubmit} comments={this.props.childrens} />
        : null}
        
      </div>
    );
  }
});

/**
 * CommentItemAttribution
 */
var CommentItemAttribution = React.createClass({
  render: function() {
    var commentItemAuthorStyle = {
      width: '20%',
      padding: '10px',
      float: 'left'
    };
    var author = this.props.item.author;
    if (this.props.item['authorURL']) {
      author = <a href={this.props.item.authorURL}>{author}</a>;
    }
    return (
      <div style={commentItemAuthorStyle} className="attribution">
        <span className="author">{author}</span>
        <p className="comment-time">
          <span className="date">{this.props.item.date}</span>
        </p>

      </div>
    );
  }
});

/**
 * CommentItem
 */
var CommentItem = React.createClass({
  // Mixins
  mixins: [DrupalMixin],
  getInitialState: function() {
    return {};
  },
  render: function() {
    var body = this.props.body;
    
    // Style
    var commentItemStyle = {
        float: 'left',
        width: '70%'
    };
    var commentItemContentStyle = {
    };
    return (
      <div ref="wrapper" style={commentItemStyle} className="comment-item">
        <div style={commentItemContentStyle} className="comment-item-content">
          {this.props.item.new ?
            <span className="new">{this.Drupal.t('new')}</span>
            :  null
          }
          <h4 className="subject">{this.props.subject}</h4>
          <div dangerouslySetInnerHTML={{__html: body}} />
        </div>
      </div>
    );
  }
});

/**
 * CommentChildrens
 */
var CommentChildrens = React.createClass({
  render: function() {
    var commentItemChildrenStyle = {
      padding: '0 0 0 20px',
      clear: 'both'
    };
    return (
     <div style={commentItemChildrenStyle} className="comment-children">
        <CommentList {...this.props} />
     </div>
    );
  }
});

/**
 * CommentActionLinks
 */
var CommentActionLinks = React.createClass({
  render: function() {
    var commentItemActionStyle = {
      width: '25%',
      padding: '10px 0',
      float: 'right'
    };
    var ActionStyle = {
      float: 'right',
      width: '100%'
    };
    var items = this.props.children.map(function (item, i) {
      return (
          <li style={ActionStyle} key={'action_' + i}>{item}</li>
      )
    });
    return (
      <div style={commentItemActionStyle} className="comment-item-actions">
        <ul>
        {items}
        </ul>
      </div>
    );
  }
});

/**
 * CommentButtonToggleReply
 */
var CommentButtonToggleReply = React.createClass({
  // Mixins
  mixins: [DrupalMixin],
  getInitialState: function() {
    return {
      label:this.Drupal.t('reply')
    };
  },
  setLabel: function(nextProps) {
    if (nextProps.replyOpen) {
      this.setState({label: this.Drupal.t('Cancel')});
    }
    else {
      this.setState({label: this.Drupal.t('reply')});
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setLabel(nextProps);
  },
  render: function() {
    // Style
    var buttonStyle = {
      color: '#000',
      backgroundColor: '#B6ED95',
      margin: '3px 0'
    };
    if (this.props.replyOpen) {
      buttonStyle.backgroundColor= '#E36464';
    }
    return (
      <button ref="btnReply" style={buttonStyle} onClick={this.props.onToggleReply}>{this.state.label}</button>
    );
  }
});


/**
 * CommentButtonToggleEdit
 */
var CommentButtonToggleEdit = React.createClass({
  // Mixins
  mixins: [DrupalMixin],
  getInitialState: function() {
    return {
      label:this.Drupal.t('edit')
    };
  },
  setLabel: function(nextProps) {
    if (nextProps.editOpen) {
      this.setState({label: this.Drupal.t('Cancel')});
    }
    else {
      this.setState({label: this.Drupal.t('edit')});
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setLabel(nextProps);
  },
  render: function() {
    // Style
    var buttonStyle = {
      color: '#000',
      backgroundColor: '#B6ED95',
      margin: '3px 0'
    };
    if (this.props.editOpen) {
      buttonStyle.backgroundColor= '#E36464';
    }
    return (
      <button ref="btnEdit" style={buttonStyle} onClick={this.props.onToggleEdit}>{this.state.label}</button>
    );
  }
});

/**
 * CommentButtonApprove
 */
var CommentButtonApprove = React.createClass({
  // Mixins
  mixins: [DrupalMixin],
  getInitialState: function() {
    return {
      label:this.Drupal.t('approve'),
      toggled: false,
    };
  },
  toggle: function() {
    var toggled = !this.state.toggled;
    this.setState({toggled:toggled});
    if (toggled) {
      this.setState({label: this.Drupal.t('Confirm')});
    }
    else {
      this.setState({label: this.Drupal.t('approve')});
    }
  },
  handlerOnApprove: function () {
    if (this.state.toggled) {
      this.props.onApprove();
    }
    else {
      this.toggle();
    }
  },  
  handlerOnCancelDelete: function() {
    this.toggle();
  },
  render: function() {
    // Style
    var buttonStyle = {
      color: '#000',
      backgroundColor: '#B6ED95',
      margin: '3px 0'
    };
    var buttonCancelStyle = {
      color: '#000',
      backgroundColor: '#E36464',
      margin: '3px 0'
    };
    var noticeStyle = {
      clear: 'both',
      display: 'block'  
    };
    return (
      <span>
      {this.state.toggled ?
        <button ref="btnCancel" style={buttonCancelStyle} onClick={this.handlerOnCancelDelete}>{this.Drupal.t('Cancel')}</button>
        : null }
      <button ref="btnApprove" style={buttonStyle} onClick={this.handlerOnApprove}>{this.state.label}</button>
      </span>
    );
  }
});

/**
 * CommentButtonDelete
 */
var CommentButtonDelete = React.createClass({
  // Mixins
  mixins: [DrupalMixin],
  getInitialState: function() {
    return {
      label:this.Drupal.t('delete'),
      toggled: false,
    };
  },
  toggle: function() {
    var toggled = !this.state.toggled;
    this.setState({toggled:toggled});
    if (toggled) {
      this.setState({label: this.Drupal.t('Confirm')});
    }
    else {
      this.setState({label: this.Drupal.t('delete')});
    }
  },
  handlerOnDelete: function () {
    if (this.state.toggled) {
      this.props.onDelete();
    }
    else {
      this.toggle();
    }
  },  
  handlerOnCancelDelete: function() {
    this.toggle();
  },
  render: function() {
    // Style
    var buttonStyle = {
      color: '#000',
      backgroundColor: '#B6ED95',
      margin: '3px 0'
    };
    var buttonCancelStyle = {
      color: '#000',
      backgroundColor: '#E36464',
      margin: '3px 0'
    };
    var noticeStyle = {
      clear: 'both',
      display: 'block'  
    };
    return (
      <span>
      {this.state.toggled ?
        <button ref="btnCancel" style={buttonCancelStyle} onClick={this.handlerOnCancelDelete}>{this.Drupal.t('Cancel')}</button>
        : null }
      {this.state.toggled && this.props.haveChildrens ?
        <p style={noticeStyle}><small>{this.Drupal.t('Any replies to this comment will be lost. This action cannot be undone.')}</small></p>
        : null }
      <button ref="btnDelete" style={buttonStyle} onClick={this.handlerOnDelete}>{this.state.label}</button>
      </span>
    );
  }
});

/**
 * CommentButtonToggleThread
 */
var CommentButtonToggleThread = React.createClass({
  // Mixins
  mixins: [DrupalMixin],
  getInitialState: function() {
    return {
      label:this.Drupal.formatPlural(this.props.count, 'View reply', 'View @count replies'),
    };
  },
  setLabel: function(nextProps) {
    if (nextProps.threadOpen) {
      this.setState({label: this.Drupal.formatPlural(nextProps.count, 'Close reply', 'Close @count replies')});
    }
    else {
      this.setState({label: this.Drupal.formatPlural(nextProps.count, 'View reply', 'View @count replies')});
    }
  },
  // init, once.
  componentWillMount: function() {
    this.setLabel(this.props);
  },
  // On props.
  componentWillReceiveProps: function(nextProps) {
    this.setLabel(nextProps);
  },
  onToggleThread: function (button) {
    this.props.onToggleThread(button);
  },
  render: function() {
    // Style
    var buttonStyle = {
      color: '#000',
      backgroundColor: '#B6ED95',
      margin: '3px 0'
    };
    if (this.props.threadOpen) {
      buttonStyle.backgroundColor= '#E36464'
    }
    return (
       <button style={buttonStyle} ref="btnToggleThread" onClick={this.onToggleThread}>{this.state.label}</button>
    );
  }
});

module.exports = CommentList;