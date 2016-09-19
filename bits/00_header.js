/* printj.js (C) 2016-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*jshint sub:true, eqnull:true */
/*exported PRINTJ */
/*:: declare var DO_NOT_EXPORT_PRINTJ: any; */
/*:: declare var define: any; */
var PRINTJ/*:any*/;
(function (factory/*:(a:any)=>void*/)/*:void*/ {
	/*jshint ignore:start */
	if(typeof DO_NOT_EXPORT_PRINTJ === 'undefined') {
		if('object' === typeof exports) {
			factory(exports);
		} else if ('function' === typeof define && define.amd) {
			define(function () {
				var module/*:any*/ = {};
				factory(module);
				return module;
			});
		} else {
			factory(PRINTJ = {});
		}
	} else {
		factory(PRINTJ = {});
	}
	/*jshint ignore:end */
}(function(PRINTJ) {
#include "01_version.js"
