var moment = require('moment');

module.exports = DateManager = {

	formatShowTime: function(date) {
		if (moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('mm') !== '00') {
			return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('h:mm A');
		}

		return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('h A');
	},
 
	getShowsOnDate: function (day, shows) {
		var result = [];

		var date = moment(day.date, 'MMMM Do YYYY');

		for (var i = 0, len = shows.length; i < len; i++) {
			var show = shows[i];

			var showDate = moment(show.date, 'YYYY-MM-DD HH:mm:ssZZ').format('MMMM Do YYYY');
			    		
			if (date.isSame(moment(showDate, 'MMMM Do YYYY'))) {
				result.push(show);
	    	}
	    }

	    return result;
	},

	areTicketsOnSale: function (date) {
		var saleDate = moment(date, 'YYYY-MM-DD HH:mm:ssZZ');

		if (saleDate.isAfter(moment())) {
			return false;
		}
		return true;
	},

	formatSaleDate: function (date) {
		return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('M/D') + " at " + moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('h a');
	},

	formatHeaderCalendarDay: function (day) {
		var date = moment(day, 'MMMM Do YYYY'),
			date = date.format('ddd D');

		return date;
	},

	getDaysArray: function(start, offset) {
		var result = [];

		var day = start;
		for (var i = 0; i < offset; i++) {
			result.push({
				"id": i,
				"date": day.format('MMMM Do YYYY')
			});

			day.add(1, 'days');
		}

		return result;
	},

	getStartOfNextPage: function(end) {
		var day = moment(end, 'MMMM Do YYYY'),
			day = day.add(1, 'days');

		return day;
	},

	getStartOfPreviousPage: function(previousStart, offset) {
		var day = moment(previousStart, 'MMMM Do YYYY'),
			day = day.subtract(offset, 'days');

		return day;
	},

	getMonthFromDate: function(date) {
		return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('MMM');
	},

	getDayFromDate: function(date) {
		return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('D');
	},

	getMobileDate: function(date) {
		var currentDate = moment(date.date, 'MMMM Do YYYY');
		var today = moment().hour(0).minute(0).second(0);

		var diff = Math.round(currentDate.diff(today, 'days', true));

		if (diff === 0) {
			return "TODAY";
		}
		else if (diff === -1 ) {
			return "YESTERDAY";
		}
		else if (diff === 1 ) {
			return "TOMORROW";
		}
		else if (diff < 7 && diff > 1) {
			return currentDate.format("dddd").toUpperCase();
		}
		else {
			return currentDate.format("dddd MMM Do").toUpperCase();
		}
	},

	getFeaturedShowDate: function(date) {
		var currentDate = moment(date, 'YYYY-MM-DD');
		var today = moment().hour(0).minute(0).second(0);

		var diff = Math.round(currentDate.diff(today, 'days', true));

		if (diff === 0) {
			return "TODAY";
		}
		else if (diff === -1 ) {
			return "YESTERDAY";
		}
		else if (diff === 1 ) {
			return "TOMORROW";
		}
		else if (diff < 7 && diff > 1) {
			return currentDate.format("dddd").toUpperCase();
		}
		else {
			return currentDate.format("dddd, MMMM Do").toUpperCase();
		}
	},

	getRecentShowsDate: function(date) {
		var currentDate = moment(date, 'YYYY-MM-DD');
		var today = moment().hour(0).minute(0).second(0);

		var diff = Math.round(currentDate.diff(today, 'days', true));

		if (diff === 0) {
			return "Added Today";
		}
		else if (diff === -1 ) {
			return "Added Yesterday";
		}
		else {
			return "Added " + currentDate.format("dddd, MMMM Do");
		}
	}
};