/*::
type ParsedFmt = Array<Array<any>>;
type Args = Array<any>;
declare module "exit-on-epipe" { };
declare module "./" {
	declare function sprintf(fmt:string, ...args:any):string;
	declare function vsprintf(fmt:string, args:Args):string;
	declare function _doit(t:ParsedFmt, args:Args):string;
	declare function _tokenize(fmt:string):ParsedFmt;
};
*/
