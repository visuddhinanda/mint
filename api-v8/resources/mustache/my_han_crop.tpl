<!DOCTYPE html>
<html>
	<head>
    <style type="text/css">
.img{
	max-height: 1000px;
    max-width: 750px;
    overflow: hidden;
	padding: 0 8px 8px 0;
}
.img:hover{
	overflow: scroll;
	scrollbar-width: thin;
	scrollbar-color: rgba(0, 0, 0, 0.5) transparent;
}
.dict{
	width: 880px;
}
	</style>
</head>
  <body>
    <h3>Page {{page}}</h3>
<div style="display: flex;">
<div>
	<table>
{{#words}}
      <tr>
        <td>{{spell}}</td>
        <td><img src="img/{{spell}}.png" /></td>
      </tr>
{{/words}}
    </table>
</div>
<div>
{{#dict}}
<div class="img">
	<img class="dict" src="{{img}}">
</div>
{{/dict}}
</div>
</div>
  </body>
</html>
