<?php
/**
 * Plugin for LiveBox ReactComponent plugin.
 */
class ReactComponentCommentBox extends ReactComponentExposableBase {

  public $plugin_name = 'commentbox';

  /**
   * {@inheritDoc}
   * @see ReactComponentBase::__construct()
   */
  public function __construct($options = array()) {
    parent::__construct($options);
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::queryElements()
   */
  public function get($route) {
    global $user;
    $options = $this->getOptions();

    $node = node_load($options['nid']);
    if ($options['uid'] != $user->uid || !is_object($node)) {
      return;
    }

    // Only attempt to render comments if the node has visible comments.
    // Unpublished comments are not included in $node->comment_count, so show
    // comments unconditionally if the user is an administrator.
    if (user_access('access comments') || user_access('administer comments')) {
      $mode = COMMENT_MODE_THREADED;
      $comments_per_page = $options['limit'];
      if ($cids = comment_get_thread($node, $mode, $comments_per_page)) {
        $this->_elements = comment_load_multiple($cids);
      }
    }
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::dataModel()
   */
  public function dataModel($route) {
    return array(
      'user' => array(
        'uid' => NULL,
        'name' => NULL,
        'url' => NULL,
        'postAccess' => NULL,
        'editAccess' => NULL,
        'deleteAccess' => NULL,
        'moderateAccess' => NULL,
      ),
      'pager' => array(
        'total' => NULL,
      ),
      'comment' => array(
        'key' => NULL,
        'author' => NULL,
        'authorURL' => NULL,
        'subject' => NULL,
        'body' => NULL,
        'id' => NULL,
        'pid' => NULL,
        'childrens' => array(/* Recursive children */),
        'new' => NULL,
        'date' => NULL,
        'status' => NULL,
      ),
    );
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::defaultDatas()
   */
  public function defaultDatas($route) {
    global $user, $pager_page_array, $pager_total;
    $pager_element = 0;
    $options = $this->getOptions();
    $node = node_load($options['nid']);
    $data_model = $this->dataModel($route);
    $datas = array(
      'user' => $data_model['user'],
      'comments' => array(),
    );
    if ($user->uid) {
      $datas['user']['uid'] = $user->uid;
      $datas['user']['name'] = format_username($user);
      $datas['user']['url'] = url('user/' . $user->uid);
    }

    if ($options['pager']) {
      $page = isset($_GET['offset']) ? round($_GET['offset'] / $options['limit']) : 0;
      $datas['pager'] = array(
        'total' => $pager_total[$pager_element],
        'current' => $pager_page_array[$pager_element] + 1,
        'visiblePages' => 3,
        'limit' => $options['limit'],
      );
    }

    $datas['user']['deleteAccess'] = (user_access('administer comments') && user_access('post comments'));
    $datas['user']['editAccess'] = (user_access('administer comments') && user_access('post comments')) || (comment_access('edit', $comment) && user_access('post comments'));
    $datas['user']['postAccess'] = $node->comment == COMMENT_NODE_OPEN && (user_access('administer comments') || user_access('post comments'));
    $datas['user']['moderateAccess'] = (user_access('administer comments') && user_access('post comments'));
    $datas['user']['postWithoutApprovalAccess'] = (user_access('administer comments') && user_access('post comments')) || (user_access('skip comment approval'));

    $comments = array();
    foreach ($this->elements() as $comment) {
      $data = $data_model['comment'];
      $data['body'] = $comment->comment_body[LANGUAGE_NONE][0]['value'];
      $data['author'] = $comment->name;
      if (!empty($comment->uid)) {
        $author = user_load($comment->uid);
        if (is_object($author)) {
          $data['author'] = format_username($author);
          $data['authorURL'] = url('user/' . $author->uid);
        }
      }
      $data['subject'] = $comment->subject;
      $data['pid'] = $comment->pid;
      $data['body'] = $comment->comment_body[LANGUAGE_NONE][0]['value'];
      $data['id'] = $comment->cid;
      $data['new'] = $comment->new != MARK_READ ? 1 : 0;
      $data['date'] =  $date = (!empty($comment->date) ? $comment->date : format_date($comment->created, 'custom', 'Y-m-d H:i O'));
      $data['status'] = ($comment->status == COMMENT_NOT_PUBLISHED) ? 0 : 1;


      $comments[$comment->cid] = $data;
    }
    $result = $this->_sortCommentsChildrens($comments);

    $datas['comments'] = $result;

    return $datas;
  }


  protected function _sortCommentsChildrens($comments, $root = null) {
    $result = array();
    // Iterate the tree looking for child of the root cid.
    foreach($comments as $key => $comment) {
      $pid = $comment['pid'];
      if ($pid == 0) {
        $pid = null;
      }
      //
      if($pid == $root) {
        // Unset this items, as it going to be added in this loop/level of the result[].
        unset($comments[$key]);
        // Append the comment, merge comments array in and look for comment childrens.
        $comment['childrens'] = $this->_sortCommentsChildrens($comments, $key);
        $comment['key'] = 'comments_' . $comment['id'];
        $comment['key'] .= $comment['pid'] ? '_' . $comment['pid'] : '';
        $result[] = $comment;
      }
    }
    return empty($result) ? array() : $result;
  }


  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::exposedOptions()
   */
  public function exposedOptions() {
    return array(
      'poll-interval',
    );
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::defaultOptions()
   */
  public function defaultOptions() {
    global $user;
    $format = 'plain_text';
    $user_filters = filter_formats($user);
    if (!empty($user_filters)) {
      $format = key($user_filters);
    }
    return array(
      'nid' => NULL,
      'limit' => 15,
      'poll-interval' => 6000,
      'pager' => true,
      'uid' => $user->uid,
      'buffer' => user_access('post comments') ? 0 : 15,
      'comment-body-format' => $format,
    );
  }


  public function post($route, $form) {
    global $user;
    if ($route == 'comments.json') {
      $options = $this->getOptions();

      $node = node_load($options['nid']);
      if ($options['uid'] != $user->uid || !is_object($node)) {
        return false;
      }

      // Should we let the comment pass ?
      if ($node->comment != COMMENT_NODE_OPEN || !user_access('post comments')) {
        // Access denied.
        return false;
      }
      if (!empty($form->values['cid'])) {
        $comment = comment_load($form->values['cid']);
        if ((!is_object($comment))) {
          // Not existent CID.. Access denied
          return false;
        }
        $nodeSubmittedComment = node_load($comment->nid);
        if (!is_object($nodeSubmittedComment) || $nodeSubmittedComment->nid != $node->nid) {
          return FALSE; // BAD nid.. Or node non existent
        }
        // Publish
        if ($form->values['toPublish']) {
          if ((user_access('administer comments') && user_access('post comments'))) {
            $comment->status = COMMENT_PUBLISHED;
            comment_save($comment);
          }
          return;
        }

        // Deletion
        if ($form->values['toDelete']) {
          if ((user_access('administer comments') && user_access('post comments'))) {
            comment_delete($comment->cid);
          }
          return;
        }

        if (!comment_access('edit', $comment)) {
          return FALSE; // No access to edit the comment.
        }
      }

      if (empty($comment)) {
        $pid = NULL;
        if (!empty($form->values['pid'])) {
          if ($form->values['pid'] == (int) $form->values['pid']) {
            if ($comment_parent = comment_load((int) $form->values['pid'])) {
              $pid = $form->values['pid'];
            }
          }
        }

        $comment = new stdClass();
        $comment->nid = $node->nid;
        $comment->pid = $pid;
        $comment->uid = $user->uid;
        $comment->name = check_plain($form->values['author']);
      }
      $comment->subject = check_plain($form->values['subject']);
      $field = field_info_field('comment_body');
      $langcode = field_is_translatable('comment', $field) ? entity_language('comment', $comment) : LANGUAGE_NONE;
      $field_infos = field_info_instance('comment', 'comment_body', 'comment_node_' . $node->type);

      $format = $options['comment-body-format'];
      $text_processing = $field_infos['settings']['text_processing'];
      $body = $form->values['body'];
      $body = $format != 'plain_text' && $text_processing ? check_markup($body, $format) : check_plain($body);

      if ($text_processing) {
        $comment->comment_body[$langcode][0]['format'] = $format;
      }
      $comment->comment_body = array($langcode => array());
      $comment->comment_body[$langcode][0]['value'] = $body;

      comment_submit($comment);

      comment_save($comment);
      cache_clear_all();
    }
  }
}