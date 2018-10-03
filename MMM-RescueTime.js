/* global Module, window, Log */

Module.register("MMM-RescueTime", {
	defaults: {
		interval: 60,
		pointBackgroundColor: "#fff",
		borderColor: "rgba(255,255,255,0.5)",
		backgroundColor: "rgba(255,255,255,0.2)",
		angleLinesColor: "rgba(255,255,255,0.2)",
		gridLinesColor: "rgba(255,255,255,0.2)",
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "TODAY") {
			Log.info("Got rescuetime today data: " + this.name);
			this.today = payload;
			this.initialLoaded = true;
			this.updateDom(3000);
		}
	},

	start: function() {
		var self = this;
		self.today = {
			labels: [],
			dataSet: [],
		};
		self.initialLoaded = false;
		self.sendSocketNotification("CONFIG", self.config);
		Log.info("Starting module: " + self.name);
		var seconds = self.config.interval * 1000;
		Log.info("RescueTime fetches every " + seconds + "seconds");
		window.setInterval(function() {
			self.sendSocketNotification("GET_TODAY");
		}, seconds);
	},

	getScripts: function() {
		return [this.file("node_modules/chart.js/dist/Chart.bundle.min.js")];
	},

	getDom: function() {
		let labels = this.today.labels;
		let dataSet = this.today.dataSet;
		let wrapper = document.createElement("div");
		let info = document.createElement("h1");
		info.style.fontSize = ".8em";
		info.style.fontWeight = "lighter";
		if(!this.initialLoaded) {
			info.innerHTML = "Loading...";
			wrapper.appendChild(info);
			return wrapper; 
		}
		if(this.initialLoaded && (labels.length === 0 || dataSet.length === 0)) {
			info.innerHTML = "No data available yet";
			wrapper.appendChild(info);
			return wrapper; 	
		}
		let ctx = document.createElement("canvas");
		wrapper.appendChild(ctx);
		let data = {
			labels: labels,
			datasets: [
				{
					pointBackgroundColor: this.config.pointBackgroundColor,
					borderColor: this.config.borderColor,
					backgroundColor: this.config.backgroundColor,
					data: dataSet,
				},
			],
		};
		new Chart(ctx, {
			type: "radar",
			data: data,
			options: {
				legend: {
					display: false,
				},
				scale: {
					angleLines: {color: this.config.angleLinesColor},
					gridLines: {color: this.config.gridLinesColor},
					ticks: {
						backdropColor: "black",
						fontSize: 15,
						backdropPaddingX: 5,
						backdropPaddingY: 5,
						fontColor: "#fff",
					},
				},
			},
		});
		return wrapper;
	},
});
