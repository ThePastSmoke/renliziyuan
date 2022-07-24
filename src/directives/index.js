// 自定义指令
export const imgError = {
  inserted(el, options) {
    // 当图片保存的时候回进去调用onerror这个函数
    el.onerror = function() {
      // 当报错后把图片修改能本地的图片
      el.src = options.value
    }
  }
}

export const focus = {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el) {
    // 聚焦元素
    el.focus()
  }
}
