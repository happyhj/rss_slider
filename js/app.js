var App = (function (obj) {
	// 하나의 글
	function Article(articleObj) {
	    this.title = articleObj.title.replace(" –", "<br/>-").replace(" -", "<br/>-").replace(")-", ")<br/>-");
	    this.content = articleObj.content.trim();
	    this.imgUrl = articleObj.imgUrl;
		this.link = articleObj.link;
	}
	Article.prototype = {
	
	};
	
	function Blog(blogObj) {
	    this.title = blogObj.title;
	    this.description = blogObj.description;
	    this.articles = [];
	}
	Blog.prototype = {
		updateWithBlogArticles: function(articleArray) {
			//console.log("블로그 쨔응이 새 기사들 잘받았대요!");
			// RSS로 받아온 기사 전체를 일단 덮어쓰기로 한다 ㅠ
			// 그래도 넣을 때는 기사객체로 만들어서 넣어야징 
			for (var i in articleArray) {
				var article = new Article(articleArray[i]);
                var newArticle = {
	               title: article.title,
	               content: article.content,
	               imgUrl: article.imgUrl,
	               link: article.link
                };                      
				this.articles.push(newArticle);
			}
		},
	};
	
	function Category(categoryName) {
	    this.name = categoryName; // "UX","BIZ","FRONTEND" 중 하나만!! 가짐.
	    this.blogs = [];  
	}
	Category.prototype = {
		updateWithBlogArticles: function(blogArticlesObj) {
			//console.log("카테고리 쨔응이 자료 잘받았대요!");
			// 받은 자료의 블로그를 확인하고 이미 있다면 해당 블로그 객체에 글들을넘긴다.

			var isAlreadyExisting = false;
			for (var i in this.blogs) {
				if(this.blogs[i].title === blogArticlesObj.title) {
					console.log("이미 존재하는 블로그의 기사뭉치군요.");
					this.blogs[i].updateWithBlogArticles(blogArticlesObj.articles);
					isAlreadyExisting = true;
				}
			}
            
			if(!isAlreadyExisting) {
				// 없는 블로그라면 블로그를 추가한다.
				console.log("왓! 새로운 블로그니까 추가할게요.");
				var newBlog = new Blog(blogArticlesObj);
				newBlog.updateWithBlogArticles(blogArticlesObj.articles);
				this.blogs.push(newBlog);		
			}
		}	
	};
	
	function Collection(dataArray) {
	    this.Categories = [];
	    this.currentCategoryIndex = 0;
	    this.currentBlogIndex = 0;
//	    this.currentArticleIndex = 0;
	    
	    this.init(dataArray);
	}
	Collection.prototype = {
		init: function(dataArray) {
			for (var i in dataArray) {
				this.updateWithBlogArticles(dataArray[i]);
			}
		},
		updateWithBlogArticles: function(blogArticlesObj) {
			//	console.log("콜렉션 쨔응이 자료 잘받았대요!");
			// 받은 자료의 카테고리를 확인하고 이미 있다면 해당 카테고리 객체에 넘긴다.


			var isAlreadyExisting = false;
			for (var i in this.Categories) {
				if(this.Categories[i].name === blogArticlesObj.category) {
					console.log("이미 존재하는 카테고리의 기사뭉치군요.");
					this.Categories[i].updateWithBlogArticles(blogArticlesObj);
					isAlreadyExisting = true;
				}
			}
			if(!isAlreadyExisting) {	
			// 없는 카테고리라면 카테고리를 추가한다.
				console.log("왓! 새로운 카테고리니까 추가할게요.");
				var newCategory = new Category(blogArticlesObj.category);
				newCategory.updateWithBlogArticles(blogArticlesObj);
				this.Categories.push(newCategory);
			}
		},
        selectPreviousBlog: function(blogs) {
            // 모든 블로그
            if(this.currentBlogIndex == 0) {
 
            } else {
                this.currentBlogIndex += -1;
            }
            // 이제 이 블로그 인덱스에 맞춰서  카테고리 인덱스를 업데이트하자.
            this.updateCategoryIndex();
            console.log("categoryIdx: " +this.currentCategoryIndex);           
            console.log("blogIdx: " +this.currentBlogIndex);
        },
        selectNextBlog: function() {
            // 모든 블로그
            var blogs = this.getWholeBlogs();
             
            if(this.currentBlogIndex === (blogs.length - 1)) {
  	
            } else {
                this.currentBlogIndex += 1;
            }
            blogs = this.getWholeBlogs();
            // 이제 이 블로그 인덱스에 맞춰서  카테고리 인덱스를 업데이트하자.
            this.updateCategoryIndex();
            //console.log("categoryIdx: " +this.currentCategoryIndex);           
            //console.log("blogIdx: " +this.currentBlogIndex);
        },
        selectNthBlog: function(idx) {             
            this.currentBlogIndex = parseInt(idx);
            // 이제 이 블로그 인덱스에 맞춰서  카테고리 인덱스를 업데이트하자.
            this.updateCategoryIndex();
            //console.log("categoryIdx: " +this.currentCategoryIndex);           
            //console.log("blogIdx: " +this.currentBlogIndex);
        },
        selectNthCategory: function(idx){
        	var oldIdx = this.currentCategoryIndex;
        	var newIdx = parseInt(idx);
            this.currentCategoryIndex = newIdx;     
	        this.updateBlogIndex(oldIdx,newIdx);
        },
        updateCategoryIndex: function(){
            var catgoryIndex = -1;
            var blogIndex = 0;
            for(var i in this.Categories) {
				for(var j in this.Categories[i].blogs) {
					if( this.currentBlogIndex == blogIndex ) {

                        catgoryIndex = i;
                        break;
                    }
                    blogIndex++;
				}
                if(catgoryIndex != -1)
                    break;
			}  
            this.currentCategoryIndex = catgoryIndex;       
        },
        updateBlogIndex: function(oldIdx,newIdx){
            var catgoryIndex = -1;
            var blogIndex = 0;
            if(parseInt(oldIdx) != parseInt(newIdx) ) {
	            for(var i in this.Categories) {
					if(i != parseInt(newIdx)) {
						blogIndex += this.Categories[i].blogs.length;
					} else {	
						if(parseInt(newIdx)<parseInt(oldIdx)) {
							blogIndex += (this.Categories[i].blogs.length-1);
						}
						break;
					}
				} 
			} else {
				blogIndex = this.currentBlogIndex;
			}
//			alert("newIdx: "+newIdx+ "blogIndex: "+blogIndex);
            this.currentBlogIndex = blogIndex;       
        },
        getWholeBlogs: function() {
			var blogs = [];
			for(var i in this.Categories) {
				for(var j in this.Categories[i].blogs) {
					blogs.push(this.Categories[i].blogs[j]);
				}
			}    
            return blogs;            
        },
	};


	// 모든 뷰를 생성하고 관리하는 뷰 컨트롤러를 만든다.
	function ViewController(Obj) { // 테스트로 모델과 엘리먼트를 하드코딩 해 넣는다.        
        this.model = Obj.model;
        
        this.categoryNameContainer = Obj.el.categoryName;
        this.blogNameContainer = Obj.el.blogName;
        this.articleBoxesContainer = Obj.el.articleBoxes;      
        
        this.categoryNameItemTemplate = document.getElementById("categoryNameItem-template").innerHTML;
        this.blogNameItemTemplate = document.getElementById("blogNameItem-template").innerHTML;
        this.articleItemTemplate = document.getElementById("articleItem-template").innerHTML;

        this.init(); 
 		this.registerEvents();
    }

    ViewController.prototype = { // 컨스트럭터 따로 선언해 줘야함 
        init: function () { 
	        this.generateElements();
        },
        registerEvents: function() {
            document.addEventListener("click",this.clickMove.bind(this),false);
            document.addEventListener("keydown",this.controlSlider.bind(this),false);
            document.addEventListener("mousewheel", this.controlSlider.bind(this), false);
        },
        controlSlider: function(e) {
            // 원하는 이벤트인지 검사 후 모델 조작.
            if(e.target.id == "left" || e.keyCode == 37 || e.wheelDelta >=60) {
                this.model.selectPreviousBlog();
            } else if(e.target.id == "right" || e.keyCode == 39 || e.wheelDelta <= -60) {
                this.model.selectNextBlog();
            } else {
                return;
            }   

            console.log("이벤트발생");

            this.render();	
        },
        clickMove: function(e) {
            // 원하는 이벤트인지 검사 후 모델 조작.
			if(e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-blogindex")) {
				this.model.selectNthBlog(e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-blogindex"));
				//this.model.updateCategoryIndex();
			} else if(e.target.parentNode.parentNode.getAttribute("data-blogidx")|e.target.parentNode.getAttribute("data-blogidx")) {
				this.model.selectNthBlog(e.target.parentNode.parentNode.getAttribute("data-blogidx")|e.target.parentNode.getAttribute("data-blogidx"));
			} else if(e.target.parentNode.parentNode.getAttribute("data-categoryidx")){
				this.model.selectNthCategory(e.target.parentNode.parentNode.getAttribute("data-categoryidx"));
			} else {
				return;   
			}
            console.log("이벤트발생");

            this.render();	
        },
        updateWidths: function() {       
            // 기준이되는 앨리먼트의 폭에 맞춰 각 아이템과 총 슬라이드의 폭을 초기화합니다.
            var categoryStdWidth = this.getViewportWidth(this.categoryNameContainer);
            var blogNameStdWidth = this.getViewportWidth(this.blogNameContainer);
            var ArticleBoxStdWidth = this.getViewportWidth(this.articleBoxesContainer);
            
            //console.log("카테고리 아이템의 단위폭은 "+categoryStdWidth+" 입니다.");
            this.updateListContainerWidth(categoryStdWidth,this.categoryNameContainer);
            
            //console.log("블로그 타이틀 아이템의 단위폭은 "+blogNameStdWidth+" 입니다.");
            this.updateListContainerWidth(blogNameStdWidth,this.blogNameContainer);
              
            //console.log("기사박스 아이템의 단위폭은 "+ArticleBoxStdWidth+" 입니다.");
            this.updateListContainerWidth(ArticleBoxStdWidth,this.articleBoxesContainer);
        },			
        getViewportWidth: function (element) {
            var defaultWidth = parseInt(window.getComputedStyle(element,null).width,10);
            return defaultWidth;		
        },
        updateListContainerWidth: function (defaultWidth,itemContainerElement) { // UL 엘리먼트의 width를 내용 li 엘리먼트의 수에 맞춰 조정한다.
            var numberOflist = itemContainerElement.querySelectorAll("ul>li.sliderItem").length;
            itemContainerElement.querySelector("ul").style.width = (defaultWidth*numberOflist)+"px";

            var viewportWidth = defaultWidth;
            [].forEach.call(
                itemContainerElement.querySelectorAll("li.sliderItem"), 
                function(el){
                    el.style.width = viewportWidth + "px";
                }
            );  
          
        },
		render: function() { // 모델에 의거한 CSS 업데이트. 슬라이더 위치
            console.log("새 CSS로 렌더링합니다.");
            // 기사박스 
            var ulElement = this.articleBoxesContainer.querySelector("ul");
            var newUlLeft = -1 *  this.model.currentBlogIndex * this.getViewportWidth(this.articleBoxesContainer);
            ulElement.style.left = newUlLeft + "px";

            // 블로그제목 
            var ulElement = this.blogNameContainer.querySelector("ul");
            var newUlLeft = -1 *  this.model.currentBlogIndex * this.getViewportWidth(this.blogNameContainer);
            ulElement.style.left = newUlLeft + "px";

            // 카테고리제목 
            var ulElement = this.categoryNameContainer.querySelector("ul");
            var newUlLeft = -1 *  this.model.currentCategoryIndex * this.getViewportWidth(this.categoryNameContainer);
            ulElement.style.left = newUlLeft + "px";
            
            this.updateWidths();
            this.updateBackgroundPosition();
		},
		updateBackgroundPosition: function() {
			// 현재블로그의 수 
			var numberOfBlogs = this.model.getWholeBlogs().length;
			var wallpaperWidth = 2560;
			var currnetBlogIndex = this.model.currentBlogIndex;
			var bodyElement = document.querySelector("body");
			bodyElement.style.backgroundPositionX = "-"+(2560/numberOfBlogs)*currnetBlogIndex/3 + "px";
			//alert(bodyElement.style.backgroundPositionX);
		},
        generateElements: function() {
        	//// 모델에 있는 아이템을 li 로 만들어서 el 컨테이너에 삽입한다.
			var categories = this.model.Categories;
        	// 먼저 카테고리,
			var liCompiler = $.getTemplateCompiler(this.categoryNameItemTemplate);		
			this.categoryNameContainer.querySelector("ul").innerHTML = "";
			for(var i=0;i<categories.length;i++) {
				(function(here,index){
					var thisElem = here;
					var idx = index;
					//console.log(idx);
					thisElem.categoryNameContainer.querySelector("ul").insertAdjacentHTML('beforeend', liCompiler({"categoryName":categories[idx].name,"categoryindex":idx}));
				}(this,i));
			}
			
			// 그 다음엔 블로그 제목들 
			var blogs = this.model.getWholeBlogs();

			liCompiler = $.getTemplateCompiler(this.blogNameItemTemplate);		
			this.blogNameContainer.querySelector("ul").innerHTML = "";
			for(var i=0;i<blogs.length;i++) {
				(function(here,index){
					var thisElem = here;
					var idx = index;
					thisElem.blogNameContainer.querySelector("ul").insertAdjacentHTML('beforeend', liCompiler({"name":blogs[idx].title,"description":blogs[idx].description,"blogindex":idx}));
				}(this,i));
			}	
           
			// 마지막으로 기사 박스 & 채워진 내용들 
			var articleLiCompiler = $.getTemplateCompiler(this.articleItemTemplate);

			this.articleBoxesContainer.querySelector("ul").innerHTML = "";
            for(var i=0;i<blogs.length;i++) {
                var ul = document.createElement("ul");
                var div = document.createElement("div"); div.appendChild(ul);
                var boxElement = document.createElement("li"); 
                boxElement.setAttribute("class","sliderItem");
  
				(function(i){ 
					var idx = i; 
                	boxElement.setAttribute("data-blogindex",idx);
                }(i));

                boxElement.appendChild(div);

                for(var j=0;j<blogs[i].articles.length;j++) {
                    var article = blogs[i].articles[j];
					var itemStr = articleLiCompiler({"title":article.title,"content":article.content,"imageUrl":article.imgUrl,"link":article.link});
					
				 	var startStr = "<div";
				 	var endStr = "/div>";
				    while (itemStr.indexOf(startStr)>-1)
				    {
				        var replaceIndex = itemStr.indexOf(startStr);
				        var replaceEndIndex = itemStr.indexOf(endStr, replaceIndex);
						var before = itemStr.slice(0,replaceIndex);
						var after = itemStr.slice(replaceEndIndex+endStr.length,itemStr.length);
						itemStr = before + after;
				    } 	
			    
	              boxElement.querySelector("div>ul").insertAdjacentHTML('beforeend', itemStr);

                
                }
				this.articleBoxesContainer.querySelector("ul").insertAdjacentHTML('beforeend', boxElement.outerHTML);
            }
            this.render();

        }
    };  


	var myApp = function(){					

		this.model = new Collection();
		this.viewController = new ViewController(
		{
			"model": this.model,
			"el": {
				"categoryName": document.querySelector(".categoryNameContainer"),
				"blogName": document.querySelector(".blogNameContainer"),
				"articleBoxes": document.querySelector(".articleBoxContainer"),			
			}
		});

	};
	myApp.prototype = {
		addBlogArticles: function(blogArticlesObj) {
			this.model.updateWithBlogArticles(blogArticlesObj);

			console.log("모델에 추가는 했고");

			this.viewController.init();
		},
		fatchFeeds: function(feedArray) {
			//console.log("야!");
			var thisApp = this;
			var successCounter = 0;
		    for(var index in feedArray) {
		        (function(){
		            var i =index;
		            var request = new XMLHttpRequest();      
		            var url ="http://www.heej.net:50024/rss";
		            url +=  "?"+serializeObject(feedArray[i]);
		            request.open("get" , url , true);
		            request.send(null);
		            request.onreadystatechange = (function() {
		                if (request.readyState == 4 && request.status == 200 ) {
		                    successCounter++;
		                    result = JSON.parse(request.responseText);
		                   // console.log(this.model.getWholeBlogs().length);
		                    
		                    this.addBlogArticles(result);	
							
							if(successCounter===feedArray.length) {
								// 마지막 요청이 완료되었을 때 실행하고 싶은것을 넣는다.
								//alert("대다나다"); 	
								console.log(JSON.stringify(this.model));
							}		                    
		                }
		            }).bind(thisApp);		                    
		        }());
		    }   			
		}
	};
	
	return myApp;
}());