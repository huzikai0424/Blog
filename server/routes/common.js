module.exports={
    // 设置cookie 
    setCookie:function(a, c) { var b = 30; var d = new Date(); d.setTime(d.getTime() + b * 24 * 60 * 60 * 1000); document.cookie = a + "=" + escape(c) + ";expires=" + d.toGMTString() },
    // 获取cookie
    getCookie: function(b){ var a, c = new RegExp("(^| )" + b + "=([^;]*)(;|$)"); if (a = document.cookie.match(c)) { return unescape(a[2]) } else { return null } },
    /**
     * 格式化时间： xxxx年xx月xx日
     */
    formatTime:function(time) {
        let date = new Date(time)
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let day = date.getDate()
        return `${year}年${month}月${day}日`
    },
    formatTimeToDay:function(time){
        let date = new Date(time)
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let minite = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        return `${year}-${month}-${day}  ${hour}:${minite}:${second}`
    },
    delHtmlTag:function(str) {
        return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
    }

}