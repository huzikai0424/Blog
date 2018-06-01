/**
 * title:站点主标题
 * subtitle:副标题
 * keywords:网站关键词
 * description:网站描述
 * icon:站点icon
 * 
 * avatar:个人头像
 * nickname:博主昵称
 * description:博主描述
 * ICP:ICP备案号
 * copyright:页脚信息
 * 
 * blogAge:博客运行时间
 * showProgress:显示顶部进度条
 * 
 * orderBy:文章排序
 * desc:是否降序
 */


module.exports ={
    seo:{
        title:"痴情的小五",
        subtitle:"记录生活，分享感动。",
        keywords:"个人博客,生活,记录,代码",
        description:"记录生活，分享感动。",
        icon:"https://cherryml.com/wp-content/uploads/2017/07/favicon.png"
    },
    themeOptions:{
        avatar:"/images/avatar.jpg",   
        nickname:"柠檬酸",    
        description:"最强咸鱼...",
        ICP:"浙ICP备16046701号",
        copyright:"© 2018 痴情的小五 "
    },
    personalOptions:{
        blogAge:"2018/09/24",
        showProgress:false
    },
    contact:{
        qq:"380476852",
        wechat:"hzk0424",
        weibo:"https://weibo.com/p/1005055758170434",
        github:"https://github.com/huzikai0424"
    },
    article:{
        orderBy:"postTime",
        desc:true,
        pageSize:10
    },
    comment:{
        orderBy: "timestamp",
        desc: true,
        pageSize: 10
    }

}