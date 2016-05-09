cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
        "id": "ionic-plugin-keyboard.keyboard",
        "pluginId": "ionic-plugin-keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "ionic-plugin-keyboard": "2.1.0"
}
// BOTTOM OF METADATA
});