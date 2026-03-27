/*
  Author: André Kreienbring
  Handles websocket messages that request a timeline.
*/
const db = require("@db/db.js");

/** 
  Handles messages sent by the frontend that are related timeline charts.
  @param {object} msg The message that was sent by the frontend.
  @returns {object} The (answer) message that will be send to the client
*/
function handle(msg) {
  /*
    If the Dashboard receives a websocket message from a Shelly device 
    (eg. NotifyStatus) it will ask for timeline data to print a chart.
    This data is fetched from the database and sent to the client.
  */
  const answer = {
    event: msg.event,
    source: "WSTimelineHandler",
    message: `OK! ${msg.event}`,
    requestID: msg.requestID,
    data: {},
  };
  if (msg.event === "timeline-get-Minute") {
    answer.data.rows = db.select(
      "cByMinute",
      [],
      [],
      [],
      null,
      "device_id, ts",
    );
  } else if (msg.event === "timeline-get-Hour") {
    answer.data.rows = db.select("cByHour", [], [], [], null, "ts");
  } else if (msg.event === "timeline-get-Day") {
    answer.data.rows = db.select("cByDay", [], [], [], null, "ts");
  } else if (msg.event === "timeline-get-Month") {
    answer.data.rows = db.select("cByMonth", [], [], [], null, "ts");
  } else if (msg.event === "timeline-get-Year") {
    answer.data.rows = db.select("cByYear", [], [], [], null, "ts");
  }
  if (typeof answer.data.rows !== "undefined") {
    return answer;
  } else return null;
}
module.exports = {
  handle,
};
