// 기타모듈들을 추출합니다.
var fs = require("fs");
var http = require("http");
var feed = require('feed-read');  // require the feed-read module
var express = require("express");

// 서버를 생성합니다.
var app = express();

// 미들웨어를 설정합니다.
app.use(express.cookieParser()); // cookie 데이터를 추출
app.use(express.bodyParser()); // post 요청 데이터를 추출
app.use(app.router);

// 서버를 실행합니다.
http.createServer(app).listen(50024,function() {
	console.log("RSS 크롤링 웹서버가 http://127.0.0.1:50024 에서 동작하고 있습니다.");
});

app.all('/rss', function(req, res, next) {  
	res.header("Access-Control-Allow-Origin", "*");  
	res.header("Access-Control-Allow-Headers", "X-Requested-With");  
	next(); 
});
	

// 라우트를 수행합니다.
app.get("/rss",function(request,response,next) {
	var resultObj = {};
	resultObj["category"] = request.param("category");
	resultObj["rssAddress"] = request.param("rssAddress");
	resultObj["blogUrl"] = request.param("blogUrl");
	resultObj["title"] = request.param("blogName");
	resultObj["description"] = request.param("blogDescription");
	resultObj["articles"] = [];
	
	console.log(resultObj.rssAddress);

	feed(resultObj.rssAddress, function(err, articles) {
		// 최대 3개로 제한
		var limit = 3;
		if(articles) {
			for(var i=0;i<articles.length;i++) {
				if(i>=limit) {
					break;
				}
				var contentObj = extractContentPreview(articles[i].content);
				var articleObj = {
					title: articles[i].title,
					content: contentObj.content,
					imgUrl: contentObj.imgUrl,
					published: articles[i].published,
					link : articles[i].link
				};
				resultObj["articles"].push(articleObj);
			}
		}
		response.send(resultObj);
	});
	
function extractContentPreview(content) {
	
	if(content.indexOf("<img")!=-1) {
        var cropIndex = content.indexOf("<img");
        var cropEndIndex = content.indexOf("/>", cropIndex);
        var partialImgTag = content.substring(cropIndex,cropEndIndex);
        cropIndex = partialImgTag.indexOf("src=\"");
        partialImgTag = partialImgTag.substring(cropIndex+5);
		var imgUrl = partialImgTag.split("\"")[0];

	}
//	console.log(getImages(content));
        		       	
	var resultStr = content;
	var removeTagArray = ["img","object","hr","span","p","b","i","I","P","div","a","iframe","strong","ul","article","link","table","tbody","tr","td","em","style","h1","h2","h3","h4","h5","blockquote","li"];
	
	for(var i in removeTagArray) {
		resultStr = removeTag(resultStr,removeTagArray[i]);	
	}	

		//console.log(resultStr);
  	resultStr = resultStr.replace(/<br\s\/>/, '');	
  	resultStr = resultStr.replace(/<br\/>/, '');	
  	resultStr = resultStr.replace("모바일 페이지", '');	
	

  	resultStr = resultStr.replace(/\r/gi, '');	
  	resultStr = resultStr.replace(/\n/gi, '');
  	resultStr = resultStr.replace(/\t/gi, '');
	resultStr = resultStr.replace(/&nbsp;/gi,"");

//이미지주소배열 얻기 
function getImages(htmlString){
	var imageArray = [];
	while(htmlString.indexOf("<img")!=-1) {
        var cropIndex = content.indexOf("<img");
        var cropEndIndex = content.indexOf("/>", cropIndex);
        var partialImgTag = content.substring(cropIndex,cropEndIndex);
        cropIndex = partialImgTag.indexOf("src=\"");
        partialImgTag = partialImgTag.substring(cropIndex+5);
		var imgUrl = partialImgTag.split("\"")[0];
		imageArray.push(imgUrl);
	}	
	return imageArray;
}		       
  	
// 스크립트 태그 제거  
 function removeTag(source,tagName) {
 	var resultStr = source;
 	var startStr = "<"+tagName;
 	var endStr = ">";
    while (resultStr.indexOf(startStr)>-1)
    {
        var replaceIndex = resultStr.indexOf(startStr);
        var replaceEndIndex = resultStr.indexOf(endStr, replaceIndex);
		var before = resultStr.slice(0,replaceIndex);
		var after = resultStr.slice(replaceEndIndex+endStr.length,resultStr.length);
		resultStr = before + after;
    } 	
  	var startStr = "</"+tagName;
 	var endStr = ">";
    while (resultStr.indexOf(startStr)>-1)
    {
        var replaceIndex = resultStr.indexOf(startStr);
        var replaceEndIndex = resultStr.indexOf(endStr, replaceIndex);
		var before = resultStr.slice(0,replaceIndex);
		var after = resultStr.slice(replaceEndIndex+endStr.length,resultStr.length);
		resultStr = before + after;
    } 	  
    return resultStr;
 }
 
   
    resultStr = resultStr.substr(0, 600);
    
    			
	return {"content":resultStr,"imgUrl":imgUrl};
}

});

