var KS = {};
/**
 * 工具函数包
 * @file
 * @module KS.utils
 * @since 1.0.0
 */

/**
 * 封装的静态工具函数
 * @module KS.utils
 * @unfile
 */
var utils = KS.utils = {

	/**
     * 用给定的迭代器遍历对象
     * @method each
     * @param { Object } obj 需要遍历的对象
     * @param { Function } iterator 迭代器， 该方法接受两个参数， 第一个参数是当前所处理的value， 第二个参数是当前遍历对象的key
     * @example
     * ```javascript
     * var demoObj = {
     *     key1: 1,
     *     key2: 2
     * };
     *
     * //output: key1: 1, key2: 2
     * KS.utils.each( demoObj, funciton ( value, key ) {
     *
     *     console.log( key + ":" + value );
     *
     * } );
     * ```
     */

    /**
     * 用给定的迭代器遍历数组或类数组对象
     * @method each
     * @param { Array } array 需要遍历的数组或者类数组
     * @param { Function } iterator 迭代器， 该方法接受两个参数， 第一个参数是当前所处理的value， 第二个参数是当前遍历对象的key
     * @example
     * ```javascript
     * var divs = document.getElmentByTagNames( "div" );
     *
     * //output: 0: DIV, 1: DIV ...
     * KS.utils.each( divs, funciton ( value, key ) {
     *
     *     console.log( key + ":" + value.tagName );
     *
     * } );
     * ```
     */
    each : function(obj, iterator, context) {
        if (obj == null) return;
        if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if(iterator.call(context, obj[i], i, obj) === false)
                    return false;
            }
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if(iterator.call(context, obj[key], key, obj) === false)
                        return false;
                }
            }
        }
    },
    /**
     * 移除数组array中所有的元素item
     * @method removeItem
     * @param { Array } array 要移除元素的目标数组
     * @param { * } item 将要被移除的元素
     * @remind 该方法的匹配过程使用的是恒等“===”
     * @example
     * ```javascript
     * var arr = [ 4, 5, 7, 1, 3, 4, 6 ];
     *
     * KS.utils.removeItem( arr, 4 );
     * //output: [ 5, 7, 1, 3, 6 ]
     * console.log( arr );
     *
     * ```
     */
    removeItem: function(array, item) {
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i] === item) {
                array.splice(i, 1);
                i--;
            }
        }
    },

    /**
     * 删除字符串str的首尾空格
     * @method trim
     * @param { String } str 需要删除首尾空格的字符串
     * @return { String } 删除了首尾的空格后的字符串
     */
    trim: function(str) {
        return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
    },
    /**
     * 将str中的html符号转义,将转义“'，&，<，"，>”五个字符
     * @method unhtml
     * @param { String } str 需要转义的字符串
     * @return { String } 转义后的字符串
     * @example
     * ```javascript
     * var html = '<body>&</body>';
     *
     * //output: &lt;body&gt;&amp;&lt;/body&gt;
     * console.log( KS.utils.unhtml( html ) );
     *
     * ```
     */
    unhtml: function(str, reg) {
        return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g, function(a, b) {
            if (b) {
                return a;
            } else {
                return {
                    '<': '&lt;',
                    '&': '&amp;',
                    '"': '&quot;',
                    '>': '&gt;',
                    "'": '&#39;'
                }[a]
            }

        }) : '';
    },
    /**
     * 将url中的html字符转义， 仅转义  ', ", <, > 四个字符
     * @param  { String } str 需要转义的字符串
     * @param  { RegExp } reg 自定义的正则
     * @return { String }     转义后的字符串
     */
    unhtmlForUrl: function(str, reg) {
        return str ? str.replace(reg || /[<">']/g, function(a) {
            return {
                '<': '&lt;',
                '&': '&amp;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[a]

        }) : '';
    },
    /**
     * 将str中的转义字符还原成html字符
     * @see KS.utils.unhtml(String);
     * @method html
     * @param { String } str 需要逆转义的字符串
     * @return { String } 逆转义后的字符串
     * @example
     * ```javascript
     *
     * var str = '&lt;body&gt;&amp;&lt;/body&gt;';
     *
     * //output: <body>&</body>
     * console.log( KS.utils.html( str ) );
     *
     * ```
     */
    html: function(str) {
        return str ? str.replace(/&((g|l|quo)t|amp|#39|nbsp);/g, function(m) {
            return {
                '&lt;': '<',
                '&amp;': '&',
                '&quot;': '"',
                '&gt;': '>',
                '&#39;': "'",
                '&nbsp;': ' '
            }[m]
        }) : '';
    },
    /**
     * 将css样式转换为驼峰的形式
     * @method cssStyleToDomStyle
     * @param { String } cssName 需要转换的css样式名
     * @return { String } 转换成驼峰形式后的css样式名
     * @example
     * ```javascript
     *
     * var str = 'border-top';
     *
     * //output: borderTop
     * console.log( KS.utils.cssStyleToDomStyle( str ) );
     *
     * ```
     */
    cssStyleToDomStyle: function() {
        cache = {};
        return function(cssName) {
            return cache[cssName] || (cache[cssName] = cssName.toLowerCase().replace(/-./g, function(match) {
                return match.charAt(1).toUpperCase();
            }));
        };
    }(),
    /**
     * 动态加载文件到doc中
     * @method loadFile
     * @param { DomDocument } document 需要加载资源文件的文档对象
     * @param { Object } options 加载资源文件的属性集合， 取值请参考代码示例
     * @example
     * ```javascript
     *
     * KS.utils.loadFile( document, {
     *     src:"test.js",
     *     tag:"script",
     *     type:"text/javascript",
     *     defer:"defer"
     * } );
     *
     * ```
     */

    /**
     * 动态加载文件到doc中，加载成功后执行的回调函数fn
     * @method loadFile
     * @param { DomDocument } document 需要加载资源文件的文档对象
     * @param { Object } options 加载资源文件的属性集合， 该集合支持的值是script标签和style标签支持的所有属性。
     * @param { Function } fn 资源文件加载成功之后执行的回调
     * @warning 对于在同一个文档中多次加载同一URL的文件， 该方法会在第一次加载之后缓存该请求，
     *           在此之后的所有同一URL的请求， 将会直接触发回调。
     * @example
     * ```javascript
     *
     * KS.utils.loadFile( document, {
     *     src:"test.js",
     *     tag:"script",
     *     type:"text/javascript",
     *     defer:"defer"
     * }, function () {
     *     console.log('加载成功');
     * } );
     *
     * ```
     */
    loadFile: function() {
        var tmpList = [];

        function getItem(doc, obj) {
            try {
                for (var i = 0, ci; ci = tmpList[i++];) {
                    if (ci.doc === doc && ci.url == (obj.src || obj.href)) {
                        return ci;
                    }
                }
            } catch (e) {
                return null;
            }

        }

        return function(doc, obj, fn) {
            var item = getItem(doc, obj);
            if (item) {
                if (item.ready) { //多次加载，后面的直接执行缓存里面的文件
                    fn && fn();
                } else { //
                    item.funs.push(fn) //把传入的回调保存起来
                }
                return;
            }
            tmpList.push({
                doc: doc,
                url: obj.src || obj.href,
                funs: [fn]
            });
            if (!doc.body) { //若没有body标签（不考虑dom性能）
                var html = [];
                for (var p in obj) { //给动态加载的标签添加属性
                    if (p == 'tag') continue;
                    html.push(p + '="' + obj[p] + '"')
                }
                //把添加的标签插入到html中
                doc.write('<' + obj.tag + ' ' + html.join(' ') + ' ></' + obj.tag + '>');
                return;
            }
            if (obj.id && doc.getElementById(obj.id)) { //传进来的标签的ID与页面已有标签ID冲突
                return;
            }
            var element = doc.createElement(obj.tag); //有body标签，动态创建一个对应的标签
            delete obj.tag;
            for (var p in obj) { //添加属性
                element.setAttribute(p, obj[p]);
            }
            element.onload = element.onreadystatechange = function() { //动态加载的标签加载完毕后触发此事件
                if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                    item = getItem(doc, obj);
                    if (item.funs.length > 0) {
                        item.ready = 1;
                        for (var fi; fi = item.funs.pop();) {
                            fi();
                        }
                    }
                    element.onload = element.onreadystatechange = null; //清空加载标签的load事件
                }
            };
            element.onerror = function() {
                throw Error('The load ' + (obj.href || obj.src) + ' fails ')
            };
            doc.getElementsByTagName("head")[0].appendChild(element);
        }
    }(),
    /**
     * 判断obj对象是否为空
     * @method isEmptyObject
     * @param { * } obj 需要判断的对象
     * @remind 如果判断的对象是NULL， 将直接返回true， 如果是数组且为空， 返回true， 如果是字符串， 且字符串为空，
     *          返回true， 如果是普通对象， 且该对象没有任何实例属性， 返回true
     * @return { Boolean } 对象是否为空
     * @example
     * ```javascript
     *
     * //output: true
     * console.log( KS.utils.isEmptyObject( {} ) );
     *
     * //output: true
     * console.log( KS.utils.isEmptyObject( [] ) );
     *
     * //output: true
     * console.log( KS.utils.isEmptyObject( "" ) );
     *
     * //output: false
     * console.log( KS.utils.isEmptyObject( { key: 1 } ) );
     *
     * //output: false
     * console.log( KS.utils.isEmptyObject( [1] ) );
     *
     * //output: false
     * console.log( KS.utils.isEmptyObject( "1" ) );
     *
     * ```
     */
    isEmptyObject: function(obj) {
        if (obj == null) return true;
        if (this.isArray(obj) || this.isString(obj)) return obj.length === 0;
        for (var key in obj)
            if (obj.hasOwnProperty(key)) return false;
        return true;
    },
    /**
     * 把rgb格式的颜色值转换成16进制格式
     * @method fixColor
     * @param { String } rgb格式的颜色值
     * @param { String }
     * @example
     * rgb(255,255,255)  => "#ffffff"
     */
    fixColor: function(name, value) {
        if (/color/i.test(name) && /rgba?/.test(value)) {
            var array = value.split(",");
            if (array.length > 3)
                return "";
            value = "#";
            for (var i = 0, color; color = array[i++];) {
                color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
                value += color.length == 1 ? "0" + color : color;
            }
            value = value.toUpperCase();
        }
        return value;
    },
    /**
     * 把cm／pt为单位的值转换为px为单位的值
     * @method transUnitToPx
     * @param { String } 待转换的带单位的字符串
     * @return { String } 转换为px为计量单位的值的字符串
     * @example
     * ```javascript
     *
     * //output: 500px
     * console.log( KS.utils.transUnitToPx( '20cm' ) );
     *
     * //output: 27px
     * console.log( KS.utils.transUnitToPx( '20pt' ) );
     *
     * ```
     */
    transUnitToPx: function(val) {
        if (!/(pt|cm)/.test(val)) {
            return val
        }
        var unit;
        val.replace(/([\d.]+)(\w+)/, function(str, v, u) {
            val = v;
            unit = u;
        });
        switch (unit) {
            case 'cm':
                val = parseFloat(val) * 25;
                break;
            case 'pt':
                val = Math.round(parseFloat(val) * 96 / 72);
        }
        return val + (val ? 'px' : '');
    },
    /**
     * 在dom树ready之后执行给定的回调函数
     * @method domReady
     * @remind 如果在执行该方法的时候， dom树已经ready， 那么回调函数将立刻执行
     * @param { Function } fn dom树ready之后的回调函数
     * @example
     * ```javascript
     *
     * KS.utils.domReady( function () {
     *
     *     console.log('123');
     *
     * } );
     *
     * ```
     */
    domReady: function() {

        var fnArr = [];

        function doReady(doc) {
            //确保onready只执行一次
            doc.isReady = true;
            for (var ci; ci = fnArr.pop(); ci()) {}
        }
        return function(onready, win) {
            win = win || window;
            var doc = win.document;
            onready && fnArr.push(onready);
            if (doc.readyState === "complete") {
                doReady(doc);
            } else {
                doc.isReady && doReady(doc);
                doc.addEventListener("DOMContentLoaded", function() {
                    doc.removeEventListener("DOMContentLoaded", arguments.callee, false);
                    doReady(doc);
                }, false);
                win.addEventListener('load', function() {
                    doReady(doc)
                }, false);
            }

        }
    }(),
    //格式化url
    formatUrl: function(url) {
        var u = url.replace(/&&/g, '&');
        u = u.replace(/\?&/g, '?');
        u = u.replace(/&$/g, '');
        u = u.replace(/&#/g, '#');
        u = u.replace(/&+/g, '&');
        return u;
    },
    clearEmptyAttrs: function(obj) {
        for (var p in obj) {
            if (obj[p] === '') {
                delete obj[p]
            }
        }
        return obj;
    },
    extend: function() { //from jq

        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};

            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !KS.utils.isFunction(target)) {
            target = {};
        }

        for (; i < length; i++) {

            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {

                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (KS.utils.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];

                        } else {
                            clone = src && KS.utils.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = KS.utils.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    },
    isPlainObject: function(obj) {//from jq
        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        // - DOM nodes
        // - window
        if (!KS.utils.isObject(obj, "Object") || obj.nodeType || KS.utils.isWindow(obj)) {
            return false;
        }

        if (obj.constructor &&
            !({}).hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }
        //如果函数执行到这里还没有return ,可以确定参数obj 是一个通过{}或者new Object构造的纯粹的对象
        // If the function hasn't returned already, we're confident that
        // |obj| is a plain object, created by {} or constructed with new Object
        return true;
    },
    isEmptyObject: function(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    },
    isWindow: function(obj) {
        return obj != null && obj === obj.window;
    },
}

/**
 * 判断给定的对象是否是字符串
 * @method isString
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是字符串
 */

/**
 * 判断给定的对象是否是数组
 * @method isArray
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是数组
 */

/**
 * 判断给定的对象是否是一个Function
 * @method isFunction
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是Function
 */

/**
 * 判断给定的对象是否是Number
 * @method isNumber
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是Number
 */

/**
 * 判断给定的对象是否是一个正则表达式
 * @method isRegExp
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是正则表达式
 */

/**
 * 判断给定的对象是否是一个普通对象
 * @method isObject
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是普通对象
 */

// ['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date'].forEach(function(v) {
//     KS.utils['is' + v] = function(obj) {
//         return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
//     }
// });
utils.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date'], function (v) {
    KS.utils['is' + v] = function (obj) {
        return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
    }
});
