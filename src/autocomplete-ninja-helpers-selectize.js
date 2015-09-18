autocomplete_ninja.selectize = {

    _convert: function(data, value_lookup)  {
        var pluck = autocomplete_ninja._create_plucker(value_lookup);
        for (var i = 0; i < data.length; i++) {
            data[i].value = pluck(data[i]);
        }
        return data
    },

    _get_config: function(path, extra_params, value_lookup) {
        var self = this;
        var options = autocomplete_ninja.options;
        var pluck = autocomplete_ninja._create_plucker(value_lookup);
        return {
            loadThrottle: options.delay,
            labelField: 'name',
            load: function(query, callback) {
                if (query.length < options.min_chars) return callback();
                this.clearOptions();
                $.ajax({
                    url: options.base_uri + path, 
                    type: 'GET',
                    data: $.extend({term: query, apikey: options.apikey}, 
                                   autocomplete_ninja._resolve(extra_params)),
                    error: function() {
                        callback()
                    },
                    success: function(data) {
                        callback(self._convert(data, value_lookup));
                    }
                });                
            },
            score: function(search) {
                return function() { return 1 };
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