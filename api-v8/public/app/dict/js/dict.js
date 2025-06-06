var dict_pre_searching=false;
var dict_pre_search_curr_word="";
var dict_search_xml_http=null;

function dict_bold_word_all_select(){
	var wordcount=$("#bold_word_count").val();	
	for(var i=0;i<wordcount;i++){
		document.getElementById("bold_word_"+i).checked=document.getElementById("bold_all_word").checked;
	}

	dict_update_bold(0);
	
}

function dict_bold_word_select(id){
	var wordcount=$("#bold_word_count").val();	
	for(var i=0;i<wordcount;i++){
			document.getElementById("bold_word_"+i).checked=false;
	}
	document.getElementById("bold_word_"+id).checked=true;

	dict_update_bold(0);
	
}
function dict_bold_book_select(id){
	var bookcount=$("#bold_book_count").val();	
	for(var i=0;i<bookcount;i++){
		document.getElementById("bold_book_"+i).checked=false;
	}
	document.getElementById("bold_book_"+id).checked=true;

	dict_update_bold(0);
	
}
function dict_update_bold(currpage){
	var wordlist="(";
	var wordcount=$("#bold_word_count").val();	
	for(var i=0;i<wordcount;i++){
		if(document.getElementById("bold_word_"+i).checked){
			wordlist+="'"+$("#bold_word_"+i).val()+"',";
		}
	}
	wordlist=wordlist.slice(0,-1);
	wordlist+=")";

	var booklist="(";
	var bookcount=$("#bold_book_count").val();	
	for(var i=0;i<bookcount;i++){
		if(document.getElementById("bold_book_"+i).checked){
			booklist+="'"+$("#bold_book_"+i).val()+"',";
		}	
	}	
	booklist=booklist.slice(0,-1);
	booklist+=")";
	
	$.get("./dict_find3.php",
	  {
		op:"update",
		target:"bold",
		word:"",
		wordlist:wordlist,
		booklist:booklist,
		currpage:currpage
	  },
	  function(data,status){
		//alert("Data: " + data + "\nStatus: " + status);
		$("#dict_bold_right").html(data);
		$("#bold_book_list").html($("#bold_book_list_new").html());
		$("#bold_book_list_new").html("");
	  });
		
}
function dict_search(word){
	if(!localStorage.searchword){
		localStorage.searchword="";
	}
	let oldHistory=localStorage.searchword;
	let arrOldHistory=oldHistory.split(",");
	let isExist=false;
	for(let i=0;i<arrOldHistory.length;i++){
		if(arrOldHistory[i]==word){
			isExist=true;
		}
	}
	if(!isExist){
		localStorage.searchword=word+","+oldHistory;
	}
	
	if(window.XMLHttpRequest)
	{// code for IE7, Firefox, Opera, etc.
		dict_search_xml_http=new XMLHttpRequest();
	}
	else if(window.ActiveXObject)
	{// code for IE6, IE5
		dict_search_xml_http=new ActiveXObject("Microsoft.XMLHTTP");
	}
	  
	if (dict_search_xml_http!=null)
	{
		dict_search_xml_http.onreadystatechange=dict_search_serverResponse;
		word=word.replace(/\+/g,"%2b");
		dict_search_xml_http.open("GET", "./dict_find3.php?op=search&word="+word, true);
		dict_search_xml_http.send();
	}
	else
	{
		alert("Your browser does not support XMLHTTP.");
	}
}
function dict_search_serverResponse(){
	if (dict_search_xml_http.readyState==4)// 4 = "loaded"
	{
		if (dict_search_xml_http.status==200)
		{// 200 = "OK"
			var serverText = dict_search_xml_http.responseText;
			dict_result=document.getElementById("dict_ref_search_result");
			if(dict_result){
				dict_result.innerHTML=serverText;
				$("#dict_ref_dict_link").html($("#dictlist").html());
				$("#dictlist").html("");
			}
			$("#dict_type").html($("#real_dict_tab").html());
		}
		else
		{
			alert(dict_pre_search_xml_http.statusText,0);
		}
	}
}


