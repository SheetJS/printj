var assert = {};
assert.equal = function(x,y) { if(x !== y) throw new Error(x + " !== " + y); };
assert.throws = function(f) { try { f(); } catch(e) { return; } throw new Error("Function did not fail"); }; 
assert.doesNotThrow = function(f) { f(); }; 
