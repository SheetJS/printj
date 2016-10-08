/*::
type ParsedFmt = Array<Array<any>>;
type Args = Array<any>;
declare module "exit-on-epipe" { };
declare class PRINTJModule {
	sprintf(fmt:string, ...args:any):string;
	vsprintf(fmt:string, args:Args):string;
	_doit(t:ParsedFmt, args:Args):string;
	_tokenize(fmt:string):ParsedFmt;
};
declare module "./" { declare var exports:PRINTJModule };
declare module "../" { declare var exports:PRINTJModule };
*/
