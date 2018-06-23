const mjAPI = require('mathjax-node-svg2png');

module.exports = {
  render : function(formula) {
    return mjAPI.typeset({
      math : formula,
      format : 'AsciiMath',
      png : true,
      scale : 2,
    });
  }
}
