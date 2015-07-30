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
		}],
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

/**
 * Fetch async data
 * @return promise
 */
function fetchPopulationData(requests) {
	return Promise
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
		var data = {};
		result.forEach(function(item) {
			data[item[0]] = item[1];
		});

		return data;
	});
}

(function() {
	var requests = ['/countries', '/cities', '/populations'];
	var responses;
	var getStatBtn;

	/**
	 * Print population data for continent
	 * @param  {object} responses World statistic
	 * @param  {string} continent
	 */
	function processPopulationData(responses, CONTINENT) {
		var totalPopulation = 0;

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

		console.log('Total population in ' + CONTINENT + ' cities: ' + totalPopulation);
	}

	/**
	 * Prompt continent and process data
	 * @return void
	 */
	function getContinentPopulation() {
		var CONTINENT = window.prompt('Type continent:');
		if(!CONTINENT) {
			return;
		}
		if(!responses) {
			getStatBtn.setAttribute('disabled', true);

			fetchPopulationData(requests)
				.then(function(data) {
					// Cache data
					responses = data;
					processPopulationData(responses, CONTINENT);
					getStatBtn.removeAttribute('disabled');
				})
				.catch(function(err) {
					console.log(err);
				});
		}
		else {
			processPopulationData(responses, CONTINENT);
		}
	}

	getStatBtn = document.createElement('button');
	getStatBtn.innerText = 'Get continent population';
	getStatBtn.addEventListener('click', getContinentPopulation, false);
	document.body.appendChild(getStatBtn);
})();
