"use strict";

module.exports = class JisInfo {
  constructor(arr) {
    this.pref_code = arr[0]
    this.jis_code = arr[2]
    this.area_code = arr[4]

    this.pref = arr[1]
    this.citytown = arr[3]
    this.area = arr[5]

    this.lat = arr[6]
    this.lng = arr[7]
  }
}
