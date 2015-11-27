autocomplete_ninja.selectize = {

    _convert: function(data, pluck)  {
        if (pluck) {
            // Data is an array of objects
            for (var i = 0; i < data.length; i++) {
                data[i].value = pluck(data[i]);
            }
        }
        else {
            // Data is an array of strings
            for (var i = 0; i < data.length; i++) {
                data[i] = {name: data[i], value: data[i]};
            }
        }
        return data
    },

    _get_config: function(path, extra_params, pluck) {
        var self = this;
        var options = autocomplete_ninja.options;
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
                        callback(self._convert(data, pluck));
                    }
                });                
            },
            score: function(search) {
                return function() { return 1 };
            }
        };
    },

    countries: function() {
        var pluck = autocomplete_ninja._create_plucker('codes.iso');
        return this._get_config('countries/', {}, pluck);
    },

    regions: function(country) {
        var pluck = autocomplete_ninja._create_plucker('code');
        return this._get_config('regions/', {country: country}, pluck);
    },

    cities: function(country, region) {
        var pluck = autocomplete_ninja._create_plucker('name');
        return this._get_config('cities/', {country: country, region: region}, pluck);
    },

    emails: function(country) {
        var extra_params = {};
        if (country) extra_params.country = country;
        var conf = this._get_config('emails/', extra_params, null);
        conf.create = true;
        conf.createOnBlur = true;
        conf.addPrecedence = true;
        conf.render = {
            option_create: function(data, escape) {
                return '<div class="create">' + escape(data.input) + '</div>';
            }
        }
        return conf;
    },

    timezones: function(country) {
        var pluck = autocomplete_ninja._create_plucker('name');
        var extra_params = {};
        if (country) extra_params.country = country;
        return this._get_config('timezones/', extra_params, pluck);
    },


}