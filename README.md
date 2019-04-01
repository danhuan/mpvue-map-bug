#mpvue-map 一个坑


.mpvue调用map组件，动态改变地图数据时，定位点、circle等会出现闪动现象；原因是mpvue与小程序更新数据不同步；需要手动更新vm中数据； regionchange事件闪动同理；