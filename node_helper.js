const NodeHelper = require("node_helper")
const rescueTime = require("./fetcher.js")

module.exports = NodeHelper.create({
	start: () => {
		this.config = {}
	},

	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, payload) {
		var self = this
		if (notification === "CONFIG") {
			self.config = payload
			this.sendTodayData()
		}
		if (notification === "GET_TODAY") {
			this.sendTodayData()
		}
	},

	sendTodayData () {
		var self = this
		return rescueTime
			.getToday(self.config.apiKey)
			.then(data => {
				self.sendSocketNotification("TODAY", data)
			})
			.catch(err => {
				console.error("RescueTime data could not be fetched:", err)
			})
	}
})
