<?php

if (!class_exists('TRUNKRS_WC_AssetLoader')) {
  class TRUNKRS_WC_AssetLoader
  {
    var $pluginRootDir;

    public function __construct()
    {
      $something = explode('/', rtrim(dirname(__FILE__), '/'));
      array_pop($something);
      $this->pluginRootDir = implode('/', $something);

      add_action('wp_enqueue_scripts', [$this, 'loadCheckoutAssets']);
      add_action('admin_enqueue_scripts', [$this, 'loadAdminAssets']);
    }

    public function loadCheckoutAssets()
    {
      if (!$this->isCheckout()) {
        return;
      }

      $assetTag = TRUNKRS_WC_Bootstrapper::DOMAIN . '-checkout';
      $stylePath = '/build/checkout.css';

      $this->addStylesForTag($assetTag, $stylePath);
    }

    public function loadAdminAssets()
    {
      $assetTag = TRUNKRS_WC_Bootstrapper::DOMAIN . '-admin';

      $assetPhpPath = '/build/admin.asset.php';
      $scriptPath = '/build/admin.js';
      $stylePath = '/build/admin.css';

      $this->addStylesForTag($assetTag, $stylePath);

      $screen = get_current_screen();
      $isTrunkrsAdminPage = $screen->id == 'woocommerce_page_tr-wc-settings';

      if ($isTrunkrsAdminPage) {
        $this->addScriptsForTag($assetTag, $assetPhpPath, $scriptPath);
      }
    }

    private function isCheckout()
    {
      return is_checkout() || is_cart();
    }

    private function addScriptsForTag($assetTag, $assetPhpPath, $scriptPath)
    {
      $fullAssetPhpPath = $this->pluginRootDir . $assetPhpPath;
      $assetDetails = file_exists($fullAssetPhpPath)
        ? require($fullAssetPhpPath)
        : [
          'dependencies' => [],
          'version' => filemtime($scriptPath),
        ];
      $scriptUrl = plugins_url($scriptPath, $this->pluginRootDir . '/something.php');

      wp_register_script(
        $assetTag,
        $scriptUrl,
        $assetDetails['dependencies'],
        $assetDetails['version'],
        true
      );
      wp_enqueue_script($assetTag);
    }

    private function addStylesForTag($assetTag, $stylePath)
    {
      wp_register_style(
        $assetTag,
        plugins_url($stylePath, $this->pluginRootDir . '/something.php'),
        [],
        filemtime($this->pluginRootDir . $stylePath)
      );

      wp_enqueue_style($assetTag);
    }
  }
}

new TRUNKRS_WC_AssetLoader();
