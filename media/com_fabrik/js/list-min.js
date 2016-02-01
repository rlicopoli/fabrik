/*! Fabrik */
var FbList=new Class({Implements:[Options,Events],options:{admin:!1,filterMethod:"onchange",ajax:!1,ajax_links:!1,links:{edit:"",detail:"",add:""},form:"listform_"+this.id,hightLight:"#ccffff",primaryKey:"",headings:[],labels:{},Itemid:0,formid:0,canEdit:!0,canView:!0,page:"index.php",actionMethod:"floating",formels:[],data:[],itemTemplate:"",floatPos:"left",csvChoose:!1,csvOpts:{},popup_width:300,popup_height:300,popup_offset_x:null,popup_offset_y:null,groupByOpts:{},isGrouped:!1,listRef:"",fabrik_show_in_list:[],singleOrdering:!1,tmpl:"",groupedBy:"",toggleCols:!1},initialize:function(a,b){this.id=a,this.setOptions(b),this.getForm(),this.result=!0,this.plugins=[],this.list=document.id("list_"+this.options.listRef),this.options.j3===!1&&(this.actionManager=new FbListActions(this,{method:this.options.actionMethod,floatPos:this.options.floatPos})),this.options.toggleCols&&(this.toggleCols=new FbListToggle(this.form)),this.groupToggle=new FbGroupedToggler(this.form,this.options.groupByOpts),new FbListKeys(this),this.list&&("table"===this.list.get("tag")&&(this.tbody=this.list.getElement("tbody")),"null"===typeOf(this.tbody)&&(this.tbody=this.list),window.ie&&(this.options.itemTemplate=this.list.getElement(".fabrik_row"))),this.watchAll(!1),Fabrik.addEvent("fabrik.form.submitted",function(){this.updateRows()}.bind(this)),!this.options.resetFilters&&window.history&&history.pushState&&history.state&&this.options.ajax&&this._updateRows(history.state)},setItemTemplate:function(){if("string"===typeOf(this.options.itemTemplate)){var a=this.list.getElement(".fabrik_row");window.ie&&"null"!==typeOf(a)&&(this.options.itemTemplate=a)}},rowClicks:function(){this.list.addEvent("click:relay(.fabrik_row)",function(a,b){var c=Array.from(b.id.split("_")),d={};d.rowid=c.getLast();var e={errors:{},data:d,rowid:c.getLast(),listid:this.id};Fabrik.fireEvent("fabrik.list.row.selected",e)}.bind(this))},watchAll:function(a){a=a?a:!1,this.watchNav(),this.storeCurrentValue(),a||(this.watchRows(),this.watchFilters()),this.watchOrder(),this.watchEmpty(),a||(this.watchGroupByMenu(),this.watchButtons())},watchGroupByMenu:function(){this.options.ajax&&this.form.addEvent("click:relay(*[data-groupBy])",function(a,b){this.options.groupedBy=b.get("data-groupBy"),a.rightClick||(a.preventDefault(),this.updateRows())}.bind(this))},watchButtons:function(){this.exportWindowOpts={id:"exportcsv",title:"Export CSV",loadMethod:"html",minimizable:!1,width:360,height:120,content:"",bootstrap:this.options.j3},"csv"===this.options.view?this.openCSVWindow():this.form.getElements(".csvExportButton")&&this.form.getElements(".csvExportButton").each(function(a){a.hasClass("custom")===!1&&a.addEvent("click",function(a){this.openCSVWindow(),a.stop()}.bind(this))}.bind(this))},openCSVWindow:function(){var a=this.makeCSVExportForm();this.exportWindowOpts.content=a,this.exportWindowOpts.onContentLoaded=function(){this.fitToContent(!1)},this.csvWindow=Fabrik.getWindow(this.exportWindowOpts)},makeCSVExportForm:function(){return this.options.csvChoose?this._csvExportForm():this._csvAutoStart()},_csvAutoStart:function(){var a=new Element("div",{id:"csvmsg"}).set("html",Joomla.JText._("COM_FABRIK_LOADING")+' <br /><span id="csvcount">0</span> / <span id="csvtotal"></span> '+Joomla.JText._("COM_FABRIK_RECORDS")+".<br/>"+Joomla.JText._("COM_FABRIK_SAVING_TO")+'<span id="csvfile"></span>');return this.csvopts=this.options.csvOpts,this.csvfields=this.options.csvFields,this.triggerCSVExport(-1),a},_csvExportForm:function(){var a="<input type='radio' value='1' name='incfilters' checked='checked' />"+Joomla.JText._("JYES"),b="<input type='radio' value='1' name='incraw' checked='checked' />"+Joomla.JText._("JYES"),c="<input type='radio' value='1' name='inccalcs' checked='checked' />"+Joomla.JText._("JYES"),d="<input type='radio' value='1' name='inctabledata' checked='checked' />"+Joomla.JText._("JYES"),e="<input type='radio' value='1' name='excel' checked='checked' />Excel CSV",f="index.php?option=com_fabrik&view=list&listid="+this.id+"&format=csv&Itemid="+this.options.Itemid,g={styles:{width:"200px","float":"left"}},h=new Element("form",{action:f,method:"post"}).adopt([new Element("div",g).set("text",Joomla.JText._("COM_FABRIK_FILE_TYPE")),new Element("label").set("html",e),new Element("label").adopt([new Element("input",{type:"radio",name:"excel",value:"0"}),new Element("span").set("text","CSV")]),new Element("br"),new Element("br"),new Element("div",g).appendText(Joomla.JText._("COM_FABRIK_INCLUDE_FILTERS")),new Element("label").set("html",a),new Element("label").adopt([new Element("input",{type:"radio",name:"incfilters",value:"0"}),new Element("span").set("text",Joomla.JText._("JNO"))]),new Element("br"),new Element("div",g).appendText(Joomla.JText._("COM_FABRIK_INCLUDE_DATA")),new Element("label").set("html",d),new Element("label").adopt([new Element("input",{type:"radio",name:"inctabledata",value:"0"}),new Element("span").set("text",Joomla.JText._("JNO"))]),new Element("br"),new Element("div",g).appendText(Joomla.JText._("COM_FABRIK_INCLUDE_RAW_DATA")),new Element("label").set("html",b),new Element("label").adopt([new Element("input",{type:"radio",name:"incraw",value:"0"}),new Element("span").set("text",Joomla.JText._("JNO"))]),new Element("br"),new Element("div",g).appendText(Joomla.JText._("COM_FABRIK_INCLUDE_CALCULATIONS")),new Element("label").set("html",c),new Element("label").adopt([new Element("input",{type:"radio",name:"inccalcs",value:"0"}),new Element("span").set("text",Joomla.JText._("JNO"))])]);new Element("h4").set("text",Joomla.JText._("COM_FABRIK_SELECT_COLUMNS_TO_EXPORT")).inject(h);var i="",j=0;return $H(this.options.labels).each(function(a,b){if("fabrik_"!==b.substr(0,7)&&"____form_heading"!==b){var c=b.split("___")[0];c!==i&&(i=c,new Element("h5").set("text",i).inject(h));var d="<input type='radio' value='1' name='fields["+b+"]' checked='checked' />"+Joomla.JText._("JYES");a=a.replace(/<\/?[^>]+(>|$)/g,"");var e=new Element("div",g).appendText(a);e.inject(h),new Element("label").set("html",d).inject(h),new Element("label").adopt([new Element("input",{type:"radio",name:"fields["+b+"]",value:"0"}),new Element("span").appendText(Joomla.JText._("JNO"))]).inject(h),new Element("br").inject(h)}j++}.bind(this)),this.options.formels.length>0&&(new Element("h5").set("text",Joomla.JText._("COM_FABRIK_FORM_FIELDS")).inject(h),this.options.formels.each(function(a){var b="<input type='radio' value='1' name='fields["+a.name+"]' checked='checked' />"+Joomla.JText._("JYES"),c=new Element("div",g).appendText(a.label);c.inject(h),new Element("label").set("html",b).inject(h),new Element("label").adopt([new Element("input",{type:"radio",name:"fields["+a.name+"]",value:"0"}),new Element("span").set("text",Joomla.JText._("JNO"))]).inject(h),new Element("br").inject(h)}.bind(this))),new Element("div",{styles:{"text-align":"right"}}).adopt(new Element("input",{type:"button",name:"submit",value:Joomla.JText._("COM_FABRIK_EXPORT"),"class":"button exportCSVButton",events:{click:function(a){a.stop(),a.target.disabled=!0;var b=document.id("csvmsg");"null"===typeOf(b)&&(b=new Element("div",{id:"csvmsg"}).inject(a.target,"before")),b.set("html",Joomla.JText._("COM_FABRIK_LOADING")+' <br /><span id="csvcount">0</span> / <span id="csvtotal"></span> '+Joomla.JText._("COM_FABRIK_RECORDS")+".<br/>"+Joomla.JText._("COM_FABRIK_SAVING_TO")+'<span id="csvfile"></span>'),this.triggerCSVExport(0)}.bind(this)}})).inject(h),new Element("input",{type:"hidden",name:"view",value:"table"}).inject(h),new Element("input",{type:"hidden",name:"option",value:"com_fabrik"}).inject(h),new Element("input",{type:"hidden",name:"listid",value:this.id}).inject(h),new Element("input",{type:"hidden",name:"format",value:"csv"}).inject(h),new Element("input",{type:"hidden",name:"c",value:"table"}).inject(h),h},triggerCSVExport:function(a,b,c){0!==a?-1===a?(a=0,b=this.csvopts,b.fields=this.csvfields):(b=this.csvopts,c=this.csvfields):(b||(b={},"null"!==typeOf(document.id("exportcsv"))&&["incfilters","inctabledata","incraw","inccalcs","excel"].each(function(a){var c=document.id("exportcsv").getElements("input[name="+a+"]");c.length>0&&(b[a]=c.filter(function(a){return a.checked})[0].value)})),c||(c={},"null"!==typeOf(document.id("exportcsv"))&&document.id("exportcsv").getElements("input[name^=field]").each(function(a){if(a.checked){var b=a.name.replace("fields[","").replace("]","");c[b]=a.get("value")}})),b.fields=c,this.csvopts=b,this.csvfields=c),b=this.csvExportFilterOpts(b),b.start=a,b.option="com_fabrik",b.view="list",b.format="csv",b.Itemid=this.options.Itemid,b.listid=this.id,b.listref=this.options.listRef,b.download=0,b.setListRefFromRequest=1,this.options.csvOpts.custom_qs.split("&").each(function(a){var c=a.split("=");b[c[0]]=c[1]});var d=new Request.JSON({url:"?"+this.options.csvOpts.custom_qs,method:"post",data:b,onError:function(a,b){fconsole(a,b)},onComplete:function(a){if(a.err)alert(a.err),Fabrik.Windows.exportcsv.close();else if("null"!==typeOf(document.id("csvcount"))&&document.id("csvcount").set("text",a.count),"null"!==typeOf(document.id("csvtotal"))&&document.id("csvtotal").set("text",a.total),"null"!==typeOf(document.id("csvfile"))&&document.id("csvfile").set("text",a.file),a.count<a.total)this.triggerCSVExport(a.count);else{var b="index.php?option=com_fabrik&view=list&format=csv&listid="+this.id+"&start="+a.count+"&Itemid="+this.options.Itemid,c='<div class="alert alert-success"><h3>'+Joomla.JText._("COM_FABRIK_CSV_COMPLETE");c+='</h3><p><a class="btn btn-success" href="'+b+'"><i class="icon-download"></i> '+Joomla.JText._("COM_FABRIK_CSV_DOWNLOAD_HERE")+"</a></p></div>","null"!==typeOf(document.id("csvmsg"))&&document.id("csvmsg").set("html",c),this.csvWindow.fitToContent(!1),document.getElements("input.exportCSVButton").removeProperty("disabled")}}.bind(this)});d.send()},csvExportFilterOpts:function(a){var b,c,d,e,f=0,g=0,h=["value","condition","join","key","search_type","match","full_words_only","eval","grouped_to_previous","hidden","elementid"];return this.getFilters().each(function(b){c=b.name.split("["),c.length>3&&(e=c[3].replace("]","").toInt(),f=e>f?e:f,"checkbox"===b.get("type")||"radio"===b.get("type")?b.checked&&(a[b.name]=b.get("value")):a[b.name]=b.get("value"))}.bind(this)),f++,Object.each(this.options.advancedFilters,function(c,e){if(h.contains(e))for(g=0,b=0;b<c.length;b++)g=b+f,d="fabrik___filter[list_"+this.options.listRef+"]["+e+"]["+g+"]",a[d]="value"===e?this.options.advancedFilters.origvalue[b]:"condition"===e?this.options.advancedFilters.orig_condition[b]:c[b]}.bind(this)),a},addPlugins:function(a){a.each(function(a){a.list=this}.bind(this)),this.plugins=a},firePlugin:function(a){var b=Array.prototype.slice.call(arguments);return b=b.slice(1,b.length),this.plugins.each(function(){Fabrik.fireEvent(a,[this,b])}.bind(this)),this.result===!1?!1:!0},watchEmpty:function(){var a=document.id(this.options.form).getElement(".doempty");a&&a.addEvent("click",function(a){a.stop(),confirm(Joomla.JText._("COM_FABRIK_CONFIRM_DROP"))&&this.submit("list.doempty")}.bind(this))},watchOrder:function(){var a=!1,b=document.id(this.options.form).getElements(".fabrikorder, .fabrikorder-asc, .fabrikorder-desc");b.removeEvents("click"),b.each(function(b){b.addEvent("click",function(c){var d="ordernone.png",e="",f="",g="",h="";b=document.id(c.target);var i=b.getParent(".fabrik_ordercell");switch("a"!==b.tagName&&(b=i.getElement("a")),b.className){case"fabrikorder-asc":f="fabrikorder-desc",g=b.get("data-sort-desc-icon"),h=b.get("data-sort-asc-icon"),e="desc",d="orderdesc.png";break;case"fabrikorder-desc":f="fabrikorder",g=b.get("data-sort-icon"),h=b.get("data-sort-desc-icon"),e="-",d="ordernone.png";break;case"fabrikorder":f="fabrikorder-asc",g=b.get("data-sort-asc-icon"),h=b.get("data-sort-icon"),e="asc",d="orderasc.png"}if(i.className.split(" ").each(function(b){b.contains("_order")&&(a=b.replace("_order","").replace(/^\s+/g,"").replace(/\s+$/g,""))}),!a)return void fconsole("woops didnt find the element id, cant order");b.className=f;var j=b.getElement("img"),k=b.firstElementChild;this.options.singleOrdering&&document.id(this.options.form).getElements(".fabrikorder, .fabrikorder-asc, .fabrikorder-desc").each(function(a){if(Fabrik.bootstrapped){var b=a.firstElementChild;switch(a.className){case"fabrikorder-asc":b.removeClass(a.get("data-sort-asc-icon")),b.addClass(a.get("data-sort-icon"));break;case"fabrikorder-desc":b.removeClass(a.get("data-sort-desc-icon")),b.addClass(a.get("data-sort-icon"));break;case"fabrikorder":}}else{var c=a.getElement("img");c&&(c.src=c.src.replace("ordernone.png","").replace("orderasc.png","").replace("orderdesc.png",""),c.src+="ordernone.png")}}),Fabrik.bootstrapped?(k.removeClass(h),k.addClass(g)):j&&(j.src=j.src.replace("ordernone.png","").replace("orderasc.png","").replace("orderdesc.png",""),j.src+=d),this.fabrikNavOrder(a,e),c.stop()}.bind(this))}.bind(this))},getFilters:function(){return document.id(this.options.form).getElements(".fabrik_filter")},storeCurrentValue:function(){this.getFilters().each(function(a){"submitform"!==this.options.filterMethod&&a.store("initialvalue",a.get("value"))}.bind(this))},watchFilters:function(){var a="",b=document.id(this.options.form).getElements(".fabrik_filter_submit");this.getFilters().each(function(c){a="select"===c.get("tag")?"change":"blur","submitform"!==this.options.filterMethod?(c.removeEvent(a),c.addEvent(a,function(a){a.stop(),a.target.retrieve("initialvalue")!==a.target.get("value")&&this.doFilter()}.bind(this))):c.addEvent(a,function(){b.highlight("#ffaa00")}.bind(this))}.bind(this)),b&&(b.removeEvents(),b.addEvent("click",function(a){a.stop(),this.doFilter()}.bind(this))),this.getFilters().addEvent("keydown",function(a){13===a.code&&(a.stop(),this.doFilter())}.bind(this))},doFilter:function(){var a=Fabrik.fireEvent("list.filter",[this]).eventResults;"null"===typeOf(a)&&this.submit("list.filter"),0!==a.length&&a.contains(!1)||this.submit("list.filter")},setActive:function(a){this.list.getElements(".fabrik_row").each(function(a){a.removeClass("activeRow")}),a.addClass("activeRow")},getActiveRow:function(a){var b=a.target.getParent(".fabrik_row");return b||(b=Fabrik.activeRow),b},watchRows:function(){this.list&&this.rowClicks()},getForm:function(){return this.form||(this.form=document.id(this.options.form)),this.form},uncheckAll:function(){this.form.getElements("input[name^=ids]").each(function(a){a.checked=""})},submit:function(a){this.getForm();var b=this.options.ajax;if("list.doPlugin.noAJAX"===a&&(a="list.doPlugin",b=!1),"list.delete"===a){var c=!1,d=0;if(this.form.getElements("input[name^=ids]").each(function(a){a.checked&&(d++,c=!0)}),!c)return alert(Joomla.JText._("COM_FABRIK_SELECT_ROWS_FOR_DELETION")),Fabrik.loader.stop("listform_"+this.options.listRef),!1;var e=1===d?Joomla.JText._("COM_FABRIK_CONFIRM_DELETE_1"):Joomla.JText._("COM_FABRIK_CONFIRM_DELETE").replace("%s",d);if(!confirm(e))return Fabrik.loader.stop("listform_"+this.options.listRef),this.uncheckAll(),!1}if("list.filter"===a?(Fabrik["filter_listform_"+this.options.listRef].onSubmit(),this.form.task.value=a,this.form["limitstart"+this.id]&&(this.form.getElement("#limitstart"+this.id).value=0)):""!==a&&(this.form.task.value=a),b){Fabrik.loader.start("listform_"+this.options.listRef),this.form.getElement("input[name=option]").value="com_fabrik",this.form.getElement("input[name=view]").value="list",this.form.getElement("input[name=format]").value="raw";var f=this.form.toQueryString();if("list.doPlugin"===a&&(f+="&setListRefFromRequest=1",f+="&listref="+this.options.listRef),"list.filter"===a&&this.advancedSearch!==!1){var g=document.getElement("form.advancedSearch_"+this.options.listRef);"null"!==typeOf(g)&&(f+="&"+g.toQueryString(),f+="&replacefilters=1")}for(var h=0;h<this.options.fabrik_show_in_list.length;h++)f+="&fabrik_show_in_list[]="+this.options.fabrik_show_in_list[h];f+="&tmpl="+this.options.tmpl,this.request?this.request.options.data=f:this.request=new Request({url:this.form.get("action"),data:f,onComplete:function(a){a=JSON.decode(a),this._updateRows(a),Fabrik.loader.stop("listform_"+this.options.listRef),Fabrik["filter_listform_"+this.options.listRef].onUpdateData(),Fabrik.fireEvent("fabrik.list.submit.ajax.complete",[this,a]),a.msg&&alert(a.msg)}.bind(this)}),this.request.send(),window.history&&window.history.pushState&&history.pushState(f,"fabrik.list.submit"),Fabrik.fireEvent("fabrik.list.submit",[a,this.form.toQueryString().toObject()])}else this.form.submit();return!1},fabrikNav:function(a){return this.options.limitStart=a,this.form.getElement("#limitstart"+this.id).value=a,Fabrik.fireEvent("fabrik.list.navigate",[this,a]),this.result?(this.submit("list.view"),!1):(this.result=!0,!1)},getRowIds:function(){var a=[],b=this.options.isGrouped?$H(this.options.data):this.options.data;return b.each(function(b){b.each(function(b){a.push(b.data.__pk_val)})}),a},getRow:function(a){var b={};return Object.each(this.options.data,function(c){for(var d=0;d<c.length;d++){var e=c[d];e&&e.data.__pk_val===a&&(b=e.data)}}),b},fabrikNavOrder:function(a,b){return this.form.orderby.value=a,this.form.orderdir.value=b,Fabrik.fireEvent("fabrik.list.order",[this,a,b]),this.result?void this.submit("list.order"):(this.result=!0,!1)},removeRows:function(a){for(i=0;i<a.length;i++){var b=document.id("list_"+this.id+"_row_"+a[i]),c=new Fx.Morph(b,{duration:1e3});c.start({backgroundColor:this.options.hightLight}).chain(function(){this.start({opacity:0})}).chain(function(){b.dispose(),this.checkEmpty()}.bind(this))}},editRow:function(){},clearRows:function(){this.list.getElements(".fabrik_row").each(function(a){a.dispose()})},updateRows:function(a){var b={option:"com_fabrik",view:"list",task:"list.view",format:"raw",listid:this.id,group_by:this.options.groupedBy,listref:this.options.listRef},c="";b["limit"+this.id]=this.options.limitLength,a&&Object.append(b,a),new Request({url:c,data:b,evalScripts:!1,onSuccess:function(a){a=a.stripScripts(),a=JSON.decode(a),this._updateRows(a)}.bind(this),onError:function(a,b){fconsole(a,b)},onFailure:function(a){fconsole(a)}}).send()},_updateHeadings:function(a){var b=jQuery("#"+this.options.form).find(".fabrik___heading").last(),c=new Hash(a.headings);c.each(function(a,c){c="."+c;try{b.find(c+" span").html(a)}catch(d){fconsole(d)}})},_updateGroupByTables:function(){var a,b=jQuery(this.list).find("tbody");b.css("display",""),b.each(function(b){b.hasClass("fabrik_groupdata")||(a=b.next(),0===a.find(".fabrik_row").length&&(b.hide(),a.hide()))})},_updateRows:function(a){var b,c,d,e,f,g,h,i,j,k=[],l=jQuery(this.form);if("object"===typeOf(a)&&(window.history&&window.history.pushState&&history.pushState(a,"fabrik.list.rows"),a.id===this.id&&"list"===a.model)){this._updateHeadings(a),this.setItemTemplate(),j=jQuery(this.list).find(".fabrik_row").first(),g=j.parent(),f=g.children().length,i=g.clone().empty(),c=j.clone(),this.clearRows(),this.options.data=this.options.isGrouped?$H(a.data):a.data,a.calculations&&this.updateCals(a.calculations),l.find(".fabrikNav").html(a.htmlnav);var m=this.options.isGrouped||""!==this.options.groupedBy?$H(a.data):a.data,n=0;m.each(function(a){for(b=this.options.isGrouped?this.list.getElements(".fabrik_groupdata")[n]:this.tbody,b=jQuery(b),b.empty(),this.options.isGrouped&&(e=b.prev(),e.find(".groupTitle").html(a[0].groupHeading)),k=[],n++,d=0;d<a.length;d++){var g=$H(a[d]);h=this.injectItemData(c,g),k.push(h)}for(k=Fabrik.Array.chunk(k,f),d=0;d<k.length;d++){var j=i.clone().append(k[d]);b.append(j)}}.bind(this)),this._updateGroupByTables(),this._updateEmptyDataMsg(0===k.length),this.watchAll(!0),Fabrik.fireEvent("fabrik.list.updaterows"),Fabrik.fireEvent("fabrik.list.update",[this,a]),this.stripe(),this.mediaScan(),Fabrik.loader.stop("listform_"+this.options.listRef)}},_updateEmptyDataMsg:function(a){var b=jQuery(this.list),c=b.parent(".fabrikDataContainer"),d=b.parent(".fabrikForm").find(".emptyDataMessage");a?(d.css("display",""),"none"===d.parent().css("display")&&d.parent().css("display",""),d.parent(".emptyDataMessage").css("display","")):(c.css("display",""),d.css("display","none"))},injectItemData:function(a,b){var c,d,e,f;if($H(b.data).each(function(b,c){d=a.find("."+c),"A"!==d.prop("tagName")?d.html(b):d.prop("href",b)}),a.find(".fabrik_row").prop("id",b.id),"string"==typeof this.options.itemTemplate){e=a.find(".fabrik_row"),e.prop("id",b.id);var g=b["class"].split(" ");for(f=0;f<g.length;f++)e.addClass(g[f]);c=a.clone()}else c=a.find(".fabrik_row");return c},mediaScan:function(){"undefined"!=typeof Slimbox&&Slimbox.scanPage(),"undefined"!=typeof Lightbox&&Lightbox.init(),"undefined"!=typeof Mediabox&&Mediabox.scanPage()},addRow:function(a){var b=new Element("tr",{"class":"oddRow1"});for(var c in a)if(-1!==this.options.headings.indexOf(c)){var d=new Element("td",{}).appendText(a[c]);b.appendChild(d)}b.inject(this.tbody)},addRows:function(a){var b,c;for(b=0;b<a.length;b++)for(c=0;c<a[b].length;c++)this.addRow(a[b][c]);this.stripe()},stripe:function(){var a,b=this.list.getElements(".fabrik_row");for(a=0;a<b.length;a++)if(!b[a].hasClass("fabrik___header")){var c="oddRow"+a%2;b[a].addClass(c)}},checkEmpty:function(){var a=this.list.getElements("tr");2===a.length&&this.addRow({label:Joomla.JText._("COM_FABRIK_NO_RECORDS")})},watchCheckAll:function(){var a=this.form.getElement("input[name=checkAll]");"null"!==typeOf(a)&&a.addEvent("click",function(a){var b=this.list.getParent(".fabrikList")?this.list.getParent(".fabrikList"):this.list,d=b.getElements("input[name^=ids]");c=a.target.checked?"checked":"";for(var e=0;e<d.length;e++)d[e].checked=c,this.toggleJoinKeysChx(d[e])}.bind(this)),this.form.getElements("input[name^=ids]").each(function(a){a.addEvent("change",function(){this.toggleJoinKeysChx(a)}.bind(this))}.bind(this))},toggleJoinKeysChx:function(a){a.getParent().getElements("input[class=fabrik_joinedkey]").each(function(b){b.checked=a.checked})},watchNav:function(){if(null!==this.form)var a=this.form.getElement("select[name*=limit]"),b=this.form.getElement(".addRecord");else a=null,b=null;if(a&&a.addEvent("change",function(){Fabrik.fireEvent("fabrik.list.limit",[this]);return this.result===!1?(this.result=!0,!1):void this.doFilter()}.bind(this)),"null"!==typeOf(b)&&this.options.ajax_links){b.removeEvents();var c=""===this.options.links.add||b.href.contains(Fabrik.liveSite)?"xhr":"iframe",d=b.href;d+=d.contains("?")?"&":"?",d+="tmpl=component&ajax=1",b.addEvent("click",function(a){a.stop();var b={id:"add."+this.id,title:this.options.popup_add_label,loadMethod:c,contentURL:d,width:this.options.popup_width,height:this.options.popup_height};"null"!==typeOf(this.options.popup_offset_x)&&(b.offset_x=this.options.popup_offset_x),"null"!==typeOf(this.options.popup_offset_y)&&(b.offset_y=this.options.popup_offset_y),Fabrik.getWindow(b)}.bind(this))}if(document.id("fabrik__swaptable")&&document.id("fabrik__swaptable").addEvent("change",function(a){window.location="index.php?option=com_fabrik&task=list.view&cid="+a.target.get("value")}.bind(this)),"null"!==typeOf(this.form.getElement(".pagination"))){var e=this.form.getElement(".pagination").getElements(".pagenav");0===e.length&&(e=this.form.getElement(".pagination").getElements("a")),e.each(function(a){a.addEvent("click",function(b){if(b.stop(),"a"===a.get("tag")){var c=a.href.toObject();this.fabrikNav(c["limitstart"+this.id])}}.bind(this))}.bind(this))}this.watchCheckAll()},updateCals:function(a){var b=["sums","avgs","count","medians"];this.form.getElements(".fabrik_calculations").each(function(c){b.each(function(b){$H(a[b]).each(function(a,b){var d=c.getElement("."+b);"null"!==typeOf(d)&&d.set("html",a)})})})}}),FbListKeys=new Class({initialize:function(a){window.addEvent("keyup",function(b){if(b.alt)switch(b.key){case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_ADD"):var c=a.form.getElement(".addRecord");a.options.ajax&&c.fireEvent("click"),c.getElement("a")?a.options.ajax?c.getElement("a").fireEvent("click"):document.location=c.getElement("a").get("href"):a.options.ajax||(document.location=c.get("href"));break;case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_EDIT"):fconsole("edit");break;case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_DELETE"):fconsole("delete");break;case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_FILTER"):fconsole("filter")}}.bind(this))}}),FbGroupedToggler=new Class({Implements:Options,options:{collapseOthers:!1,startCollapsed:!1,bootstrap:!1},initialize:function(a,b){var c,d,e,f;"null"!==typeOf(a)&&(this.setOptions(b),this.container=a,this.toggleState="shown",this.options.startCollapsed&&this.options.isGrouped&&this.collapse(),a.addEvent("click:relay(.fabrik_groupheading a.toggle)",function(a){return a.rightClick?void 0:(a.stop(),a.preventDefault(),this.options.collapseOthers&&this.collapse(),d=a.target.getParent(".fabrik_groupheading"),e=d.getElement(this.options.bootstrap?'*[data-role="toggle"]':"img"),f=e.retrieve("showgroup",!0),c=d.getNext()&&d.getNext().hasClass("fabrik_groupdata")?d.getNext():d.getParent().getNext(),f?jQuery(c).hide():jQuery(c).show(),this.setIcon(e,f),f=f?!1:!0,e.store("showgroup",f),!1)}.bind(this)))},setIcon:function(a,b){if(this.options.bootstrap){var c=a.get("data-expand-icon"),d=a.get("data-collapse-icon");b?(a.removeClass(c),a.addClass(d)):(a.addClass(c),a.removeClass(d))}else a.src=b?a.src.replace("orderasc","orderneutral"):a.src.replace("orderneutral","orderasc")},collapse:function(){jQuery(this.container.getElements(".fabrik_groupdata")).hide();var a=this.options.bootstrap?"i":"img",b=this.container.getElements(".fabrik_groupheading a "+a);0===b.length&&(b=this.container.getElements(".fabrik_groupheading "+a)),b.each(function(a){a.store("showgroup",!1),this.setIcon(a,!0)}.bind(this))},expand:function(){jQuery(this.container.getElements(".fabrik_groupdata")).show();var a=this.container.getElements(".fabrik_groupheading a img");0===a.length&&(a=this.container.getElements(".fabrik_groupheading img")),a.each(function(a){a.store("showgroup",!0),this.setIcon(a,!1)}.bind(this))},toggle:function(){"shown"===this.toggleState?this.collapse():this.expand(),this.toggleState="shown"===this.toggleState?"hidden":"shown"}}),FbListActions=new Class({Implements:[Options],options:{selector:"ul.fabrik_action, .btn-group.fabrik_action",method:"floating",floatPos:"bottom"},initialize:function(a,b){this.setOptions(b),this.list=a,this.actions=[],this.setUpSubMenus(),Fabrik.addEvent("fabrik.list.update",function(){this.observe()}.bind(this)),this.observe()},observe:function(){"floating"===this.options.method?this.setUpFloating():this.setUpDefault()},setUpSubMenus:function(){this.list.form&&(this.actions=this.list.form.getElements(this.options.selector),this.actions.each(function(a){if(a.getElement("ul")){var b=a.getElement("ul"),c=new Element("div").adopt(b.clone()),d=b.getPrevious();d.getElement(".fabrikTip")&&(d=d.getElement(".fabrikTip"));{var e=Fabrik.tips?Fabrik.tips.options:{},f=Object.merge(Object.clone(e),{showOn:"click",hideOn:"click",position:"bottom",content:c});new FloatingTips(d,f)}b.dispose()}}))},setUpDefault:function(){this.actions=this.list.form.getElements(this.options.selector),this.actions.each(function(a){if(!a.getParent().hasClass("fabrik_buttons")){a.fade(.6);var b=a.getParent(a.getParent(".fabrik_row")?".fabrik_row":".fabrik___heading");b&&b.addEvents({mouseenter:function(){a.fade(.99)},mouseleave:function(){a.fade(.6)}})}})},setUpFloating:function(){var a=!1;this.list.form.getElements(this.options.selector).each(function(b){if(b.getParent(".fabrik_row")&&(i=b.getParent(".fabrik_row").getElement("input[type=checkbox]"))){a=!0;{var c=function(){var a=b.getParent();return a.store("activeRow",b.getParent(".fabrik_row")),a}.bind(this.list),d={position:this.options.floatPos,showOn:"change",hideOn:"click",content:c,heading:"Edit: ",hideFn:function(a){return!a.target.checked},showFn:function(a,c){return Fabrik.activeRow=b.getParent().retrieve("activeRow"),c.store("list",this.list),a.target.checked}.bind(this.list)},e=Fabrik.tips?Object.merge(Object.clone(Fabrik.tips.options),d):d;new FloatingTips(i,e)}}}.bind(this)),this.list.form.getElements(".fabrik_select input[type=checkbox]").addEvent("click",function(a){Fabrik.activeRow=a.target.getParent(".fabrik_row")});var b=this.list.form.getElement("input[name=checkAll]");"null"!==typeOf(b)&&b.store("listid",this.list.id);{var c=function(a){var b=a.getParent(".fabrik___heading");return"null"!==typeOf(b)?b.getElement(this.options.selector):""}.bind(this),d=Fabrik.tips?Object.clone(Fabrik.tips.options):{},e=Object.merge(d,{position:this.options.floatPos,html:!0,showOn:"click",hideOn:"click",content:c,heading:"Edit all: ",hideFn:function(a){return!a.target.checked},showFn:function(a,b){return b.retrieve("tip").click.store("list",this.list),a.target.checked}.bind(this.list)});new FloatingTips(b,e)}if(this.list.form.getElements(".fabrik_actions")&&a&&this.list.form.getElements(".fabrik_actions").hide(),this.list.form.getElements(".fabrik_calculation")){var f=this.list.form.getElements(".fabrik_calculation").getLast();"null"!==typeOf(f)&&f.hide()}}});