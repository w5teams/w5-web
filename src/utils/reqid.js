"use strict";

export default {
  data() {
    return {
    };
  },
  GetRequestId() {
    var date = new Date();
    var seperator1 = "";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;

    var num = "";
    for (var i = 0; i < 4; i++) {
      num += Math.floor(Math.random() * 10);
    }

    var requestid = "99" + currentdate + num;
    return requestid;
  }
};
