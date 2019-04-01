const TIMECOUNT = '_timecount'  //倒计时
/**
 * 消息处理器
 * res.type处理不同类型的请求
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
worker.onMessage(function (res) {

  switch (res.type) {
    case TIMECOUNT:
      worker.postMessage({
        type: TIMECOUNT,
        value: res.value+1
      })
      break;
    default:

  }

})
