
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
        this.last_response = null;
    },

    _resolve: function(extra_params) {
        // Resolve object properties by detecting those that are functions, calling
        // them and saving their return values.
        for (var key in extra_params) {
            if (extra_params.hasOwnProperty(key)) {
                var val = extra_params[key];
                extra_params[key] = $.isFunction(val) ? val() : val;
            }
        }
        return extra_params;
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
    },


    jquery_ui: {

        _convert: function(data)  {
            for (var i = 0; i < data.length; i++) {
                data[i].label = data[i].name;
                data[i].value = data[i].display_name || data[i].name;
            }
            autocomplete_ninja.last_response = data;
            return data
        },

        _get_config: function(path, extra_params) {
            var self = this;
            var options = autocomplete_ninja.options;
            return {
                delay: options.delay,
                minLength: options.min_chars,
                source: function(request, response) {
                    $.get(
                        options.base_uri + path, 
                        $.extend({term: request.term, apikey: options.apikey}, 
                                 autocomplete_ninja._resolve(extra_params)),
                        function(data) {
                            response(self._convert(data));
                        }
                    );
                }
            };
        },

        countries: function() {
            return this._get_config('countries/', {});
        },

        regions: function(country) {
            return this._get_config('regions/', {country: country});
        },

        cities: function(country, region) {
            return this._get_config('cities/', {country: country, region: region});
        }

    },


    chosen: {

        _get_config: function(path, extra_params, value_lookup) {
            var self = this;
            var options = autocomplete_ninja.options;
            var pluck = autocomplete_ninja._create_plucker(value_lookup);
            return {
                afterTypeDelay: options.delay,
                minTermLength: options.min_chars,
                url: options.base_uri + path, 
                dataCallback: function(data) {
                    data.apikey = options.apikey;
                    $.extend(data, autocomplete_ninja._resolve(extra_params));
                    return data;
                },
                converters: {
                    'text json': function(data) {
                        data = $.parseJSON(data);
                        for (var i = 0; i < data.length; i++) {
                            data[i].text = data[i].name;
                            data[i].value = pluck(data[i]);
                        }
                        autocomplete_ninja.last_response = data;
                        return data;
                    }
                }
            };
        },

        countries: function() {
            return this._get_config('countries/', {}, 'codes.iso');
        },

        regions: function(country) {
            return this._get_config('regions/', {country: country}, 'code');
        },

        cities: function(country, region) {
            return this._get_config('cities/', {country: country, region: region}, 'name');
        }

    }


}