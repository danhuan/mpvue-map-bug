/* 
	*GYK
	*缓存方法二次封装，可设置失效时间
	设置缓存：  cache.put('key','value',20) 表示设置缓存失效时间为20秒；
	获取缓存：cache.get('key')  
	清除缓存：cache.remove('key')
	清除所有缓存：cache.clear()
 */

var dtime = '_deadtime';
function put(k, v, t) {
  wx.setStorageSync(k, v)
  var seconds = parseInt(t);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(k + dtime, timestamp + "")
  } else {
    wx.removeStorageSync(k + dtime)
  }
}
function get(k, def) {
  var deadtime = parseInt(wx.getStorageSync(k + dtime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) { return def; } else { return; }
    }
  }
  var res = wx.getStorageSync(k);
  if (res) {
    return res;
  } else {
    return def;
  }
}
function remove(k) {
  wx.removeStorageSync(k);
  wx.removeStorageSync(k + dtime);
}
function clear() {
  wx.clearStorageSync();
}
module.exports = {
  put: put,
  get: get,
  remove: remove,
  clear: clear,
}
