/* printj.js (C) 2016-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*jshint sub:true, eqnull:true */
/*exported PRINTJ */
/*:: declare var DO_NOT_EXPORT_PRINTJ:?boolean; */
/*:: declare function define(cb:()=>any):void; */
var PRINTJ/*:PRINTJModule*/;
(function (factory/*:(a:any)=>void*/)/*:void*/ {
	/*jshint ignore:start */
	if(typeof DO_NOT_EXPORT_PRINTJ === 'undefined') {
		if('object' === typeof exports) {
			factory(exports);
		} else if ('function' === typeof define && define.amd) {
			define(function () {
				var module/*:PRINTJModule*/ = /*::(*/{}/*:: :any)*/;
				factory(module);
				return module;
			});
		} else {
			factory(PRINTJ = /*::(*/{}/*:: :any)*/);
		}
	} else {
		factory(PRINTJ = /*::(*/{}/*:: :any)*/);
	}
	/*jshint ignore:end */
}(function(PRINTJ/*:PRINTJModule*/) {
#include "01_version.js"