var dict_pre_search_xml_http=null;
function dict_pre_search(word){
	if(dict_pre_searching==true){return;}
	dict_pre_searching=true;
	dict_pre_search_curr_word=word;
	if(window.XMLHttpRequest)
	{// code for IE7, Firefox, Opera, etc.
		dict_pre_search_xml_http=new XMLHttpRequest();
	}
	else if(window.ActiveXObject)
	{// code for IE6, IE5
		dict_pre_search_xml_http=new ActiveXObject("Microsoft.XMLHTTP");
	}
	  
	if (dict_pre_search_xml_http!=null)
	{
		dict_pre_search_xml_http.onreadystatechange=dict_pre_search_serverResponse;
		dict_pre_search_xml_http.open("GET", "./dict_find3.php?op=pre&word="+word, true);
		dict_pre_search_xml_http.send();
	}
	else
	{
		alert("Your browser does not support XMLHTTP.");
	}
	
}

function dict_pre_search_serverResponse(){
	if (dict_pre_search_xml_http.readyState==4)// 4 = "loaded"
	{
		if (dict_pre_search_xml_http.status==200)
		{// 200 = "OK"
			var serverText = dict_pre_search_xml_http.responseText;
			$("#dict_ref_search_result").html(serverText);

		}
		else
		{
			alert(dict_pre_search_xml_http.statusText,0);
		}
		dict_pre_searching=false;
		var newword = document.getElementById("dict_ref_search_input").value;
		if(newword!=dict_pre_search_curr_word){
			dict_pre_search(newword);
		}
	}

}
function dict_pre_word_click(word){
	document.getElementById("dict_ref_search_input").value=word;
	dict_search(word);
}

function dict_input_change(obj){
	dict_pre_search(obj.value);
}

function dict_input_onfocus(){
	if($("#dict_ref_search_input").val()==""){
		dict_show_history();
	}
}

function dict_input_keypress(e,obj){
	var keynum
	var keychar
	var numcheck

	if(window.event) // IE
	  {
	  keynum = e.keyCode
	  }
	else if(e.which) // Netscape/Firefox/Opera
	  {
	  keynum = e.which
	  }
	var keychar = String.fromCharCode(keynum)
	if(keynum==13){
		
	}
}

function dict_input_keyup(e,obj){
	var keynum
	var keychar
	var numcheck
	
	if($("#dict_ref_search_input").val()==""){
		dict_show_history();
		return;
	}
	if(window.event) // IE
	  {
	  keynum = e.keyCode
	  }
	else if(e.which) // Netscape/Firefox/Opera
	  {
	  keynum = e.which
	  }
	var keychar = String.fromCharCode(keynum)
	if(keynum==13){
		dict_search(obj.value);
	}
	else{
		dict_input_split(obj.value);
		dict_pre_search(obj.value);
	}
}

function dict_input_split(word){
	if(word.indexOf("+")>=0){
		var wordParts=word.split("+");
		var strParts="";
		for(var i in wordParts){
			strParts+="<a onclick='dict_search(\""+wordParts[i]+"\")'>"+wordParts[i]+"</a>";
		}
		document.getElementById("input_parts").innerHTML=strParts;
	}
	else{
	document.getElementById("input_parts").innerHTML="";
	}
		
}

function dict_show_history(){
	if(!localStorage.searchword){
		localStorage.searchword="";
	}
	var arrHistory=localStorage.searchword.split(",");
	var strHistory="";
	if(arrHistory.length>0){
		strHistory+="<a onclick=\"cls_word_search_history()\">清空历史记录</a>";
	}
	for(var i=0;i<arrHistory.length;i++){
		var word=arrHistory[i];
		strHistory+="<div class='dict_word_list'>";
		strHistory+="<a onclick='dict_pre_word_click(\""+word+"\")'>"+word+"</a>";
		strHistory+="</div>";
	}
	$("#dict_ref_search_result").html(strHistory);	
}

function cls_word_search_history(){
	localStorage.searchword="";
	$("#dict_ref_search_result").html("");

}

function dict_show_edit(){
	$("#user_word_edit").slideToggle();
}

function dict_edit_now(book,para,title){
	var res_list = new Array();
	res_list.push({"type":"1","album_id":"-1","book":book,"parNum":para,"parlist":para,"title":title+"-"+para});
	res_list.push({"type":"6","album_id":"-1","book":book,"parNum":para,"parlist":para,"title":title+"-"+para});
	var res_data = JSON.stringify(res_list);
	window.open("../studio/project.php?op=create&data="+res_data,"_blank");


}