/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
 */

function getData(url, callback) {
	var RESPONSES = {
		'/countries': [{
			name: 'Cameroon',
			continent: 'Africa'
		}, {
			name: 'Fiji Islands',
			continent: 'Oceania'
		}, {
			name: 'Guatemala',
			continent: 'North America'
		}, {
			name: 'Japan',
			continent: 'Asia'
		}, {
			name: 'Yugoslavia',
			continent: 'Europe'
		}, {
			name: 'Tanzania',
			continent: 'Africa'
		}],
		'/cities': [{
			name: 'Bamenda',
			country: 'Cameroon'
		}, {
			name: 'Suva',
			country: 'Fiji Islands'
		}, {
			name: 'Quetzaltenango',
			country: 'Guatemala'
		}, {
			name: 'Osaka',
			country: 'Japan'
		}, {
			name: 'Subotica',
			country: 'Yugoslavia'
		}, {
			name: 'Zanzibar',
			country: 'Tanzania'
		}, ],
		'/populations': [{
			count: 138000,
			name: 'Bamenda'
		}, {
			count: 77366,
			name: 'Suva'
		}, {
			count: 90801,
			name: 'Quetzaltenango'
		}, {
			count: 2595674,
			name: 'Osaka'
		}, {
			count: 100386,
			name: 'Subotica'
		}, {
			count: 157634,
			name: 'Zanzibar'
		}]
	};

	setTimeout(function() {
		var result = RESPONSES[url];
		if (!result) {
			return callback('Unknown url');
		}

		callback(null, result);
	}, Math.round(Math.random * 1000));
}

/**
 * Ваши изменения ниже
 */
var requests = ['/countries', '/cities', '/populations'];

Promise
	.all(requests.map(function(request) {
		var promise = new Promise(function(resolve, reject) {
			getData(request, function(error, result) {
				if(error) {
					reject(error);
				}
				resolve([request, result]);
			});
		});

		return promise;
	}))
	.then(function(result) {
		var responses = {};
		result.forEach(function(item) {
			responses[item[0]] = item[1];
		});

		return responses;
	})
	.then(proccessPopulationData)
	.catch(function(error) {
		console.log(error);
	});

/**
 * Print population data for continent
 * @param  {object} responses World statistic
 */
function proccessPopulationData(responses) {
	var totalPopulation = 0;
	var CONTINENT = 'Africa';

	var countries = responses['/countries'].filter(function(country) {
		return country.continent === CONTINENT;
	});

	var cities = responses['/cities'].filter(function(city) {
		return countries.some(function(country) {
			return city.country === country.name;
		});
	}).map(function(city) { return city.name; });

	totalPopulation = responses['/populations'].reduce(function(value, city) {
		if(cities.indexOf(city.name) > -1) {
			return value + city.count;
		}
		return value;
	}, totalPopulation);

  console.log('Total population in African cities: ' + totalPopulation);
}
