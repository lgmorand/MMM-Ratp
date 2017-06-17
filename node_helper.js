/* Timetable for Paris local transport Module */
/* Magic Mirror
 * Module: MMM-Ratp
 *
 * By Louis-Guillaume MORAND
 * based on a script from Benjamin Angst http://www.beny.ch and Georg Peters (https://lane6.de)
 * MIT Licensed.
 */
const NodeHelper = require("node_helper");
const forge = require('node-forge');
const unirest = require('unirest');

module.exports = NodeHelper.create({

    updateTimer: "",
    start: function() {
        this.started = false;
        console.log("MMM-Ratp- NodeHelper started");
    },

    /* updateTimetable(transports)
     * Calls processTransports on succesfull response.
     */
    updateTimetable: function(url) {
        var self = this;
        var retry = false;

        // calling this API
        unirest.get(url)
            .end(function(r) {
                if (r.error) {
                    console.log(self.name + " : " + r.error);
                    retry = true;
                } else {
                    self.processTransports(r.body, url);
                }

                if (retry) {
                    console.log("retrying");
                    // self.scheduleUpdate((self.loaded) ? -1 : this.config.retryDelay);
                }
            });
    },

    // Help to retrieve a type which can be directly displayed inside the title of the module
    getSanitizedName: function(type) {
        var t = "";
        switch (type) {
            case "bus":
                t = "<i class='fa fa-bus' aria-hidden='true'></i> Bus";
                break;
            case "rers":
                t = "<i class='fa fa-train' aria-hidden='true'></i> RER";
                break;
            case "tramways":
                t = "<i class='fa fa-subway' aria-hidden='true'></i> Tramway";
                break;
            case "noctiliens":
                t = "<i class='fa fa-bus' aria-hidden='true'></i> Noctilien";
                break;
            case "metros":
                t = "<i class='fa fa-train' aria-hidden='true'></i> Metro";
                break;
            default:
                t = "";
        }

        return t;
    },

    /* processTransports(data)
     * Uses the received data to set the various values.
     */
    processTransports: function(data, url) {
        this.transports = [];
        this.lineInfo = "";
        for (var i = 0, count = data.result.schedules.length; i < count; i++) {

            var nextTransport = data.result.schedules[i];

            this.transports.push({
                name: nextTransport.destination,
                time: nextTransport.message
            });
        }
        this.loaded = true;
        
        this.sendSocketNotification("TRANSPORTS", {
            transports: this.transports,
            lineInfo: this.lineInfo,
            uniqueID: url
        });
    },


    socketNotificationReceived: function(notification, payload) {
         if (payload.debugging) {
            console.log("Notif received: " + notification);
            console.log(payload);
        }
        const self = this;

        if (notification === 'GETDATA') {
            self.updateTimetable(payload.apiURL);
        }
    }
});