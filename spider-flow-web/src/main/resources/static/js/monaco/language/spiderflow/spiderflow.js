function Stack() {
    this.dataStore = [];//保存栈内元素，初始化为一个空数组
    this.top = 0;//栈顶位置，初始化为0
}

Stack.prototype.push = function(element){
    this.dataStore[this.top++] = element;
}
Stack.prototype.current = function(){
    return this.dataStore[this.top - 1];
}
Stack.prototype.pop = function(){
    return this.dataStore[--this.top];
}

Stack.prototype.peek = function(){
    return this.dataStore[this.top-1];
}

Stack.prototype.clear = function(){
    this.top = 0;
}

Stack.prototype.length = function(){
    return this.top;
}
function Span(source,start,end){
    this.source = source;
    this.start = start;
    this.end = end;
    this.cachedText = source.substring(start, end);
}
Span.prototype.getText = function(){
    return this.cachedText;
}
Span.prototype.getSource = function(){
    return this.source;
}
Span.prototype.getStart = function(){
    return this.start;
}
Span.prototype.getEnd = function(){
    return this.end;
}
Span.prototype.toString = function(){
    return "Span [text=" + this.getText() + ", start=" + this.start + ", end=" + this.end + "]";;
}
function throwError(){
    var message = '';
    var span;
    for(var i=0,len = arguments.length;i<len;i++){
        var value = arguments[i];
        if(value instanceof Span){
            span = value
        }else{
            message += value + ' ';
        }

    }
    throw {message : message, span : span};
}
function CharacterStream(source,start,end){
    this.index = start === undefined ? 0 : start;
    this.end = end === undefined ? source.length : end;
    this.source = source;
    this.spanStart = 0;
}
CharacterStream.prototype.hasMore = function(){
    return this.index < this.end;
}
CharacterStream.prototype.consume = function(){
    return this.source.charAt(this.index++);
}
CharacterStream.prototype.match = function(needle,consume){
    if (typeof needle !== 'string') {
        needle = needle.literal;
    }
    var needleLength = needle.length;
    if(needleLength + this.index > this.end){
        return false;
    }
    for (var i = 0, j = this.index; i < needleLength; i++, j++) {
        if (this.index >= this.end) return false;
        if (needle.charAt(i) != this.source.charAt(j)) return false;
    }
    if (consume) this.index += needleLength;
    return true;
}
CharacterStream.prototype.matchDigit = function(consume){
    if (this.index >= this.end) return false;
    var c = this.source.charAt(this.index);
    if (!isNaN(c)) {
        if (consume) this.index++;
        return true;
    }
    return false;
}
CharacterStream.prototype.matchIdentifierStart = function(consume){
    if (this.index >= this.end) return false;
    var c = this.source.charAt(this.index);
    if (c.match(/\w/) || c == '$' || c == '_' || c == '@') {
        if (consume) this.index++;
        return true;
    }
    return false;
}
CharacterStream.prototype.matchIdentifierPart = function(consume){
    if (this.index >= this.end) return false;
    var c = this.source.charAt(this.index);
    if (c.match(/\w/) || c == '$' || c == '_') {
        if (consume) this.index++;
        return true;
    }
    return false;
}
CharacterStream.prototype.skipWhiteSpace = function(consume){
    while (true) {
        if (this.index >= this.end) return;
        var c = this.source.charAt(this.index);
        if (c == ' ' || c == '\n' || c == '\r' || c == '\t') {
            this.index++;
            continue;
        } else {
            break;
        }
    }
}
CharacterStream.prototype.startSpan = function(){
    this.spanStart = this.index;
}
CharacterStream.prototype.isSpanEmpty = function(){
    return this.spanStart == this.index;
}
CharacterStream.prototype.endSpan = function(){
    return new Span(this.source, this.spanStart, this.index);
}
CharacterStream.prototype.getPosition = function(){
    return this.index;
}
function Token(tokenType,span){
    this.type = tokenType;
    this.span = span;
}
Token.prototype.getTokenType = function(){
    return this.type;
}
Token.prototype.getSpan = function(){
    return this.span;
}
Token.prototype.getText = function(){
    return this.span.getText();
}
var TokenType = {
    TextBlock : {error:'一个文本'},
    Period : {literal:'.', error: '.'},
    Lambda : {literal:'->', error:'->'},
    Comma : {literal:',', error: ','},
    Semicolon : {literal:';', error: ';'},
    Colon : {literal:':', error: ':'},
    Plus : {literal:'+', error: '+'},
    Minus : {literal:'-', error: '-'},
    Asterisk : {literal:'*', error: '*'},
    ForwardSlash : {literal:'/', error: '/'},
    PostSlash : {literal:'\\', error: '\\'},
    Percentage : {literal:'%', error: '%'},
    LeftParantheses : {literal:'(', error: '('},
    RightParantheses : {literal:')', error: ')'},
    LeftBracket : {literal:'[', error: '['},
    RightBracket : {literal:']', error: ']'},
    LeftCurly : {literal:'{', error: '{'},
    RightCurly : {error:'}'},// 特殊待遇！
    Less : {literal:'<', error: '<'},
    Greater : {literal:'>', error: '>'},
    LessEqual : {literal:'<=', error: '<='},
    GreaterEqual : {literal:'>=', error: '>='},
    Equal : {literal:'==', error: '=='},
    NotEqual : {literal:'!=', error: '!='},
    Assignment : {literal:'=', error: '='},
    And : {literal:'&&', error: '&&'},
    Or : {literal:'||', error: '||'},
    Xor : {literal:'^', error: '^'},
    Not : {literal:'!', error: '!'},
    Questionmark : {literal:'?', error: '?'},
    DoubleQuote : {literal:'"', error: '"'},
    SingleQuote : {literal:'\'', error: '\''},
    BooleanLiteral : {error:'true 或 false'},
    DoubleLiteral : {error:'一个 double 类型数值'},
    FloatLiteral : {error:'一个 float 类型数值'},
    LongLiteral : {error:'一个 long 类型数值'},
    IntegerLiteral : {error:'一个 int 类型数值'},
    ShortLiteral : {error:'一个 short 类型数值'},
    ByteLiteral : {error:'一个 byte 类型数据'},
    CharacterLiteral : {error:'一个 char 类型数据'},
    StringLiteral : {error:'一个 字符串'},
    NullLiteral : {error:'null'},
    Identifier : {error:'标识符'}
}
var tokenTypeValues = Object.getOwnPropertyNames(TokenType).map(e=>TokenType[e]);
TokenType.getSortedValues = function(){
    if(this.values){
        return this.values;
    }
    this.values = tokenTypeValues.sort(function(o1,o2){
        if (!o1.literal && !o2.literal) {
            return 0;
        }
        if (!o1.literal && !!o2.literal) {
            return 1;
        }
        if (!!o1.literal && !o2.literal) {
            return -1;
        }
        return o2.literal.length - o1.literal.length;
    })
    return this.values;
}
function TokenStream(tokens){
    this.tokens = tokens;
    this.index = 0;
    this.end = tokens.length;
}
TokenStream.prototype.hasMore = function(){
    return this.index < this.end;
}
TokenStream.prototype.getToken = function(consume){
    var token = this.tokens[this.index];
    if(consume){
        this.index++;
    }
    return token;
}
function Tokenizer(){}
Tokenizer.prototype.tokenize = function(source,throwException){
    var tokens = [];
    if (source.length > 0){
        try{
            var stream = new CharacterStream(source);
            stream.startSpan();
            var re;
            while (stream.hasMore()) {
                if (stream.match("${", false)) {
                    if (!stream.isSpanEmpty()) tokens.push(new Token(TokenType.TextBlock, stream.endSpan()));
                    stream.startSpan();
                    var isContinue = false;
                    do{
                        while (!stream.match("}", true)) {
                            if (!stream.hasMore()) throwError("Did not find closing }.", stream.endSpan());
                            stream.consume();
                        }
                        try{
                            tokens = tokens.concat(this.tokenizeCodeSpan(stream.endSpan()));
                            isContinue = false;
                            re = null;
                        }catch(e){
                            re = e;
                            if(stream.hasMore()){
                                isContinue = true;
                            }
                        }

                    }while(isContinue);
                    if(re != null){
                        if(throwException){
                            throw re;
                        }
                        return tokens;
                    }
                    stream.startSpan();
                } else {
                    stream.consume();
                }
            }
            if (!stream.isSpanEmpty()) tokens.push(new Token(TokenType.TextBlock, stream.endSpan()));
        }catch(ex){
            if(throwException){
                throw ex;
            }
        }
    }
    return tokens;
}
Tokenizer.prototype.tokenizeCodeSpan = function(span){
    var source = span.getSource();
    var stream = new CharacterStream(source, span.getStart(), span.getEnd());
    var tokens = [];
    if (!stream.match("${", true)) throwError("Expected ${", new Span(source, stream.getPosition(), stream.getPosition() + 1));
    var leftCount = 0;
    var rightCount = 0;
    while (stream.hasMore()) {
        stream.skipWhiteSpace();
        if (stream.matchDigit(false)) {
            var type = TokenType.IntegerLiteral;
            stream.startSpan();
            while (stream.matchDigit(true))
                ;
            if (stream.match(TokenType.Period, true)) {
                type = TokenType.FloatLiteral;
                while (stream.matchDigit(true))
                    ;
            }
            if (stream.match("b", true) || stream.match("B", true)) {
                if (type == TokenType.FloatLiteral) throwError("Byte literal can not have a decimal point.", stream.endSpan());
                type = TokenType.ByteLiteral;
            } else if (stream.match("s", true) || stream.match("S", true)) {
                if (type == TokenType.FloatLiteral) throwError("Short literal can not have a decimal point.", stream.endSpan());
                type = TokenType.ShortLiteral;
            } else if (stream.match("l", true) || stream.match("L", true)) {
                if (type == TokenType.FloatLiteral) throwError("Long literal can not have a decimal point.", stream.endSpan());
                type = TokenType.LongLiteral;
            } else if (stream.match("f", true) || stream.match("F", true)) {
                type = TokenType.FloatLiteral;
            } else if (stream.match("d", true) || stream.match("D", true)) {
                type = TokenType.DoubleLiteral;
            }
            tokens.push(new Token(type, stream.endSpan()));
            continue;
        }

        // String literal
        if (stream.match(TokenType.SingleQuote, true)) {
            stream.startSpan();
            var matchedEndQuote = false;
            while (stream.hasMore()) {
                // Note: escape sequences like \n are parsed in StringLiteral
                if (stream.match("\\", true)) {
                    stream.consume();
                }
                if (stream.match(TokenType.SingleQuote, true)) {
                    matchedEndQuote = true;
                    break;
                }
                stream.consume();
            }
            if (!matchedEndQuote) throwError("字符串没有结束符\'", stream.endSpan());
            var stringSpan = stream.endSpan();
            stringSpan = new Span(stringSpan.getSource(), stringSpan.getStart() - 1, stringSpan.getEnd());
            tokens.push(new Token(TokenType.StringLiteral, stringSpan));
            continue;
        }

        // String literal
        if (stream.match(TokenType.DoubleQuote, true)) {
            stream.startSpan();
            var matchedEndQuote = false;
            while (stream.hasMore()) {
                // Note: escape sequences like \n are parsed in StringLiteral
                if (stream.match("\\", true)) {
                    stream.consume();
                }
                if (stream.match(TokenType.DoubleQuote, true)) {
                    matchedEndQuote = true;
                    break;
                }
                stream.consume();
            }
            if (!matchedEndQuote) throwError("字符串没有结束符\"", stream.endSpan());
            var stringSpan = stream.endSpan();
            stringSpan = new Span(stringSpan.getSource(), stringSpan.getStart() - 1, stringSpan.getEnd());
            tokens.push(new Token(TokenType.StringLiteral, stringSpan));
            continue;
        }

        // Identifier, keyword, boolean literal, or null literal
        if (stream.matchIdentifierStart(true)) {
            stream.startSpan();
            while (stream.matchIdentifierPart(true))
                ;
            var identifierSpan = stream.endSpan();
            identifierSpan = new Span(identifierSpan.getSource(), identifierSpan.getStart() - 1, identifierSpan.getEnd());
            if (identifierSpan.getText() == "true" || identifierSpan.getText() == "false") {
                tokens.push(new Token(TokenType.BooleanLiteral, identifierSpan));
            } else if (identifierSpan.getText() == "null") {
                tokens.push(new Token(TokenType.NullLiteral, identifierSpan));
            } else {
                tokens.push(new Token(TokenType.Identifier, identifierSpan));
            }
            continue;
        }

        var contineOuter = false;
        // Simple tokens
        var sortedValues = TokenType.getSortedValues();
        for (var i=0,len = sortedValues.length;i<len;i++) {
            var t = sortedValues[i]
            if (!!t.literal) {
                if (stream.match(t.literal, true)) {
                    if(t == TokenType.LeftCurly){
                        leftCount ++;
                    }
                    tokens.push(new Token(t.literal, new Span(source, stream.getPosition() - t.literal.length, stream.getPosition())));
                    contineOuter = true;
                    break;
                }
            }
        }
        if(contineOuter){
            continue;
        }
        if(leftCount!=rightCount&&stream.match("}", true)){
            rightCount++;
            tokens.push(new Token(TokenType.RightCurly, new Span(source, stream.getPosition() - 1, stream.getPosition())));
            contineOuter = true;
        }
        if(contineOuter){
            continue;
        }
        // match closing tag
        if (stream.match("}", false)) break;

        throwError("Unknown token", new Span(source, stream.getPosition(), stream.getPosition() + 1));
    }
    if (stream.hasMore() && !stream.match("}", true)) throwError("Expected }", new Span(source, stream.getPosition(), stream.getPosition() + 1));
    return tokens;
}

