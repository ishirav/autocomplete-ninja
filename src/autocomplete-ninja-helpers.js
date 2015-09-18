
autocomplete_ninja = {

    initialize: function(options) {
        if (!'apikey' in options) {
            throw 'autocomplete_ninja: missing required apikey in call to initialize.';
        }
        var defaults = {
            delay: 300,
            min_chars: 2,
            base_uri: 'https://autocomplete.ninja/api/v1/'
        };
        this.options = $.extend({}, defaults, options);
    },

    _resolve: function(extra_params) {
        // Resolve object properties by detecting those that are functions, calling
        // them and saving their return values.
        var result = {};
        for (var key in extra_params) {
            if (extra_params.hasOwnProperty(key)) {
                var val = extra_params[key];
                result[key] = $.isFunction(val) ? val() : val;
            }
        }
        return result;
    },

    _create_plucker: function(lookup) {
        // Returns a function that gets a property's value from objects by name. 
        // Multiple levels of lookup are supported using dot notation.
        var parts = lookup.split('.');
        return function(obj) {
            for (var i = 0; i < parts.length; i++) {
                obj = obj[parts[i]];
            }
            return obj;
        }
    }

}