app.all('/rss/FatchFeeds', function(req, res, next) {  
	res.header("Access-Control-Allow-Origin", "*");  
	res.header("Access-Control-Allow-Headers", "X-Requested-With");  
	next(); 
});
app.get("/rss/FatchFeeds",function(request,response,next) {
	var callback = request.param("callback");
	var feedArray = [
	    { 
	        category: "GAME",
	        rssAddress:"http://web2.ruliweb.daum.net/daum/rss.htm?bbs=1&id=547&bbsId=G007&c1=6&c2=5",
	        blogUrl:"http://bbs1.ruliweb.daum.net/gaia/do/ruliweb/default/news/547/list?bbsId=G007",
	        blogName: "루리웹",
	        blogDescription:"리뷰/읽을거리"
	    },
	    { 
	        category: "UX/UI",
	        rssAddress:"http://story.pxd.co.kr/rss",
	        blogUrl:"http://story.pxd.co.kr",
	        blogName: "pxdUX Story",
	        blogDescription:"UX에 관한 진지하거나 시시한 수다의 장"
	    },
	    { 
	        category: "UX/UI",
	        rssAddress:"http://uxd.so/h/feed/",
	        blogUrl:"http://uxd.so/h/",
	        blogName: "H Hour",
	        blogDescription:"KTH 의 UX Design 팀 블로그"
	    },
	    { 
	        blogName: "Real UX blog",
	        rssAddress:"http://uxprocess.wordpress.com/feed/",
	        blogUrl:"http://uxprocess.wordpress.com/",
	        category: "UX/UI",
	        blogDescription:"5-6명의 팀 블로그. NHN Technology 사람들?"
	    },
	    { 
	        blogName: "All-round programmer - Unikys",
	        rssAddress:"http://unikys.tistory.com/rss",
	        blogUrl:"http://unikys.tistory.com",
	        category: "PROGRAMMING",
	        blogDescription:"C, C++, JAVA, objective-c, android sdk, asp, jsp, php, jquery, html5, javascript, and more.."
	    },
	    { 
	        blogName: "hello world",
	        rssAddress:"http://helloworld.naver.com/rss",
	        blogUrl:"http://helloworld.naver.com/helloworld",
	        category: "PROGRAMMING",
	        blogDescription:"NHN 개발자 블로그"
	    },
	    { 
	        blogName: "kth 개발자 블로그",
	        rssAddress:"http://feeds.feedburner.com/devparan?format=xml",
	        blogUrl:"http://dev.kthcorp.com",
	        category: "PROGRAMMING",
	        blogDescription:"개발자가 행복한 회사"
	    },
	    { 
	        blogName: "Codrops",
	        rssAddress:"http://feeds.feedburner.com/tympanus?format=xml",
	        blogUrl:"http://tympanus.net/codrops/",
	        category: "FRONTEND",
	        blogDescription:"web design and development blog"
	    },
	    {	
		    blogName: "Sugoru",
		    rssAddress:"http://feeds.feedburner.com/Sugoru?format=xml",
		    blogUrl:"http://sugoru.wordpress.com",
		    category: "IT/BIZ",
		    blogDescription: "I’m a Sociologist based in Barcelona (Spain)."
	    },
	    {	
		    blogName: "UNDER THE RADAR",
		    rssAddress:"http://undertheradar.co.kr/feed/",
		    blogUrl:"http://undertheradar.co.kr",
		    category: "IT/BIZ",
		    blogDescription: "'IT, 걸리면 잡는다' 투자정보지의 내용, 매거진의 마인드."
	    },
	    {	
		    blogName: "Back to the Mac",		    
		    rssAddress:"http://macnews.tistory.com/rss",
		    blogUrl:"http://macnews.tistory.com",
		    category: "MAC",
		    blogDescription: "맥과 관련된 소식과 정보를 엄선하였습니다."
	    },/*
	    {	
		    blogName: "KMUG",
		    rssAddress:"http://kmug.co.kr/board/kmug_rss.php?id=column",
		    blogUrl:"http://kmug.co.kr/board/zboard.php?id=column",
		    category: "MAC",
		    blogDescription: "컬럼"
	    },*/
	    {	
		    blogName: "클리앙",
		    rssAddress:"http://feeds.feedburner.com/Clien--news",
		    blogUrl:"http://clien.net/cs2/bbs/board.php?bo_table=news",
		    category: "IT/BIZ",
		    blogDescription: "새소식"
	    }
	];
	response.send(callback+"("+JSON.stringify(feedArray)+");");
});