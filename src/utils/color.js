// rgb转16进制
export function rgbToHex(rgb) {
  const reg = /^(rgb|RGB)/;
  let color = rgb
  if (reg.test(color)) {
    var strHex = "#"
    var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",")
    for (var i = 0; i < colorArr.length; i++) {
      var hex = Number(colorArr[i]).toString(16)
      if (hex === "0") {
        hex += hex
      }
      strHex += hex
    }
    return strHex
  } else {
    return String(color)
  }
}

// 16进制转rgb
export function hexToRgb(hex){
  var sColor = hex.toLowerCase();
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
          var sColorNew = "#";
          for (var i = 1; i < 4; i += 1) {
              sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
          }
          sColor = sColorNew;
      }
      var sColorChange = [];
      for (var i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
      }
      return {
        R: sColorChange[0],
        G: sColorChange[1],
        B: sColorChange[2],
        RGB: "RGB(" + sColorChange.join(",") + ")"
      };
  }
  return sColor;
}

// rgb转hsl
export function rgbToHsi(R, G, B) {
  const PI = Math.PI;
  var r, g, b, h, s, i;
  r = R / 255;
  g = G / 255;
  b = B / 255;
  i = (r + g + b) / 3;
  
  if (R == G && G == B){
    s = h = 0;
  }
  else {
    let w = (r - g + r - b) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b)) / 2;
    h = Math.acos(w) * 180 / PI;

    if (b > g)
      h = 360 - h;

    s = 1 - Math.min(r, g, b) / i;
  }

  return [parseFloat(h.toFixed(2)), parseFloat(s.toFixed(2)), parseFloat(i.toFixed(2))];
}

// 自动文字颜色
export function autoTextColor(color) {
  const RGB_REG = /^(rgb|RGB)/
  const HEX_REG = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  const WHITE = '#ffffff'
  const BLACK = '#333333'

  let colorObj = {}

  if(RGB_REG.test(color)) {
    colorObj = hexToRgb(rgbToHex(color))
  } else if(HEX_REG.test(color)) {
    colorObj = hexToRgb(color)
  } else {
    return WHITE
  }

  const HSI = rgbToHsi(colorObj.R, colorObj.G, colorObj.B)

  if(HSI[2] < 0.618) {
    return WHITE
  } else {
    return BLACK
  }
}