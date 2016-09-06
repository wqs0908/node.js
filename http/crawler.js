// HTTP网络爬虫(爬出有效信息)

var http  = require('http');
var cheerio = require('./node_modules/cheerio/lib/cheerio');

var url = 'http://www.imooc.com/learn/348';

function filterChapters(html){
	// cheerio 像jquery一样，可以装载操作html
	var $ = cheerio.load(html);
	var chapters = $('.mod-chapters');

	var courseData = [];
	chapters.each((index,item) => {
        var chapter = $(item);
        var chapterTitle = chapter.find('strong').text();
        var videos = chapter.find('.video').children('li');
        var chaptData = {
            chapterTitle:chapterTitle,
            videos: []
        }

        videos.each((index,item) => {
            var video = $(item).find('.J-media-item');
            var videoTitle = video.text();
            // split方法为字符串分割
            var id = video.attr('href').split('video/')[1];

            chaptData.videos.push({
                title: videoTitle,
                id: id
            })
        })

    courseData.push(chaptData);

    });

	return courseData;


}


function printCourseInfo(course){
	course.forEach(function(item){
		var chapterTitle = item.chapterTitle;
		console.log(chapterTitle+'\n');

		item.videos.forEach(function(video){
			console.log(' 【'+video.id+'】'+video.title+'\n');
		})
	})

	
}

http.get(url,function(res){
	// 默认html变量为一个空值
	var html = '';

	/*这是一个监听函数，每当有data事件加载，回调函数就会被触发。然后将data数据加载到html变量后面*/
	res.on('data',function(data){
		html += data;	
	});

	/*这是一个监听函数，当res的end事件被触发，就会打印出html变量*/
	res.on('end',function(){
		var courseData = filterChapters(html);
		printCourseInfo(courseData);
	});


}).on('error',function(){
	console.log('获取课程失败');
});