function SpiderFlowGrammer(clazz){
    this.clazz = clazz;
    this.init();
}
SpiderFlowGrammer.prototype.reset = function(clazz){
    this.clazz = clazz;
    this.init();
}
SpiderFlowGrammer.prototype.init = function(){
    if(this.clazz){
        for(var key in this.clazz){
            var methods = this.clazz[key].methods;
            for(var i = 0,len = methods.length;i<len;i++){
                var method = methods[i];
                method.insertText = method.name;
                if(method.parameters.length > 0){
                    var params = [];
                    var params1 = [];
                    var params2 = [];
                    for(var j=0;j<method.parameters.length;j++){
                        params.push('${'+(j+1)+':'+method.parameters[j].name+'}');
                        params1.push(method.parameters[j].name);
                        params2.push(method.parameters[j].type + " " + method.parameters[j].name);
                    }
                    if(!method.comment){
                        method.comment = method.returnType + ':'+method.name+'('+params1.join(',')+')';
                    }
                    method.fullName = method.name+'('+params2.join(', ')+')';
                    method.insertText += '(' + params.join(',') + ')';
                }else{
                    method.insertText += '()';
                    method.fullName = method.name+'()';
                    if(!method.comment){
                        method.comment = method.returnType + ':'+method.name+'()';
                    }
                }
            }
        }
        this.clazz.resp = this.clazz.SpiderResponse;
        this.clazz.resp.kind = 'Constant';
        this.clazz.resp.sortText = ' ~';
        var lambdasArrayFunctions = [];
        var makeLambdaFunction = function (name, returnType, fullName, comment, insertText) {
            return {
                name : name,
                kind: 'Function',
                returnType : returnType,
                parameters : [{
                    name : 'call',
                    type : 'function'
                }],
                sortText: fullName.replace(/([()])/g, '~$1'),
                fullName : fullName,
                comment : comment,
                insertText : insertText
            };
        }
        lambdasArrayFunctions.push(makeLambdaFunction('filter', 'List', 'filter(e->expression)', '过滤列表元素，返回符合条件的数据', 'filter(e->${1:true})'));
        lambdasArrayFunctions.push(makeLambdaFunction('filter', 'List', 'filter((e,i)->expression)', '过滤列表元素，返回符合条件的数据', 'filter((e,i)->${1:true})'));
        lambdasArrayFunctions.push(makeLambdaFunction('map', 'List', 'map(e->expression)', '将列表中的元素转为其他类型数据', 'map(e->${1:e})'));
        lambdasArrayFunctions.push(makeLambdaFunction('map', 'List', 'map((e,i)->expression)', '将列表中的元素转为其他类型数据', 'map((e,i)->${1:e})'));
        lambdasArrayFunctions.push(makeLambdaFunction('reduce', 'Object', 'reduce((a,b)->expression)', '将列表中的元素整合为一个数据', 'reduce((a,b)->${1:a+b})'));
        lambdasArrayFunctions.push(makeLambdaFunction('sort', 'List', 'sort((a,b)->expression)', '将列表中的元素进行排序', 'sort((a,b)->${1:a-b})'));
        lambdasArrayFunctions.push(makeLambdaFunction('distinct', 'List', 'distinct(e->expression)', '将列表中的元素按条件去重', 'sort(e->${1:e})'));
        lambdasArrayFunctions.push(makeLambdaFunction('distinct', 'List', 'distinct((e,i)->expression)', '将列表中的元素按条件去重', 'distinct((e,i)->${1:e})'));
        lambdasArrayFunctions.push(makeLambdaFunction('every', 'boolean', 'every(e->expression)', '是否每个元素都符合条件', 'every(e->${1:true})'));
        lambdasArrayFunctions.push(makeLambdaFunction('every', 'boolean', 'every((e,i)->expression)', '是否每个元素都符合条件', 'every((e,i)->${1:true})'));
        lambdasArrayFunctions.push(makeLambdaFunction('some', 'boolean', 'some(e->expression)', '是否至少有一个元素都符合条件', 'some(e->${1:true})'));
        lambdasArrayFunctions.push(makeLambdaFunction('some', 'boolean', 'some((e,i)->expression)', '是否至少有一个元素都符合条件', 'some((e,i)->${1:true})'));
        // var types = new Set()
        // for(var k in this.clazz){
        //     this.clazz[k].methods.forEach(e=>types.add(e.returnType))
        // }
        // console.log(Array.from(types))
        var _this = this;
        var pushMethod = function (type, lambdaFunction) {
            if (!_this.clazz[type]) {
                _this.clazz[type] = {methods:[],attributes:[]}
            }
            _this.clazz[type].methods.push(lambdaFunction)
        }
        for (let i = 0; i < lambdasArrayFunctions.length; i++) {
            pushMethod('List', lambdasArrayFunctions[i])
            pushMethod('Set', lambdasArrayFunctions[i])
            pushMethod('Elements', lambdasArrayFunctions[i])
            pushMethod('String[]', lambdasArrayFunctions[i])
            pushMethod('Object[]', lambdasArrayFunctions[i])
        }
        delete this.clazz.void;
    }
}
SpiderFlowGrammer.prototype.findHoverSuggestion = function(inputs){
    var target;
    var method;
    var owner;
    for(var i=0;i<inputs.length;i++){
        var input = inputs[i];
        if(!target){
            target = this.clazz[input];
            owner = target;
        }else{
            for(var j=0;j<target.methods.length;j++){
                if(target.methods[j].name == input){
                    method = target.methods[j];
                    owner = target;
                    target = this.clazz[method.returnType];
                    break;
                }
            }
        }
    }
    var contents = [];
    if(target){
        contents.push({
            value : '**'+owner.className+'**'
        })
    }
    if(method){
        contents.push(method.fullName);
        if(method.comment){
            contents.push({
                value : method.comment
            });
        }
        if(method.example){
            contents.push({
                value : '```spiderflow\n' + method.example + '\n```'
            });
        }
    }
    return contents;
}
SpiderFlowGrammer.prototype.findSuggestions = function(inputs){
    var target;
    for(var i=0;i<inputs.length;i++){
        var input = inputs[i];
        if(!target){
            target = this.clazz[input];
        }else{
            for(var j=0;j<target.attributes.length;j++){
                if(target.attributes[j].name == input){
                    target = this.clazz[target.attributes[j].type];
                    break;
                }
            }
            for(var j=0;j<target.methods.length;j++){
                if(target.methods[j].name == input){
                    target = this.clazz[target.methods[j].returnType];
                    break;
                }
            }
        }
    }
    var suggestions = [];
    if(target){
        for(var j=0;j<target.attributes.length;j++){
            var attribute = target.attributes[j];
            suggestions.push({
                label: attribute.name,
                kind: monaco.languages.CompletionItemKind[attribute.kind] || monaco.languages.CompletionItemKind.Field,
                detail : attribute.type + ":" + attribute.name,
                insertText: attribute.name,
                sortText : ' ~~' + attribute.name
                //insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })
        }
        for(var j=0;j<target.methods.length;j++){
            var method = target.methods[j];
            suggestions.push({
                sortText : method.sortText || method.fullName,
                label: method.fullName,
                kind: monaco.languages.CompletionItemKind[method.kind] || monaco.languages.CompletionItemKind.Method,
                detail : method.comment,
                insertText: method.insertText,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })
        }
    }
    if(inputs.length == 0){
        for(var key in this.clazz){
            var value = this.clazz[key];
            if(/^[a-z]+$/.test(key.charAt(0))){
                suggestions.push({
                    sortText : value.sortText || ' ~' + key,
                    label: key,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: key,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                })
            }
        }
    }else{
        target = this.clazz['Object'];
        for(var j=0;j<target.methods.length;j++){
            var method = target.methods[j];
            suggestions.push({
                sortText : '~~~~~~' + method.fullName,
                label: method.fullName,
                kind: monaco.languages.CompletionItemKind.Method,
                detail : method.comment,
                insertText: method.insertText,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })
        }
    }
    return suggestions;
}
var spiderflowGrammer = new SpiderFlowGrammer();
require(['vs/editor/editor.main'], function() {
    monaco.languages.register({ id :'spiderflow'});
    monaco.editor.defineTheme('spiderflow', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'object.null', foreground: 'ff0001' },
            { token: 'method.call.empty', foreground: 'ff0000', fontStyle: 'bold' },
        ]
    });
    monaco.languages.setLanguageConfiguration('spiderflow',{
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        operators: ['<=', '>=', '==', '!=', '+', '-','*', '/', '%', '&','|', '!', '&&', '||', '?', ':', ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"', notIn: ['string'] },
            { open: '\'', close: '\'', notIn: ['string'] },
        ],
    })

    monaco.languages.setMonarchTokensProvider('spiderflow',{
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        tokenizer : {
            root : [
                [/\$\{/, { token: 'sf-start', next: '@spiderflow_start' }],
            ],
            spiderflow_start : [
                [/null/, {token : 'object.null'}],
                [/[a-zA-Z_$][\w$]*/,{token : 'type.identifier'}],
                [/\./, {token : 'period'}],
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                [/"/, 'string', '@string_double'],
                [/'/, 'string', '@string_single'],
                [/\}/, { token: 'sf-end', next: '@pop' }],
            ],
            string_double: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, 'string', '@pop']
            ],
            string_single: [
                [/[^\\']+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/'/, 'string', '@pop']
            ],
        }
    })

    monaco.languages.registerHoverProvider('spiderflow',{
        provideHover : function(model,position,token){
            var line = model.getLineContent(position.lineNumber);
            var _tokens = new Tokenizer().tokenize(line);
            var tokens = [];
            for(var i =0,len = _tokens.length;i<len;i++){
                var token = _tokens[i];
                var span = token.getSpan();
                if(span.getStart() < position.column){
                    tokens.push(token);
                }
            }
            if(tokens.length > 0 && tokens[tokens.length - 1].getTokenType() == TokenType.Identifier){
                var stream = new TokenStream(tokens);
                var stack = new Stack();
                var array = [];
                stack.push(array);
                while(stream.hasMore()){
                    var token = stream.getToken(true);
                    var tokenType = token.getTokenType();
                    if(tokenType == TokenType.LeftParantheses || tokenType == TokenType.LeftBracket || tokenType == TokenType.Lambda){
                        array = [];
                        stack.push(array);
                    }else if(tokenType == TokenType.RightParantheses || tokenType == TokenType.RightBracket){
                        stack.pop();
                        array = stack.current();
                    }else if(tokenType == TokenType.Identifier){
                        array.push(token.getSpan().getText())
                    }
                }
                return {
                    contents : spiderflowGrammer.findHoverSuggestion(array)
                }
            }
            return {
                contents : []
            }
        }
    });

    monaco.languages.registerCompletionItemProvider('spiderflow',{
        provideCompletionItems : function(model,position,context,token){
            var line = model.getLineContent(position.lineNumber).substring(0, position.column);
            var tokens = new Tokenizer().tokenize(line + '}');
            var stream = new TokenStream(tokens);
            var stack = new Stack();
            var array = [];
            stack.push(array);
            while(stream.hasMore()){
                var token = stream.getToken(true);
                var tokenType = token.getTokenType();
                if(tokenType == TokenType.LeftParantheses || tokenType == TokenType.LeftBracket){
                    array = [];
                    stack.push(array);
                }else if(tokenType == TokenType.RightParantheses || tokenType == TokenType.RightBracket){
                    stack.pop();
                    array = stack.current();
                }else if(tokenType == TokenType.Identifier){
                    array.push(token.getSpan().getText())
                }
            }
            return {
                suggestions : spiderflowGrammer.findSuggestions(array)
            };
        },
        triggerCharacters : ['.','{']
    })
})