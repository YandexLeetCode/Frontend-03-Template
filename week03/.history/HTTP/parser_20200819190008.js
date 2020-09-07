const css = require("css");

let currentAttribute = null;
let currentToken = null;
let stack = [{type: "document", children:[]}];
let currentTextNode = null;
// 增加 css 规则
let rules = [];
function addCSSRules(text){
    var ast = css.parse(text);
    // console.log(JSON.stringify(ast, null ,"     "));
    rules.push(...ast.stylesheet.rules);
}
function match(element, selector) {
    if(!selector|| !element.attributes){
        return false;
    }
    // 匹配 ID 选择器
    if(selector.charAt(0) === "#") {
       var attr = element.attributes.filter(attr => attr.name === "id")[0];
       if(attr && attr.value === selector.replace("#",'')){
           return true;
       }
    } else if(selector.charAt(0) === ".") {
        // 匹配 CLASS 选择器
        var attr = element.attributes.filter(attr => attr.name === "class")[0];
        if(attr && attr.value === selector.replace(".", '')) {
            return true;
        }
    } else {
        if(element.tagName === selector) {
            return true;
        }
    }
    return false;
}
function computeCSS(element) {
    // slice 根据传递字符 截断,如果不传数据 则复制整个串
    // reverse 从当前元素往外匹配 父元素
    var elements = stack.slice().reverse();
    if(!element.computedStyle){
        element.computedStyle = {};
    }
    // 处理选择器
    for(let rule of rules) {
        var selectorParts = rule.selectors[0].split(" ").reverse();
        if(!match(element,selectorParts[0])){
            continue;
        }
        let matched = false;
        var j = 1;
        // 元素 ,主要是 看此选择器作用是否在此元素上,进行的匹配
        for(var i = 0; i < elements.length; i++) {
            if(match(elements[i], selectorParts[j])) {
                j++;
            }
        }
        if(j >= selectorParts.length) {
            matched = true;
        }

        if(matched) {
            // 如果匹配上 则应用样式
            console.log("element ",element, "matched rule", rule);
        }
    }
}

function emit(token) {
    let top = stack[stack.length - 1];

    if(token.type === "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: []
        };

        element.tagName = token.tagName;

        for(let p in token){
            if(p != "type" && p != "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }
        // 计算 CSS 样式规则
        computeCSS(element)

        top.children.push(element);
        element.parent = top;

        if(!token.isSelfClosing) {
            stack.push(element);
        }

        currentTextNode = null;
    } else if(token.type === "endTag") {
        if(top.tagName !== token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            // 执行css 标签规则 
            if(top.tagName === "style"){
                addCSSRules(top.children[0].content);
            }
            stack.pop();
        }
        currentTextNode = null;
    } else if(token.type === "text") {
        if(currentTextNode === null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}


const EOF = Symbol("EOF")
function data(c) {
    if(c === "<") {
        return tagOpen;
    } else if(c === EOF) {
        emit({
            type: "EOF"
        });
        return ;
    } else {
        emit({
            type:"text",
            content:c
        });
        return data;
    }
}
function tagOpen(c) {
    if( c === "/") {
        return endTagOpen;
    } else if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c);
    } else if( c === ">") {

    } else if( c === EOF) {

    } else {

    }
}
function endTagOpen(c) {
    if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c);
    } else if(c === ">") {

    } else if(c === EOF) {

    } else {

    }
}
function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c === "/") {
        return selfClosingStartTag;
    } else if(c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c; //.toLowerCase();
        return tagName;
    } else if(c === ">") {
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}
function beforeAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c === "/" ||  c === ">" || c === EOF) {
        return afterAttributeName(c);
    } else if(c === "=") {

    } else {
        currentAttribute = {
            name: "" ,
            value: ""
        }
        return attributeName(c);
    }
}
function attributeName(c) {
    if(c.match('/^[\t\n\f ]$/') || c === "/" || c === ">" || c === EOF) {
        return afterAttributeName(c);
    } else if(c === "=") {
        return beforeAttributeValue;
    } else if(c === "\u0000") {

    } else if(c === "\"" || c === "'" || c === "<"){

    } else {
        currentAttribute.name += c;
        return attributeName;
    }

}
function beforeAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
        return beforeAttributeValue;
    } else if (c === "\"") {
        return doubleQuotedAttributeValue(c);
    } else if(c === "\'") {
        return singleQuotedAttributeValue;
    } else if(c === ">") {
        
    } else {
        return UnquotedAttributeValue(c);
    }
}
function doubleQuotedAttributeValue(c) {
    if(c === "\"") {
        currentTokenp[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c === "\u0000") {

    } else if(c === EOF) {
        
    } else {

    }
}
function singleQuotedAttributeValue(c) {
    if(c === "\'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c === "\u0000") {

    } else if(c === EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
function afterQuotedAttributeValue(c) {
    if(c.match(/^[\t\n\f]$/)) {
        return beforeAttributeValue;
    } else if(c === "/") {
        return selfClosingStartTag;
    } else if(c === ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c === EOF){

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
function UnquotedAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if(c === "/"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if(c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentAttribute);
        return data;
    } else if(c === "\u0000") {

    } else if(c === "\"" || c === "\'" || c === "<" || c === "=" || c === "`") {

    } else if(c === EOF){

    }else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}
function selfClosingStartTag(c) {
    if(c === ">") {
        currentToken.isSelfClosing = true;
        return data;
    } else if(c === "EOF") {

    } else {

    }
}
function afterAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if(c === "/") {
        return selfClosingStartTag;
    } else if(c === "=") {
        return beforeAttributeValue;
    } else if(c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if( c === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: ""
        };
        return attributeName(c);
    }
}
module.exports.parseHTML = function parseHTML(html) {
    console.log(html)
    let state = data;
    for(let c of html) {
        state = state(c)
    }

    state = state(EOF)
    console.log(stack[0])
}