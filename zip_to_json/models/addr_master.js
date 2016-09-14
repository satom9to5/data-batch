'use strict';

const Zip = require('./zip')
    ;

class AddrMaster {
  constructor() {
    this.pref_name_pattern = "";
    this.pref_patterns = {};
    
    this.cityTownMatch = AddrMaster.cityTownMatch();
  }

  addPrefPattern(zip) {
    if (!(zip instanceof Zip)) {
      return;
    }

    const pref = zip.names.pref;
    if (!this.pref_patterns.hasOwnProperty(pref)) {
      this.pref_patterns[pref] = {};
    }

    const jis_code = zip.jis_code;
    const citytown = zip.names.citytown;
    const prefPattern = this.pref_patterns[pref];

    const cityTown = this.cityTownMatch(citytown);

    if (prefPattern.hasOwnProperty(citytown) && prefPattern[citytown].indexOf(jis_code) === -1) {
      prefPattern[citytown].push(jis_code); 
    } else {
      prefPattern[citytown] = [jis_code];
    }

    Object.keys(cityTown).forEach(key => {
      if (key == 'county') {
        return;
      }

      const val = cityTown[key];

      switch (true) {
      case (!val):
      case (key == 'city' && cityTown['ward'] != ''):
        return;
      }

      if (!prefPattern.hasOwnProperty(val)) {
        prefPattern[val] = [jis_code];
      } else if (prefPattern[val].indexOf(jis_code) === -1) {
        prefPattern[val].push(jis_code); 
      }
    });
  }

  static cityTownMatch() {
    const patternFuncs = [
      // 町村
      (citytown) => {
        const matches = (/^(.+郡)?(.+(町|村))?$/g).exec(citytown);      
        if (!matches) {
          return null;
        }

        return {
          county: matches[1],
          town: matches[2],
        };
      },
      // 政令指定都市
      (citytown) => {
        const matches = (/^(.+市)?(.+区)?$/g).exec(citytown);      
        if (!matches) {
          return null;
        }

        return {
          city: matches[1],
          ward: matches[2],
        };
      },
      // 市及び東京23区
      (citytown) => {
        return {
          town: citytown,
        };
      },
    ];

    return (citytown) => {
      let cityTownObj = {
        city: '',
        ward: '',
        county: '',
        town: '',
      }

      for (let func of patternFuncs) {
        const result = func(citytown);
        if (result) {
          cityTownObj = Object.assign({}, cityTownObj, result)
          break;
        }
      }

      return cityTownObj;
    }
  }
}

module.exports = AddrMaster;
