<?php
/**
 * Plugin for LiveBox ReactComponent plugin.
 */
class ReactComponentLiveBox extends ReactComponentBase {

  public $plugin_name = 'livebox';
  /**
   * {@inheritDoc}
   * @see ReactComponentBase::__construct()
   */
  public function __construct($options = array()) {
    parent::__construct($options);
    $options = $this->getOptions();
    $this->key = $options['entity-type'];
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::queryElements()
   */
  public function get($route) {
    if ($route == 'entities.json') {
      $this->_elements = $this->_getEntities();
    }
  }

  protected function _getEntities() {
    $options = $this->getOptions();
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', $options['entity-type']);
    if (!empty($options['sort-field'])) {
      if (strpos($options['sort-field'], ':') === FALSE) {
        $query->propertyOrderBy($options['sort-field'], strtoupper($options['sort-order']));
      }
      else {
        $sort_field = explode(':', $options['sort-field']);
        $query->fieldOrderBy($sort_field[0], $sort_field[1], strtoupper($options['sort-order']));
      }
    }
    if (!empty($options['bundle'])) {
      $query->propertyCondition('type', $options['bundle']);
    }

    $query->range(0, $options['limit']);

    $results = $query->execute();
    if (empty($results[$options['entity-type']])) {
      return array();
    }
    return entity_load($options['entity-type'], array_keys($results[$options['entity-type']]));

  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::dataModel()
   */
  public function dataModel($route) {
    $data_models = array(
      'entities.json' => array(
        'title' => NULL,
        'body' => NULL,
        'url' => NULL,
        'id' => NULL,
      )
    );

    return isset($data_models[$route]) ? $data_models[$route] : array();
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::defaultDatas()
   */
  public function defaultDatas($route) {
    $datas = array();

    if ($route == 'entities.json') {
      $datas = $this->_defaultDatasEntities($route);
    }

    return $datas;
  }

  protected function _defaultDatasEntities($route = 'entities.json') {
    $options = $this->getOptions();
    $datas = array();
    foreach ($this->elements() as $entity) {
      $wrapper = entity_metadata_wrapper($options['entity-type'], $entity);
      $data = $this->dataModel($route);
      $data['id'] = $wrapper->getIdentifier();
      $data['url'] = call_user_func_array('url', entity_uri($options['entity-type'], $entity));
      $data['title'] = $wrapper->title->value();
      $data['body'] = $wrapper->body->value->value();
      $datas[] = $data;
    }
    return $datas;
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::exposedOptions()
   */
  public function exposedOptions() {
    return array(
      'title',
      'poll-interval',
    );
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::defaultOptions()
   */
  public function defaultOptions() {
    return array(
      'entity-type' => 'node',
      'bundle' => NULL,
      'sort-field' => NULL,
      'sort-order' => 'DESC',
      'limit' => 50,
      'title' => NULL,
      'poll-interval' => 2000,
      'buffer' => 2,
    );
  }
}