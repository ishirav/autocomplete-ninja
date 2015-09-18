
autocomplete_ninja.chosen = {

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