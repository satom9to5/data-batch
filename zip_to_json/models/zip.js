"use strict";

class Zip {
  constructor(arr) {
    this.jis_code = arr[0];
    this.pos_code = arr[2];

    this.kana_names = {
      pref:     arr[3],
      citytown: arr[4],
      area:     arr[5],
    };

    this.names = {
      pref:     arr[6],
      citytown: arr[7],
      area:     arr[8],
    };

    this.has_multi_pos = arr[9];
    this.is_has_choume = arr[11];
    this.pos_is_multi_area = arr[12];
  }
}

module.exports = Zip;
