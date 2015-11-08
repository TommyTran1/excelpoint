<?php
require_once dirname(__FILE__) . '/lessc.inc.php';
class drupalexp_lessc{
	var $theme;
	var $output;
	var $css;
	var $lessc;
	var $importDir;
	function __construct($theme){
		$this->theme = $theme;
		$this->lessc = new lessc();
		$this->lessc->setImportDir(drupal_get_path('theme',$theme->theme));
		$this->importDir = drupal_get_path('theme',$theme->theme);
		$this->__addPresetVariables();
		$this->__addBaseCSS();
	}
	
	function addVariable($name, $value){
		$this->output .= "@{$name}:{$value};\n";
	}
	
	function filetime($file){
		if(($time = @filemtime($file)) != FALSE){
			return $time;
		}
		if(($time = @filemtime($this->importDir.'/'.$file)) != FALSE){
			return $time;
		}
		return 0;
	}
	
	function complie($file = null){
		$update = drupalexp_is_settings_change();
		$ftime = $this->filetime($file);
		if (!empty($this->theme->lessc)) {
			foreach($this->theme->lessc as $lessc_file) {
				if($ftime < $this->filetime($lessc_file)){
					$update = true;
				}
				$this->output .= "@import \"$lessc_file\";\n";
			}
		}
		if($update){
			try{
				$this->css = $this->lessc->compile($this->output);
			}catch(exception $e){
				drupal_set_message("fatal error: " . $e->getMessage(),'error');
				return FALSE;
			}
			if($file){
				file_unmanaged_save_data($this->css,$file,FILE_EXISTS_REPLACE);
			}
		}
		return $this->css;
	}
	
	private function __addPresetVariables(){
		foreach($this->theme->lessc_vars as $key => $value){
			$this->addVariable($key, $value);
		}
	}
	
	private function __addBaseCSS(){
		$this->output .= 'body{color: @text_color;}a:not(.btn){color:@link_color; &:hover{color:@link_hover_color}}h1,h2,h3,h4,h5,h6{color:@heading_color}';
	}
}