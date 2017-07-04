/*::
type ParsedEntry = Array<string>;
type ParsedFmt = Array<ParsedEntry>;
type Args = Array<any>;
declare module "exit-on-epipe" { };
declare class PRINTJModule {
	version:string;
	sprintf:(fmt:string, ...args:any)=>string;
	vsprintf:(fmt:string, args:Args)=>string;
	_doit:(t:ParsedFmt, args:Args)=>string;
	_tokenize:(fmt:string)=>ParsedFmt;
};
declare module "./" { declare var exports:PRINTJModule };
declare module "../" { declare var exports:PRINTJModule };
*/
