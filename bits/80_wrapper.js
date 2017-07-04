function vsprintf(fmt/*:string*/, args/*:Args*/)/*:string*/ { return doit(tokenize(fmt), args); }

function sprintf(/*:: ...argz*/)/*:string*/ {
	var args/*:Array<any>*/ = new Array(arguments.length - 1);
	for(var i/*:number*/ = 0; i < args.length; ++i) args[i] = arguments[i+1];
	return doit(tokenize(arguments[0]), args);
}
