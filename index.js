(function (window, performance) {
  function checkKey(key) {
    if (performance.timing[key]) {
      return true;
    }
    return performance.getEntriesByName(key).length !== 0;
  }

  var quantify = {
    // helper method that can be chained
    mark: function (name) {
      performance.mark(name);
      return quantify;
    },
    measure: function (name, key1, key2) {
      if (checkKey(key1) && checkKey(key2)) {
        performance.measure(name, key1, key2);
      }
      return quantify;
    },
    values: function () {
      return performance.getEntriesByType('measure');
    }
  };

  if( typeof define === 'function' && (define.amd || define.ajs) ) {
    define('quantify', [], function () { return quantify; });
  } else {
    window.quantify = quantify;
  }
})(this,

// Based on the awesome User Timing polyfill from RubaXa <trash@rubaxa.org>
// https://gist.github.com/RubaXa/8662836
(function (window) {
  var startOffset = Date.now ? Date.now() : +(new Date());
  var performance = window.performance || {};
  var _entries = [];
  var _marksIndex = {};

  function _filterEntries (key, value) {
    var result = [];
    for(var i=0, n=_entries.length; i < n; i++ ) {
      if( _entries[i][key] === value ) {
        result.push(_entries[i]);
      }
    }
    return  result;
  }

  function _clearEntries (type, name) {
    var i = _entries.length;
    var entry;
    while ( i-- ) {
      entry = _entries[i];
      if (entry.entryType === type && (name === void 0 || entry.name === name)) {
        _entries.splice(i, 1);
      }
    }
  }

  if (!performance.now) {
    performance.now = performance.webkitNow || performance.mozNow || performance.msNow || function () {
      return (Date.now ? Date.now() : +(new Date())) - startOffset;
    };
  }

  if (!performance.mark) {
    performance.mark = performance.webkitMark || function (name) {
      var mark = {
        name: name,
        entryType: 'mark',
        startTime: performance.now(),
        duration: 0
      };
      _entries.push(mark);
      _marksIndex[name] = mark;
    };
  }

  if (!performance.measure) {
    performance.measure = performance.webkitMeasure || function (name, startMark, endMark) {
      startMark = _marksIndex[startMark].startTime;
      endMark   = _marksIndex[endMark].startTime;

      _entries.push({
        name: name,
        entryType: 'measure',
        startTime: startMark,
        duration: endMark - startMark
      });
    };
  }

  if (!performance.getEntriesByType) {
    performance.getEntriesByType = performance.webkitGetEntriesByType || function (type) {
      return _filterEntries('entryType', type);
    };
  }

  if (!performance.getEntriesByName) {
    performance.getEntriesByName = performance.webkitGetEntriesByName || function (name) {
      return _filterEntries('name', name);
    };
  }

  if (!performance.clearMarks) {
    performance.clearMarks = performance.webkitClearMarks || function (name) {
      _clearEntries('mark', name);
    };
  }

  if (!performance.clearMeasures) {
    performance.clearMeasures = performance.webkitClearMeasures || function (name) {
      _clearEntries('measure', name);
    };
  }

  return performance;

})(this));