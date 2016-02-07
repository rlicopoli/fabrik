/*! Fabrik */
var FloatingTips=new Class({Implements:[Options,Events],options:{fxProperties:{transition:Fx.Transitions.linear,duration:500},position:"top",trigger:"hover",content:"title",distance:50,tipfx:"Fx.Transitions.linear",heading:"",duration:500,fadein:!1,notice:!1,html:!0,showFn:function(a){return a.stop(),!0},hideFn:function(a){return a.stop(),!0},placement:function(a,b){Fabrik.fireEvent("bootstrap.tips.place",[a,b]);var c=0===Fabrik.eventResults.length?!1:Fabrik.eventResults[0];if(c===!1){var d=JSON.decode(b.get("opts","{}").opts);return d&&d.position?d.position:"top"}return c}},initialize:function(elements,options){"3.x"!==Fabrik.bootstrapVersion("modal")&&"object"!=typeof Materialize&&(this.setOptions(options),this.options.fxProperties={transition:eval(this.options.tipfx),duration:this.options.duration},window.addEvent("tips.hideall",function(a,b){this.hideOthers(b)}.bind(this)),elements&&this.attach(elements))},attach:function(a){return"3.x"===Fabrik.bootstrapVersion("modal")||"object"==typeof Materialize?(this.elements=document.getElements(a),void this.elements.each(function(a){jQuery(a).popover({html:!0})})):(this.elements=document.getElements(a),void this.elements.each(function(a){var b=JSON.decode(a.get("opts","{}").opts);b=b?b:{},b.position&&(b.defaultPos=b.position,delete b.position);var c=Object.merge(Object.clone(this.options),b);if("title"===c.content)c.content=a.get("title"),a.erase("title");else if("function"===typeOf(c.content)){var d=c.content(a);c.content="null"===typeOf(d)?"":d.innerHTML}c.placement=this.options.placement,c.title=c.heading,a.hasClass("tip-small")?(c.title=c.content,jQuery(a).tooltip(c)):(c.notice||(c.title+='<button class="close" data-popover="'+a.id+'">&times;</button>'),jQuery(a).popoverex(c))}.bind(this)))},addStartEvent:function(){},addEndEvent:function(){},getTipContent:function(){},show:function(){},hide:function(){},hideOthers:function(){},hideAll:function(){}});!function(a){var b=function(a,b){this.init("popover",a,b)};b.prototype=a.extend({},a.fn.popover.Constructor.prototype,{constructor:b,tip:function(){return this.$tip||(this.$tip=a(this.options.template),this.options.modifier&&this.$tip.addClass(this.options.modifier)),this.$tip},show:function(){var a,b,c,d,e,f,g;if(this.hasContent()&&this.enabled){a=this.tip(),this.setContent(),this.options.animation&&a.addClass("fade");var h=this.options.placement;switch(f="function"==typeof h?h.call(this,a[0],this.$element[0]):h,b=/in/.test(f),a.remove().css({top:0,left:0,display:"block"}).appendTo(b?this.$element:document.body),c=this.getPosition(b),d=a[0].offsetWidth,e=a[0].offsetHeight,b?f.split(" ")[1]:f){case"bottom":g={top:c.top+c.height,left:c.left+c.width/2-d/2};break;case"bottom-left":g={top:c.top+c.height,left:c.left},f="bottom";break;case"bottom-right":g={top:c.top+c.height,left:c.left+c.width-d},f="bottom";break;case"top":g={top:c.top-e,left:c.left+c.width/2-d/2};break;case"top-left":g={top:c.top-e,left:c.left},f="top";break;case"top-right":g={top:c.top-e,left:c.left+c.width-d},f="top";break;case"left":g={top:c.top+c.height/2-e/2,left:c.left-d};break;case"right":g={top:c.top+c.height/2-e/2,left:c.left+c.width}}a.css(g).addClass(f).addClass("in")}}}),a.fn.popoverex=function(c){return this.each(function(){var d=a(this),e=d.data("popover"),f="object"==typeof c&&c;e||d.data("popover",e=new b(this,f)),"string"==typeof c&&e[c]()})}}(window.jQuery);