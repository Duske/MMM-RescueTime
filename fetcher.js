const rescuetime = require("node-rescuetime");
var format = require("date-fns/format");

const getToday = apiKey => {
	const rescue = rescuetime(apiKey);
	const todayString = format(new Date(), "YYYY-MM-DD");
	const params = {
		perspective: "rank",
		restrict_kind: "overview",
		restrict_begin: todayString,
		restrict_end: todayString,
		resolution_time: "minute",
		format: "json"
	};
	return rescue
		.analytics(params)
		.then(data => transformToChartData(data.data.rows));
};

const sortRow = (
	[_rankA, _secondsA, _peopleA, categoryA],
	[_rankB, _secondsB, _peopleB, categoryB]
) => {
	if (categoryA < categoryB) {
		return -1;
	}
	if (categoryA > categoryB) {
		return 1;
	}
	return 0;
};

const transformToChartData = rows =>
	rows.sort(sortRow).reduce((acc, [rank, seconds, people, category]) => {
		const hours = seconds / 3600;
		acc.labels.push(category);
		acc.dataSet.push(parseFloat(hours.toFixed(2)));
		return acc;
	}, {
		labels: [],
		dataSet: []
	});

module.exports = {
	getToday
};
