/**
 * freemarker
 */

(function(mod) {
	if (typeof exports == "object" && typeof module == "object" ) // CommonJS
		mod(require("../../lib/codemirror"));
	else if (typeof define == "function" && define.amd ) // AMD
		define([ "../../lib/codemirror" ], mod);
	else
		// Plain browser env
		mod(CodeMirror);
})(function(CodeMirror) {
	"use strict";

	CodeMirror.defineMode("spiderflow", function(config) {
				"use strict";

				// our default settings; check to see if they're overridden
				var settings = {
					leftDelimiter : '<', rightDelimiter : '>', tagSyntax : 1
				// 1 angle_bracket,2 square_bracket
				};
				if (config.hasOwnProperty("tagSyntax") ) {
					if (config.tagSyntax === 2 ) {
						settings.tagSyntax = 2;
						settings.leftDelimiter = '[';
						settings.rightDelimiter = ']';
					}
				}

				var keyFunctions = [ "assign", "attempt", "autoesc", "break", "case", "compress", "default", "else",
						"elseif", "escape", "fallback", "function", "flush", "ftl", "global", "if", "import",
						"include", "items", "list", "local", "lt", "macro", "nested","noautoesc", "noescape", "noparse", "nt","outputformat",
						"recover", "recurse", "return", "rt", "sep", "setting", "stop", "switch", "t", "visit" ];
				var specialVariables = [ "auto_esc" , "current_template_name", "data_model", "error", "globals", "lang", "locale",
						"locale_object", "locals", "main", "main_template_name", "namespace", "node", "now",
						"output_encoding " , "output_format" , "template_name", "url_escaping_charset", "vars", "version" ];

				var freemarkerStartTagArray = [ "#", "@" ];

				var freemarkerEndTagArray = [ "/#", "/@", "/>" ];

				var last;
				var freemarkerMode;
				var regs = {
					operatorChars : /[+\-*&%=<>!?:;,|&]/, validIdentifier : /[a-zA-Z0-9_]/, stringChar : /['"]/
				};
				
				var helpers = {
					cont : function(style, lastType, lastFreemarkerMode) {
						last = lastType;
						freemarkerMode = lastFreemarkerMode;
						return style;
					}, chain : function(stream, state, parser) {
						state.tokenize = parser;
						return parser(stream, state);
					}
				};

				// our various parsers
				var parsers = {

					// the main tokenizer
					tokenizer : function(stream, state) {
						if (stream.match(settings.leftDelimiter, true) ) {
							if (stream.match("#--", true) ) {
								return helpers.chain(stream, state, parsers.inBlock("comment", "--"
										+ settings.rightDelimiter));
							} else {
								for (var i = 0; i < freemarkerStartTagArray.length; i++) {
									if (stream.match(freemarkerStartTagArray[i], false) ) {
										state.tokenize = parsers.freemarkerTemplate;
										if (freemarkerStartTagArray[i] == "@" ) {
											freemarkerMode = "macro";
										} else {
											freemarkerMode = "tag";
										}
										last = "startTag";
										return "tag";
									}
								}
								for (var i = 0; i < freemarkerEndTagArray.length; i++) {
									if (stream.match(freemarkerEndTagArray[i], false) ) {
										state.tokenize = parsers.freemarkerTemplate;
										if (freemarkerEndTagArray[i] == "/@" ) {
											freemarkerMode = "macro";
										} else {
											freemarkerMode = "tag";
										}
										last = "endTag";
										return "tag";
									}
								}
							}
						} else if (stream.match("${", false) ) {
							state.tokenize = parsers.freemarkerTemplate;
							last = "startTag";
							freemarkerMode = "echo";
							return "keyword";
						}
						stream.next();
						return null;
					},

					// parsing freemarker content
					freemarkerTemplate : function(stream, state) {
						if (stream.match(settings.rightDelimiter, true) ) {
							state.depth--;
							if (state.depth <= 0 ) {
								state.tokenize = parsers.tokenizer;
							}
							return helpers.cont("tag", null, null);
						} else if ("echo" == state.freemarkerMode && stream.match("}", true) ) {
							state.depth--;
							if (state.depth <= 0 ) {
								state.tokenize = parsers.tokenizer;
							}
							return helpers.cont("keyword", null, null);
						}

						if (stream.match(settings.leftDelimiter, true) ) {
							for (var i = 0; i < freemarkerStartTagArray.length; i++) {
								if (stream.match(freemarkerStartTagArray[i], false) ) {
									state.depth++;
									if (freemarkerStartTagArray[i] == "@" ) {
										return helpers.cont("tag", "startTag", "macro");
									} else {
										return helpers.cont("tag", "startTag", "tag");
									}
								}
							}
							for (var i = 0; i < freemarkerEndTagArray.length; i++) {
								if (stream.match(freemarkerEndTagArray[i], false) ) {
									state.depth++;
									if (freemarkerEndTagArray[i] == "/@" ) {
										return helpers.cont("tag", "endTag", "macro");
									} else {
										return helpers.cont("tag", "endTag", "tag");
									}
								}
							}
						} else if (stream.match("${", true) ) {
							state.depth++;
							return helpers.cont("keyword", "startTag", "echo");
						}
						var ch = stream.next();
						if ("." == ch ) {
							if("echo" == state.freemarkerMode || "whitespace" == state.last ||"operator"== state.last){
								for (var i = 0; i < specialVariables.length; i++) {
									if(stream.match(specialVariables[i],true)){
										return helpers.cont("keyword", "variable", state.freemarkerMode);
									}
								}
							}
							if("keyword"==state.last && stream.eatWhile(regs.validIdentifier)){
								return helpers.cont("keyword", null, state.freemarkerMode);
							}else{
								return helpers.cont("operator", "childVariable", state.freemarkerMode);
							}
						} else if (regs.stringChar.test(ch) ) {
							state.tokenize = parsers.inAttribute(ch);
							return helpers.cont("string", "string", state.freemarkerMode);
						} else if (regs.operatorChars.test(ch) ) {
							if ("?" === ch ) {
								return helpers.cont("operator", "builtin", state.freemarkerMode);
							} else {
								return helpers.cont("operator", "operator", state.freemarkerMode);
							}
						} else if ("[" == ch || "{" == ch|| "(" == ch ) {
							return helpers.cont("bracket", "bracket", state.freemarkerMode);
						} else if ("]" == ch || "}" == ch || ")" == ch  ) {
							return helpers.cont("bracket", "variable", state.freemarkerMode);
						} else if ("/" == ch ) {
							return helpers.cont("tag", "endTag", state.freemarkerMode);
						} else if ("@" == ch && "macro" == state.freemarkerMode ) {
							stream.eatWhile(regs.validIdentifier)
							return helpers.cont("keyword", "keyword", state.freemarkerMode);
						} else if (/\d/.test(ch) ) {
							stream.eat(/x/i)
							stream.eatWhile(/\d/);
							return helpers.cont("number", "number", state.freemarkerMode);
						} else if("tag" == state.freemarkerMode && "whitespace" == state.last && (stream.match("as",true) || stream.match("in",true)|| stream.match("using",true) )) {
							return helpers.cont("keyword", "operator", state.freemarkerMode);
						} else if("tag" == state.freemarkerMode && "whitespace" == state.last && (stream.match("gte",true) || stream.match("lte",true) || stream.match("gt",true) || stream.match("lt",true) )) {
							return helpers.cont("operator", "operator", state.freemarkerMode);
						} else {
							if ("builtin" == state.last ) {
								stream.eat("?");
								stream.eatWhile(regs.validIdentifier);
								return helpers.cont("builtin", "variable", state.freemarkerMode);
							} else if ("whitespace" == state.last||"bracket" == state.last) {
								if ("macro" == state.freemarkerMode ) {
									stream.eatWhile(regs.validIdentifier);
							        return helpers.cont("attribute", "attribute", state.freemarkerMode);
								}  else {
									stream.eatWhile(regs.validIdentifier);
							        return helpers.cont("variable-2", "variable", state.freemarkerMode);
								}
						    } else if ("operator" == state.last ) {
								stream.eatWhile(regs.validIdentifier);
								return helpers.cont("variable-2", "variable", state.freemarkerMode);
							} else if ("childVariable" == state.last ) {
								stream.eatWhile(regs.validIdentifier);
								return helpers.cont("variable-3", "variable", state.freemarkerMode);
							} else if (/\s/.test(ch) ) {
								last = "whitespace";
								return null;
							} else if ("string" == state.last ) {
								stream.eatWhile(regs.validIdentifier);
								return helpers.cont("attribute", "attribute", state.freemarkerMode);
							} else {
								if ("startTag" == state.last || "endTag" == state.last ) {
									if ("echo" == state.freemarkerMode ) {
										stream.eatWhile(regs.validIdentifier)
										return helpers.cont("variable-2", "variable", state.freemarkerMode);
									}
								}
								if ("tag" == state.freemarkerMode ) {
									var str = "";
									if (ch != "/" ) {
										str += ch;
									}
									var c = null;
									while (c = stream.eat(regs.validIdentifier)) {
										str += c;
									}
									for (var i = 0 ; i < keyFunctions.length; i++) {
										if ("#"+keyFunctions[i] == str ) {
											return helpers.cont("keyword", "keyword", state.freemarkerMode);
										}
									}
								}
							}
							return helpers.cont("error", "tag", state.freemarkerMode);
						}
					},

					inAttribute : function(quote) {
						return function(stream, state) {
							var prevChar = null;
							var currChar = null;
							while (!stream.eol()) {
								currChar = stream.peek();
								if (stream.next() == quote && '\\' !== prevChar ) {
									state.tokenize = parsers.freemarkerTemplate;
									break;
								}
								prevChar = currChar;
							}
							return "string";
						};
					},

					inBlock : function(style, terminator) {
						return function(stream, state) {
							while (!stream.eol()) {
								if (stream.match(terminator) ) {
									state.tokenize = parsers.tokenizer;
									break;
								}
								stream.next();
							}
							return style;
						};
					}
				};

				// the public API for CodeMirror
				return {
					startState : function() {
						return {
							tokenize : parsers.tokenizer, mode : "freemarker", last : null, freemarkerMode : null,
							depth : 0
						};
					}, token : function(stream, state) {
						state.last = last;
						state.freemarkerMode = freemarkerMode;
						return state.tokenize(stream, state);
					}, electricChars : ""
				};
			});

	CodeMirror.defineMIME("text/spiderflow", "spiderflow");

});