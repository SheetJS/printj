/* vim: set ts=2 ft=javascript: */

var ctypes = require("./ctypes.json");
var models = ctypes.Models;
var modelnames = ctypes.ModelNames;

console.log("#ifndef CTYPES_JS_");
console.log("#define CTYPES_JS_");
console.log("");
modelnames.forEach(function(m, i) { console.log("#define JS_MODEL_" + m + " " + i); });
console.log("");

console.log("#ifndef JS_MODEL\n#define JS_MODEL JS_MODEL_" + modelnames[0] + "\n#endif\n");

function print_model(model) {
[
"#define SIZEOF_CHAR " + model.char,
"#define SIZEOF_WCHAR_T " + model.wchar_t,
"",
"#define SIZEOF_SHORT " + model.short,
"#define SIZEOF_INT " + model.int,
"#define SIZEOF_WINT_T " + model.wint_t,
"#define SIZEOF_LONG " + model.long,
"#define SIZEOF_LONG_LONG " + model.longlong,
"",
"#define SIZEOF_SIZE_T " + model.size_t,
"#define SIZEOF_INTMAX_T " + model.intmax_t,
"#define SIZEOF_PTRDIFF_T " + model.ptrdiff_t,
].forEach(function(l) { console.log(l); });
}

modelnames.forEach(function(m,i) {
	console.log("#" + (i == 0 ? "" : "el") + "if JS_MODEL == JS_MODEL_" + m);
	print_model(models[m]);
});

console.log("#else");
var warn = modelnames.map(function(m, i) { return i + " (" + m + ")"; }).join(" or ");

console.log("#error 'Unsupported JS_MODEL, should be " + warn + "'\n#endif\n");

function make_124_mask(T) {
	var name = "SIZEOF_" + T, mask = "MASK_" + T;
	return [
		"#ifdef "   + name,
		"#if "      + name + " == 1",
		"#define "  + mask + " 0xFF",
		"#elif "    + name + " == 2",
		"#define "  + mask + " 0xFFFF",
		"#elif "    + name + " == 4",
		"#define "  + mask + " 0xFFFFFFFF",
		"#endif",
		"#endif /*" + name + "*/"
	].join("\n");
}

console.log(make_124_mask("CHAR"));
console.log("");
console.log(make_124_mask("WCHAR_T"));
console.log("");
console.log("#endif  /*CTYPES_JS_*/");
