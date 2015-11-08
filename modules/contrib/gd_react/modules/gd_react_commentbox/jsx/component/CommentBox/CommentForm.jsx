var React       = require('../../lib/react-with-addons');
var DrupalMixin = require('../../mixins/DrupalMixin');
var DrupalMixin = require('../../mixins/DrupalMixin');
var ValidationMixin = require('react-validation-mixin');
var Joi = require('joi');

/**
 * CommentForm
 */
var CommentForm = React.createClass({
  // Mixins
  mixins: [DrupalMixin, ValidationMixin, React.addons.LinkedStateMixin],
  validatorTypes: function () {
    return {
      subject: Joi.string().required().options(
        {language: 
          {any: { 
            required: this.Drupal.t('must not be empty'), 
            empty: this.Drupal.t('must not be empty') 
          }} 
        }).label(this.Drupal.t('Subject')),
      body: Joi.string().required().options(
        {language: 
          {any: {
            required: this.Drupal.t('must not be empty'), 
            empty: this.Drupal.t('must not be empty') 
          }} 
        }).label(this.Drupal.t('Comment')),
      author: Joi.string().required().options(
        {language: 
          {any: {
            required: this.Drupal.t('must not be empty'),  
            empty: this.Drupal.t('must not be empty') 
          }} 
        }).label(this.Drupal.t('Name')),  
    };
  },
  getInitialState: function() {
    return {
      author:null,
      body:null,
      subject:null,
      pid:null,
      validation:null
    };
  },
  // init, once.
  componentWillMount: function() {
    var author = '';
    var subject = '';
    var body = '';
    var pid = '';
    // Edit OR create mode.
    if (this.props['editComment']) {
      author = this.props.editComment.author;
      subject = this.props.editComment.subject;
      body = this.props.editComment.body;
      pid = this.props.editComment.pid;
    }
    else {
      if (this.props.user['name']) {
        author = this.props.user['name'];
      }
      if (this.props['pid']) {
        pid = this.props.pid;
      }
      subject = this.props['subject'];
    }
    // Update state input default values with props.
    this.setState({
      author:author,
      body:body,
      subject:subject,
      pid:pid
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();

    // Construct the new or edited comment input values.
    var newComment = this.props['editComment'] || {};
    newComment.author = this.state.author;
    newComment.subject = this.state.subject;
    newComment.body = this.state.body;
    newComment.pid = this.state.pid;
    
    if (this.props['editComment']) {
      newComment.cid = newComment.id;
    }
    onValidate = function(error, validationErrors) {
      if (error) {
        this.setState({
          validation: this.Drupal.t('Fix error in the form before update.')
        });
      } else {
        if (this.state.pid) {
          this.setState({
            validation: this.Drupal.t('Submitted.')
          });
        }
        // SUBMIT:
        this.props.onCommentSubmit(newComment);
        
        // Blank the form values.
        if (!this.props.user['name']) {
          this.setState({author: ''});
        }
        this.setState({
          body: '',
          pid: null,
          subject: '',
        });
      }
    }.bind(this);
    this.validate(onValidate);
  },
  render: function() {
    var formWrapperStyle = {
      border: '1px solid #ccc',
      overflow: 'hidden',
      clear: 'both',
      padding: '10px'
    };
    var formItemStyle = {
      clear: 'both',
      margin: '10px 0'
    };
    var formButtonStyle = {
      clear: 'both',
      margin: '10px 0'
    };
    
    if (this.state.pid) {
      formWrapperStyle.margin = '0 20px 20px';
    }
    
    return (      
      <div style={formWrapperStyle} className="comment-form-wrapper">
      {this.props['editComment'] ?
        <h2 dangerouslySetInnerHTML={{__html: this.Drupal.t('Edit comment %comment', {'%comment': this.props['editComment'].subject})}}></h2>
      : <h2>{this.Drupal.t('Add new comment')}</h2>
       }
      <form className="commentForm" onSubmit={this.handleSubmit}>
        {this.props.user['name'] ?
          <div style={formItemStyle} className="username">{this.state.author}</div>
        : 
          <div className={this.getClasses('author')}>
          <label htmlFor={this.getFieldHtmlID('author')}>{this.Drupal.t('Your name')}</label>
          <input style={formItemStyle} id={this.getFieldHtmlID('author')} className='form-control' onBlur={this.handleValidation('author')} type="text" valueLink={this.linkState('author')} placeholder={this.Drupal.t('Your name')} ref="author" />
          {this.getValidationMessages('author').map(this.renderHelpText)}
          </div>
        }
        
        <div className={this.getClasses('subject')}>
          <label htmlFor={this.getFieldHtmlID('subject')}>{this.Drupal.t('Subject')}</label>
          <input style={formItemStyle} id={this.getFieldHtmlID('subject')} className='form-control' onBlur={this.handleValidation('subject')} type="text" placeholder={this.Drupal.t('Subject')} valueLink={this.linkState('subject')} ref="subject" />
          {this.getValidationMessages('subject').map(this.renderHelpText)}
        </div>
        
        <input type="hidden" valueLink={this.linkState('pid')} ref="pid" />
        
        <div className={this.getClasses('body')}>
          <label htmlFor={this.getFieldHtmlID('body')}>{this.Drupal.t('Comment')}</label>
          <textarea style={formItemStyle} id={this.getFieldHtmlID('body')} className='form-control' onBlur={this.handleValidation('body')} placeholder={this.Drupal.t('Comment')} valueLink={this.linkState('body')} ref="body"></textarea>
          {this.getValidationMessages('body').map(this.renderHelpText)}
        </div>
        <div>{this.state.validation}</div>
        {this.props['editComment'] ?
          <input style={formButtonStyle} type="submit" value={this.Drupal.t('Save')} />
        : <input style={formButtonStyle} type="submit" value={this.Drupal.t('Post your comment')} />
        }
      </form>
      </div>
    );
  },
  renderHelpText: function(message) {
    return (
      <span className="help-block">{this.Drupal.t(message)}</span>
    );
  },
  getFieldHtmlID: function (field) {
    var key = field;
    if (this.props['editComment']) {
      key += '_id' + this.props['editComment'].id;
    }
    if (this.props['pid']) {
      key += '_pid' + this.props['pid'];
    }
    return key;
  },
  getClasses: function(field) {
    return React.addons.classSet({
      'form-group': true,
      'has-error': !this.isValid(field)
    });
  },
});



module.exports = CommentForm;