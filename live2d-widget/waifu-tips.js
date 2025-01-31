<link rel="stylesheet" class="aplayer-secondary-style-marker" href="/assets/css/APlayer.min.css"><script src="/assets/js/APlayer.min.js" class="aplayer-secondary-script-marker"></script><script class="meting-secondary-script-marker" src="/assets/js/Meting.min.js"></script><link rel="stylesheet" href="/owl.css">/*
 * https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02
 * https://www.fghrsh.net/post/123.html
 */

function loadWidget(waifuPath, apiPath) {
	localStorage.removeItem("waifu-display");
	sessionStorage.removeItem("waifu-text");
	$("body").append(`<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="300" height="300"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-paper-plane"></span>
				<span class="fa fa-lg fa-user-circle"></span>
				<span class="fa fa-lg fa-street-view"></span>
				<span class="fa fa-lg fa-camera-retro"></span>
				<span class="fa fa-lg fa-info-circle"></span>
				<span class="fa fa-lg fa-times"></span>
			</div>
		</div>`);
	$("#waifu").show().animate({ bottom: 0 }, 3000);

	function registerEventListener() {
		$("#waifu-tool .fa-comment").click(showHitokoto);
		$("#waifu-tool .fa-paper-plane").click(function() {
			var s = document.createElement("script");
			document.body.appendChild(s);
			s.src = "https://cdn.jsdelivr.net/gh/GalaxyMimi/CDN/asteroids.js";
		});
		$("#waifu-tool .fa-user-circle").click(loadOtherModel);
		$("#waifu-tool .fa-street-view").click(loadRandModel);
		$("#waifu-tool .fa-camera-retro").click(function() {
			showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
			Live2D.captureName = "photo.png";
			Live2D.captureFrame = true;
		});
		$("#waifu-tool .fa-info-circle").click(function() {
			open("https://github.com/stevenjoezhang/live2d-widget");
		});
		$("#waifu-tool .fa-times").click(function() {
			localStorage.setItem("waifu-display", new Date().getTime());
			showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
			$("#waifu").animate({ bottom: -500 }, 3000, function() {
				$("#waifu").hide();
				$("#waifu-toggle").show().animate({ "margin-left": -50 }, 1000);
			});
		});
		var re = /x/;
		console.log(re);
		re.toString = function() {
			showMessage("哈哈，你打开了控制台，是想要看看我的秘密吗？", 6000, 9);
			return "";
		};
		$(document).on("copy", function() {
			showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
		});
		$(document).on("visibilitychange", function() {
			if (!document.hidden) showMessage("哇，你终于回来了～", 6000, 9);
		});
	}
	registerEventListener();

	function welcomeMessage() {
		var SiteIndexUrl = location.port ? `${location.protocol}//${location.hostname}:${location.port}/` : `${location.protocol}//${location.hostname}/`, text; //自动获取主页
		if (location.href == SiteIndexUrl) { //如果是主页
			var now = new Date().getHours();
			if (now > 23 || now <= 5) text="你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？" ; else if (now> 5 && now <= 7) text="早上好！一日之计在于晨，美好的一天就要开始了。" ; else if (now> 7 && now <= 11) text="上午好！工作顺利嘛，不要久坐，多起来走动走动哦！" ; else if (now> 11 && now <= 14) text="中午了，工作了一个上午，现在是午餐时间！" ; else if (now> 14 && now <= 17) text="午后很容易犯困呢，今天的运动目标完成了吗？" ; else if (now> 17 && now <= 19) text="傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～" ; else if (now> 19 && now <= 21) text="晚上好，今天过得怎么样？" ; else if (now> 21 && now <= 23) text="["已经这么晚了呀，早点休息吧，晚安～"," "深夜时要爱护眼睛呀！"]; else ; } if (document.referrer !="=" "") { var referrer="document.createElement("a");" referrer.href="document.referrer;" domain="referrer.hostname.split(".")[1];" (location.hostname="=" referrer.hostname) style="color:#0099cc;">『${document.title.split(" - ")[0]}』`;
			else if (domain == "baidu") text = `Hello！来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">${referrer.search.split("&wd=")[1].split("&")[0]}</span> 找到的我吗？`;
			else if (domain == "so") text = `Hello！来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">${referrer.search.split("&q=")[1].split("&")[0]}</span> 找到的我吗？`;
			else if (domain == "google") text = `Hello！来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
			else text = `Hello！来自 <span style="color:#0099cc;">${referrer.hostname}</span> 的朋友`;
		}
		else {
			text = `欢迎阅读<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
		}
		showMessage(text, 7000, 8);
	}
	welcomeMessage();
	//检测用户活动状态，并在空闲时定时显示一言
	var userAction = false,
		hitokotoTimer = null,
		messageTimer = null,
		messageArray = ["已经过了这么久了呀，日子过得好快呢……", "大坏蛋！你都多久没碰人家了呀，嘤嘤嘤～", "嗨～快来逗我玩吧！", "拿小拳拳锤你胸口！"];
	if ($(".fa-share-alt").is(":hidden")) messageArray.push("记得把小家加入Adblock白名单哦！");
	$(document).mousemove(function() {
		userAction = true;
	}).keydown(function() {
		userAction = true;
	});
	setInterval(function() {
		if (!userAction) {
			if (!hitokotoTimer) hitokotoTimer = setInterval(showHitokoto, 25000);
		}
		else {
			userAction = false;
			clearInterval(hitokotoTimer);
			hitokotoTimer = null;
		}
	}, 1000);

	function showHitokoto() {
		//增加 hitokoto.cn 的 API
		if (Math.random() < 0.6 && messageArray.length > 0) showMessage(messageArray[Math.floor(Math.random() * messageArray.length)], 6000, 9);
		else $.getJSON("https://v1.hitokoto.cn", function(result) {
				var text = `这句一言来自 <span style="color:#0099cc;">『${result.from}』</span>，是 <span style="color:#0099cc;">${result.creator}</span> 在 hitokoto.cn 投稿的。`;
			showMessage(result.hitokoto, 6000, 9);
			setTimeout(function() {
				showMessage(text, 4000, 9);
			}, 6000);
		});
	}

	function showMessage(text, timeout, priority) {
		if (!text) return;
		if (!sessionStorage.getItem("waifu-text") || sessionStorage.getItem("waifu-text") <= 1 priority) { if (messagetimer) cleartimeout(messagetimer); messagetimer="null;" } (array.isarray(text)) text="text[Math.floor(Math.random()" * text.length)]; sessionstorage.setitem("waifu-text", priority); $("#waifu-tips").stop().html(text).fadeto(200, 1); sessionstorage.removeitem("waifu-text"); $("#waifu-tips").fadeto(1000, 0); }, timeout); function initmodel() var modelid="localStorage.getItem("modelId")," modeltexturesid="localStorage.getItem("modelTexturesId");" (modelid="=" null) 首次访问加载 指定模型 的 指定材质 模型 id 材质 loadmodel(modelid, modeltexturesid); $.getjson(waifupath, function(result) $.each(result.mouseover, function(index, tips) $(document).on("mouseover", tips.selector, function() ? tips.text[math.floor(math.random() tips.text.length)] : tips.text; $(this).text()); showmessage(text, 4000, 8); }); $.each(result.click, $(document).on("click", $.each(result.seasons, now="new" date(), after="tips.date.split("-")[0]," before="tips.date.split("-")[1]" || after; ((after.split(" ")[0] <="now.getMonth()" + && now.getmonth() (after.split(" ")[1] now.getdate() now.getfullyear()); 7000, true); messagearray.push(text); initmodel(); modeltexturesid) localstorage.setitem("modelid", modelid); (modeltexturesid="==" undefined) localstorage.setitem("modeltexturesid", loadlive2d("live2d", `${apipath} get ?id="${modelId}-${modelTexturesId}`," console.log(`live2d ${modelid}-${modeltexturesid} 加载完成`)); loadrandmodel() 可选 "rand"(随机), "switch"(顺序) $.ajax({ cache: false, url: rand_textures datatype: "json", success: (result.textures["id"]="=" 0)) showmessage("我还没有其他衣服呢！", 10); else showmessage("我的新衣服好看嘛？", result.textures["id"]); loadothermodel() switch loadmodel(result.model["id"]); showmessage(result.model["message"], initwidget(waifupath="/waifu-tips.json" , apipath ) (screen.width return; $("body").append(`<div style="margin-left: -100px;">
			<span>看板娘</span>
		`);
	$("#waifu-toggle").hover(function() {
		$("#waifu-toggle").animate({ "margin-left": -30 }, 500);
	}, function() {
		$("#waifu-toggle").animate({ "margin-left": -50 }, 500);
	}).click(function() {
		$("#waifu-toggle").animate({ "margin-left": -100 }, 1000, function() {
			$("#waifu-toggle").hide();
		});
		if ($("#waifu-toggle").attr("first-time")) {
			loadWidget(waifuPath, apiPath);
			$("#waifu-toggle").attr("first-time", false);
		}
		else {
			localStorage.removeItem("waifu-display");
			$("#waifu").show().animate({ bottom: 0 }, 3000);
		}
	});
	if (localStorage.getItem("waifu-display") && new Date().getTime() - localStorage.getItem("waifu-display") </=></=></=></=></=></=></=></=></=>