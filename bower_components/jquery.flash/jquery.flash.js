/**
 * jquery.flash
 * A jQuery plugin for embedding Flash movies.
 * 
 * Version 1.0
 * March 23rd, 2010
 * 
 * Based on the jQuery Flash Plugin (http://jquery.lukelutman.com/plugins/flash)
 * Copyright (c) 2006 Luke Lutman (http://www.lukelutman.com)
 * 
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function() {
    var default_options = {
        expressInstall: false,
        version: '6.0.65'
    };
    var default_attributes = {
        type: 'application/x-shockwave-flash',
        wmode: 'transparent',
        flashVars: []
    };

    var $$ = jQuery.fn.flash = function(attributes, options) {
        options = jQuery.extend(default_options, options);
        if(!$$.hasFlash(options.version)) {
            if(options.expressInstall && $$.hasFlash('6.0.65')) {
                var expressInstallOptions = {
                    flashvars: {
                        MMredirectURL: location,
                        MMplayerType: 'PlugIn',
                        MMdoctitle: jQuery('title').text() 
                    }
                };
            }
            else {
                return this;
            }
        }
        return this.each(function(){
            $$.replace.call(this, attributes);
        });
    };

    $$.hasFlash = function(options_version) {
        var player_version = $$.playerVersion().match(/\d+/g);
        var required_version = options_version.match(/\d+/g);
        for(var i = 0; i < 3; i++) {
            player_version[i] = parseInt(player_version[i] || 0);
            required_version[i] = parseInt(required_version[i] || 0);

            if(player_version[i] < required_version[i]) {
                return false;
            }
            else if(player_version[i] > required_version[i]) {
                return true;
            }
        }
        
        return true;
    };

    $$.playerVersion = function() {
        try {
            try {
                var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
                try {
                    axo.AllowScriptAccess = 'always';
                }
                catch(e) {
                    return '6,0,0';
                }
            }
            catch(e) {}
            return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
        } catch(e) {
            try {
                if(navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
                    return (navigator.plugins['Shockwave Flash 2.0'] || navigator.plugins['Shockwave Flash']).description.replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
                }
            }
            catch(e) {}
        }
        return '0,0,0';
    };
    
    $$.serialize = function(object) {
        var serialized = [];
        jQuery.each(object, function(index, value) {
            serialized.push(index + '=' + encodeURIComponent(value));
        });
        return serialized.join('&');
    }
    
    $$.replace = function(attributes) {
        var self = jQuery(this);

        var element_attributes = {
            width: parseInt(self.css('width')),
            height: parseInt(self.css('height')),
            src: self.attr('data-swf')
        };

        attributes = jQuery.extend(default_attributes, element_attributes, attributes);
        attributes.flashVars = $$.serialize(attributes.flashVars);
        
        var embed = jQuery('<embed />').attr(attributes);
        // jQuery seems to brek in IE using $.attr() to set pluginspage
        this.pluginspage = 'http://www.adobe.com/go/getflashplayer';
        self.empty().append(embed);
    };
})();