<?php

/**
 * Ensures basic required behavior for a ReactComponent plugin.
 */
interface ReactComponentInterface {

  // public $plugin_name = 'plugin_name'; // Set this to the name of your ctools plugin.

  /**
   * Call by the components to retrieve datas for a $route.
   */
  public function get($route);

  /**
   * Generic default function that format data as expected for the json output.
   *
   * This function is not called if a module implements
   * hook_PLUGIN_TYPE_datas_COMPONENT_KEY() and return datas.
   *
   * @return array
   *   A values array of datas ready to be encoded in JSON.
   *
   * @see $this->dataModel().
   */
  public function defaultDatas($route);

  /**
   * Return the raw elements as provided by $this->queryElements().
   *
   * @return array
   *   A value array of the component loaded elements.
   */
  public function elements();

  /**
   * Return all the component data options.
   *
   * @return array
   *   A key => value array of this component options.
   */
  public function getOptions();

  /**
   * Return all the default component data options and default values.
   *
   * @return array
   *   A key => value array of the full options list and
   *   default values needed to instantiate this plugin.
   */
  public function defaultOptions();

  /**
   * Return the schema of an element
   * as it must be returned in the json to the component.
   *
   * @return array
   *   An array of key => value formatted as expected by the js components.
   */
  public function dataModel($route);

  /**
   * Return the component ID.
   *
   * @return string
   *   A key unique for this site/plugin type and components options values.
   */
  public function getComponentID();

  /**
   * Theme the component to output.
   *
   * @param array $variables
   *   The array of variables as returned by theme() function.
   *
   * @return string
   *   The html markup of the component.
   *
   * @see theme_react_component().
   */
  public function theme($variables);

  /**
   * Return the properties that must be exposed in the DOM (via data-$key="$value").
   *
   * @return array
   *  A value array of the options to expose in the dom.
   */
  public function exposedOptions();

  //protected function setComponentID(); Cannot be declared in interface, but extensible.

}

/**
 * ReactComponent base class.
 */
abstract class ReactComponentBase implements ReactComponentInterface {

  /**
   * The ctools plugin type 'react_component'.
   * @var array
   */
  public $pluginType;

  /**
   * The key used in datas hooks.
   * @var string
   */
  public $key;

  /**
   * The options of this component.
   * @var array
   */
  private $_options;

  /**
   * The component ID.
   * @see theme_react_component()
   * @var string
   */
  private $_componentID;

  /**
   * The raw elements returned by the get method.
   * @var array
   */
  protected $_elements = array();

  /**
   * Class constructor.
   *
   * @param string $plugin_type
   *  The ctools plugin type 'react_component' name.
   * @param array $options
   *   The component options as passed in theme('react_component').
   */
  public function __construct($options = array()) {
    if (empty($this->plugin_name)) {
      drupal_set_message(t('Plugin loaded without member variable <b>plugin_name</b> set.'), 'error');
    }

    $this->pluginType = gd_react_component_plugin_load($this->plugin_name);

    if ($this->pluginType == FALSE) {
      drupal_set_message(t('Plugin loaded with an invalid member variable <b>plugin_name</b> set.'), 'error');
    }
    $this->_options = array_merge($this->defaultOptions(), $options);
    $this->_options['plugin-name'] = $this->plugin_name;
    $this->setComponentID();

    $this->key = $this->plugin_name;
  }

  /**
   * Set a secure componentId based on the options values and the drupal private key.
   */
  protected function setComponentID() {
    $base64 = implode('@', $this->getOptions());
    $base64 = base64_encode($base64);
    $this->_componentID = $this->pluginType['name'] . md5($base64 . drupal_get_private_key() . drupal_get_hash_salt());
  }

  /**
   * Mimic drupal_attributes, but prepend "data-" on each attribute key.
   *
   * @param array $attributes
   *   An array oh key, value attributes.
   *
   * @return string
   *   the html attributes string.
   */
  private function _attributes($attributes) {
    foreach ($attributes as $attribute => &$data) {
      $data = implode(' ', (array) $data);
      $data = 'data-' . $attribute . '="' . check_plain($data) . '"';
    }
    return $attributes ? ' ' . implode(' ', $attributes) : '';
  }

  /**
   * Remove options that are not marked as exposed by the plugin.
   *
   * @param array $datas
   *  The options array.
   *
   * @return array
   *   The array of exposed options.
   */
  private function _removePrivateOptions($datas) {
    foreach ($datas as $key => $data) {
      if (!in_array($key, $this->exposedOptions())) {
        unset($datas[$key]);
      }
    }
    return $datas;
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::getComponentID()
   */
  public function getComponentID() {
    return $this->_componentID;
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::theme()
   */
  public function theme($variables) {
    $options = $this->getOptions();
    if (!$variables['expose_private_options']) {
      $options = $this->_removePrivateOptions($options);
    }

    return '<' . $this->pluginType['element_name'] . ' data-id="' . $this->getComponentID() . '" ' . $this->_attributes($options) . '></gd-' . $this->pluginType['name'] . '>';
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::elements()
   */
  public function elements() {
    return $this->_elements;
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::getOptions()
   */
  public function getOptions() {
    return $this->_options;
  }

  /**
   * {@inheritDoc}
   * @see ReactComponentInterface::defaultOptions()
   */
  public function defaultOptions() {
    return array(
      'buffer' => 2, // In seconds, define the period of time in seconds while data are retrieved from cache.
      'poll-interval' => 2000, // The js composant poll interval in miliseconds.
    );
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
}

interface ReactComponentExposableInterface extends ReactComponentInterface {
  public function post($route, $form);
}

abstract class ReactComponentExposableBase extends ReactComponentBase implements ReactComponentExposableInterface {
}
