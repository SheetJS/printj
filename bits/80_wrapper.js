function vsprintf(fmt/*:string*/, args/*:Array<any>*/) { return doit(tokenize(fmt), args); }

function sprintf()/*:string*/ {
	var args/*:Array<any>*/ = new Array(arguments.length - 1);
	for(var i = 0; i < args.length; ++i) args[i] = arguments[i+1];
	return doit(tokenize(arguments[0]), args);
}
