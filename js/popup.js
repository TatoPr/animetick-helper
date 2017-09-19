function watch_ticket(t, token){
	console.log("clicked");
	if(0!=t.length){
		var e=/_b_([0-9]+)_([0-9]+)$/;
		var i=e.exec(t.prop("id"));
		var a=i[1];
		var c=i[2];
		var n=$("#ticket_b_"+a+"_"+c).prop("disabled",!0);
		var o=$("#episode_b_"+a+"_"+c).prop("disabled",!0);
		var _=t.hasClass("enable");
		var r=void 0;
		var s=void 0;
		if(_){
			r="unwatch",
			s=function(){
				n.removeClass("enable"),
				n.text("Watch"),
				o.removeClass("enable"),
				o.text("Watch"),
				n.prop("disabled",!1),
				o.prop("disabled",!1),
				$("#episode_"+a+"_"+c).removeClass("watched"),
				watched_num-=1
			}
		}
		else{
			r="watch",
			s=function(){
				n.addClass("enable"),
				n.text("Watched"),
				o.addClass("enable"),
				o.text("Watched"),
				n.prop("disabled",!1),
				o.prop("disabled",!1),
				$("#episode_"+a+"_"+c).addClass("watched"),
				watched_num+=1}
		};
		var d=$("input#twitter_master");
		var l=!1;
		0!=d.length&&(l=d.get(0).checked),
		$.ajax({
			type:"POST",
			url:"http://animetick.net/ticket/"+a+"/"+c+"/"+r,
			data:{authenticity_token:token,twitter:l},
			dataType:"json",
			success:function(t){t.success&&s()},
			error:function(){}
		})
	}
};

function getTag(a){
	var tag="";
	$.ajax({
		type:"GET",
		url:"http://animetick.net/anime/"+a,
		dataType:"html",
		success:function(data){
			console.log(data);
			tag = $(data).find("div.hashtag").text();
			tag = tag.replace(/\r?\n/g, "").trim();
			console.log(tag);
			chrome.runtime.sendMessage({
				text: tag
			});
			return tag;
		}
	})
};


$(function(){
	$.ajax({url: 'http://animetick.net/ticket/list',
			method:'GET',
			dataType: 'html',
			success: function(data){
				var bad_url = "/assets/badge_tomorrow-863fb2f97d54430c0aa58df48c00bcaf.png";
				var token = $($(data)[7]).prop("content");
				console.log(token);

				$(data).find("#tickets").find(".ticket_relative").each(function(i){
					console.log(i+"passed");
					if($(this).find('.badge').attr("src") != bad_url){
						$('#tickets').append($(this).html());
					}
				});
				console.log("opened");

				$("#tickets").find(".ticket").each(function(i){
					$(this).find(".ticket_watch").click(function(){
						watch_ticket($(this), token);
					});
					console.log(i+"btn created");
				});
			}
	});
});
