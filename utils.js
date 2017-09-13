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
    each: function(obj, iterator, context) {
        if (obj == null) return;
        if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === false)
                    return false;
            }
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (iterator.call(context, obj[key], key, obj) === false)
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
                "'": '&#39;',
                '`': '&#x60;'
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
    isPlainObject: function(obj) { //from jq
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
    // 返回一个 [min, max] 范围内的任意整数
    random: function(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    },
    // 判断是否是有限的数字
    isFinite: function(obj) {
        //直接用现有方法
        return isFinite(obj) && !KS.utils.isNaN(parseFloat(obj));
    },
    isNaN: function(obj) {
        return KS.utils.isNumber(obj) && obj !== +obj;
    },
    isBoolean: function(obj) {
        return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
    },
    // 判断是否是 null
    isNull: function(obj) {
        return obj === null;
    },
    // 判断是否是 undefined
    // undefined 能被改写 （IE < 9）
    // undefined 只是全局对象的一个属性
    // 在局部环境能被重新定义
    // 但是「void 0」始终是 undefined
    isUndefined: function(obj) {
        return obj === void 0;
    },
    // 判断对象中是否有指定 key
    // own properties, not on a prototype
    has: function(obj, key) {
        // obj 不能为 null 或者 undefined
        return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
    },
    // 判断是否是 ArrayLike Object
    // 类数组，即拥有 length 属性并且 length 属性值为 Number 类型的元素
    // 包括数组、arguments、HTML Collection 以及 NodeList 等等
    // 包括类似 {length: 10} 这样的对象
    // 包括字符串、函数等
    isArrayLike: function(collection) {
        // 返回参数 collection 的 length 属性值
        function property(key) {
            return function(obj) {
                return obj == null ? void 0 : obj[key];
            };
        }
        // getLength 函数
        // 该函数传入一个参数，返回参数的 length 属性值
        // 用来获取 array 以及 arrayLike 元素的 length 属性值
        var getLength = property('length');
        // Math.pow(2, 53) - 1 是 JavaScript 中能精确表示的最大数字
        var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    },
    // 将一个对象的 key-value 键值对颠倒
    // 即原来的 key 为 value 值，原来的 value 值为 key 值
    // 需要注意的是，value 值不能重复（不然后面的会覆盖前面的）
    // 且新构造的对象符合对象构造规则
    // 并且返回新构造的对象
    invert: function(obj) {
        // 返回的新的对象
        var result = {};
        var keys = KS.utils.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    },
    // _.keys({one: 1, two: 2, three: 3});
    // => ["one", "two", "three"]
    // ===== //
    // 返回一个对象的 keys 组成的数组
    // 仅返回 own enumerable properties 组成的数组
    keys: function(obj) {
        // 容错
        // 如果传入的参数不是对象，则返回空数组
        if (!KS.utils.isObject(obj)) return [];

        // 如果浏览器支持 ES5 Object.key() 方法
        // 则优先使用该方法
        if (Object.key) return Object.key(obj);

        var keys = [];

        // own enumerable properties
        for (var key in obj)
        // hasOwnProperty
            if (KS.utils.has(obj, key)) keys.push(key);

        return keys;
    },
    // 返回一个对象的 keys 数组
    // 不仅仅是 own enumerable properties
    // 还包括原型链上继承的属性
    allKeys: function(obj) {
        // 容错
        // 不是对象，则返回空数组
        if (!KS.utils.isObject(obj)) return [];

        var keys = [];
        for (var key in obj) keys.push(key);

        return keys;
    },
    // _.values({one: 1, two: 2, three: 3});
    // => [1, 2, 3]
    // ===== //
    // 将一个对象的所有 values 值放入数组中
    // 仅限 own properties 上的 values
    // 不包括原型链上的
    // 并返回该数组
    values: function(obj) {
        // 仅包括 own properties
        var keys = KS.utils.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    },
    // attrs 参数为一个对象
    // 判断 object 对象中是否有 attrs 中的所有 key-value 键值对
    // 返回布尔值
    isMatch: function(object, attrs) {
        // 提取 attrs 对象的所有 keys
        var keys = KS.utils.keys(attrs),
            length = keys.length;

        // 如果 object 为空
        // 根据 attrs 的键值对数量返回布尔值
        if (object == null) return !length;
        var obj = Object(object);

        // 遍历 attrs 对象键值对
        for (var i = 0; i < length; i++) {
            var key = keys[i];

            // 如果 obj 对象没有 attrs 对象的某个 key
            // 或者对于某个 key，它们的 value 值不同
            // 则证明 object 并不拥有 attrs 的所有键值对
            // 则返回 false
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }

        return true;
    },
    //传入参数可以说一个一个的数字，也可以是一个数组
    max: function() {
        if (arguments.length == 0) { return false }
        if (arguments.length > 1) {
            return Math.max.apply(Math, arguments)
        } else {
            if (KS.utils.isArray(arguments[0])) {
                return Math.max.apply(Math, arguments[0])
            }
            return arguments[0]
        }
    },
    min: function() {
        if (arguments.length == 0) { return false }
        if (arguments.length > 1) {
            return Math.min.apply(Math, arguments)
        } else {
            if (KS.utils.isArray(arguments[0])) {
                return Math.min.apply(Math, arguments[0])
            }
            return arguments[0]
        }
    },
    // 判断是否为 DOM 元素
    isElement: function(obj) {
        // 确保 obj 不是 null, undefined 等假值
        // 并且 obj.nodeType === 1
        return !!(obj && obj.nodeType === 1);
    },
    // 将数组乱序
    // 如果是对象，则返回一个数组，数组由对象 value 值构成
    // Fisher-Yates shuffle 算法
    // 最优的洗牌算法，复杂度 O(n)
    // 乱序不要用 sort + Math.random()，复杂度 O(nlogn)
    // 而且，并不是真正的乱序
    shuffle: function(obj) {
        // 如果是对象，则对 value 值进行乱序
        var set = utils.isArrayLike(obj) ? obj : utils.values(obj);
        var length = set.length;

        // 乱序后返回的数组副本（参数是对象则返回乱序后的 value 数组）
        var shuffled = Array(length);

        // 枚举元素
        for (var index = 0, rand; index < length; index++) {
            // 将当前所枚举位置的元素和 `index=rand` 位置的元素交换
            rand = utils.random(0, index);
            if (rand !== index) shuffled[index] = shuffled[rand];
            shuffled[rand] = set[index];
        }

        return shuffled;
    },
    // 随机返回数组或者对象中的一个元素
    // 如果指定了参数 `n`，则随机返回 n 个元素组成的数组
    // 如果参数是对象，则数组由 values 组成
    sample: function(obj, n, guard) {
        // 随机返回一个元素 null==undefined ==> true
        if (n == null || guard) {
            if (!utils.isArrayLike(obj)) obj = utils.values(obj);
            return obj[utils.random(obj.length - 1)];
        }

        // 随机返回 n 个
        return utils.shuffle(obj).slice(0, Math.max(0, n));
    },
    // 返回某一个范围内的数组成的数组
    range: function(start, stop, step) {
        if (stop == null) {
            stop = start || 0;
            start = 0;
        }

        step = step || 1;

        // 返回数组的长度
        var length = Math.max(Math.ceil((stop - start) / step), 0);

        // 返回的数组
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }

        return range;
    },
    // 函数节流（如果有连续事件响应，则每间隔一定时间段触发）
    // 每间隔 wait(Number) milliseconds 触发一次 func 方法
    // 如果 options 参数传入 {leading: false}
    // 那么不会马上触发（等待 wait milliseconds 后第一次触发 func）
    // 如果 options 参数传入 {trailing: false}
    // 那么最后一次回调不会被触发
    // **Notice: options 不能同时设置 leading 和 trailing 为 false**
    // 示例：
    // var throttled = _.throttle(updatePosition, 100);
    // $(window).scroll(throttled);
    // 调用方式（注意看 A 和 B console.log 打印的位置）：
    // _.throttle(function, wait, [options])
    // sample 1: _.throttle(function(){}, 1000)
    // print: A, B, B, B ...
    // sample 2: _.throttle(function(){}, 1000, {leading: false})
    // print: B, B, B, B ...
    // sample 3: _.throttle(function(){}, 1000, {trailing: false})
    // print: A, A, A, A ...
    // ----------------------------------------- //
    throttle: function(func, wait, options) {
        var context, args, result;

        // setTimeout 的 handler
        var timeout = null;

        // 标记时间戳
        // 上一次执行回调的时间戳
        var previous = 0;

        // 如果没有传入 options 参数
        // 则将 options 参数置为空对象
        if (!options)
            options = {};

        var later = function() {
            // 如果 options.leading === false
            // 则每次触发回调后将 previous 置为 0
            // 否则置为当前时间戳
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            // console.log('B')
            result = func.apply(context, args);

            // 这里的 timeout 变量一定是 null 了吧
            // 是否没有必要进行判断？
            if (!timeout)
                context = args = null;
        };

        // 以滚轮事件为例（scroll）
        // 每次触发滚轮事件即执行这个返回的方法
        // _.throttle 方法返回的函数
        return function() {
            // 记录当前时间戳
            var now = Date.now();

            // 第一次执行回调（此时 previous 为 0，之后 previous 值为上一次时间戳）
            // 并且如果程序设定第一个回调不是立即执行的（options.leading === false）
            // 则将 previous 值（表示上次执行的时间戳）设为 now 的时间戳（第一次触发时）
            // 表示刚执行过，这次就不用执行了
            if (!previous && options.leading === false)
                previous = now;

            // 距离下次触发 func 还需要等待的时间
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;

            // 要么是到了间隔时间了，随即触发方法（remaining <= 0）
            // 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
            // 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
            // 之后便会把 previous 值迅速置为 now
            // ========= //
            // remaining > wait，表示客户端系统时间被调整过
            // 则马上执行 func 函数
            // ========= //

            // console.log(remaining) 可以打印出来看看
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    // 解除引用，防止内存泄露
                    timeout = null;
                }

                // 重置前一次触发的时间戳
                previous = now;

                // 触发方法
                // result 为该方法返回值
                // console.log('A')
                result = func.apply(context, args);

                // 引用置为空，防止内存泄露
                // 感觉这里的 timeout 肯定是 null 啊？这个 if 判断没必要吧？
                if (!timeout)
                    context = args = null;
            } else if (!timeout && options.trailing !== false) { // 最后一次需要触发的情况
                // 如果已经存在一个定时器，则不会进入该 if 分支
                // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
                // 间隔 remaining milliseconds 后触发 later 方法
                timeout = setTimeout(later, remaining);
            }

            // 回调返回值
            return result;
        };
    },
    // 函数去抖（连续事件触发结束后只触发一次）
    // sample 1: _.debounce(function(){}, 1000)
    // 连续事件结束后的 1000ms 后触发
    // sample 1: _.debounce(function(){}, 1000, true)
    // 连续事件触发后立即触发（此时会忽略第二个参数）
    debounce: function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function() {
            // 定时器设置的回调 later 方法的触发时间，和连续事件触发的最后一次时间戳的间隔
            // 如果间隔为 wait（或者刚好大于 wait），则触发事件
            var last = Date.now() - timestamp;

            // 时间间隔 last 在 [0, wait) 中
            // 还没到触发的点，则继续设置定时器
            // last 值应该不会小于 0 吧？
            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                // 到了可以触发的时间点
                timeout = null;
                // 可以触发了
                // 并且不是设置为立即触发的
                // 因为如果是立即触发（callNow），也会进入这个回调中
                // 主要是为了将 timeout 值置为空，使之不影响下次连续事件的触发
                // 如果不是立即执行，随即执行 func 方法
                if (!immediate) {
                    // 执行 func 函数
                    result = func.apply(context, args);
                    // 这里的 timeout 一定是 null 了吧
                    // 感觉这个判断多余了
                    if (!timeout)
                        context = args = null;
                }
            }
        };

        // 嗯，闭包返回的函数，是可以传入参数的
        // 也是 DOM 事件所触发的回调函数
        return function() {
            // 可以指定 this 指向
            context = this;
            args = arguments;

            // 每次触发函数，更新时间戳
            // later 方法中取 last 值时用到该变量
            // 判断距离上次触发事件是否已经过了 wait seconds 了
            // 即我们需要距离最后一次事件触发 wait seconds 后触发这个回调方法
            timestamp = Date.now();

            // 立即触发需要满足两个条件
            // immediate 参数为 true，并且 timeout 还没设置
            // immediate 参数为 true 是显而易见的
            // 如果去掉 !timeout 的条件，就会一直触发，而不是触发一次
            // 因为第一次触发后已经设置了 timeout，所以根据 timeout 是否为空可以判断是否是首次触发
            var callNow = immediate && !timeout;

            // 设置 wait seconds 后触发 later 方法
            // 无论是否 callNow（如果是 callNow，也进入 later 方法，去 later 方法中判断是否执行相应回调函数）
            // 在某一段的连续触发中，只会在第一次触发时进入这个 if 分支中
            if (!timeout)
            // 设置了 timeout，所以以后不会进入这个 if 分支了
                timeout = setTimeout(later, wait);

            // 如果是立即触发
            if (callNow) {
                // func 可能是有返回值的
                result = func.apply(context, args);
                // 解除引用
                context = args = null;
            }

            return result;
        };
    },
    /**
     * 创建延迟指定时间后执行的函数fn
     * @method defer
     * @param { Function } fn 需要延迟执行的函数对象
     * @param { int } delay 延迟的时间， 单位是毫秒
     * @warning 该方法的时间控制是不精确的，仅仅只能保证函数的执行是在给定的时间之后，
     *           而不能保证刚好到达延迟时间时执行。
     * @return { Function } 目标函数fn的代理函数， 只有执行该函数才能起到延时效果
     * @example
     * ```javascript
     * var start = 0;
     *
     * function test(){
     *     console.log( new Date() - start );
     * }
     *
     * var testDefer = KS.utils.defer( test, 1000 );
     * //
     * start = new Date();
     * //output: (大约在1000毫秒之后输出) 1000
     * testDefer();
     * ```
     */

    /**
     * 创建延迟指定时间后执行的函数fn, 如果在延迟时间内再次执行该方法， 将会根据指定的exclusion的值，
     * 决定是否取消前一次函数的执行， 如果exclusion的值为true， 则取消执行，反之，将继续执行前一个方法。
     * @method defer
     * @param { Function } fn 需要延迟执行的函数对象
     * @param { int } delay 延迟的时间， 单位是毫秒
     * @param { Boolean } exclusion 如果在延迟时间内再次执行该函数，该值将决定是否取消执行前一次函数的执行，
     *                     值为true表示取消执行， 反之则将在执行前一次函数之后才执行本次函数调用。
     * @warning 该方法的时间控制是不精确的，仅仅只能保证函数的执行是在给定的时间之后，
     *           而不能保证刚好到达延迟时间时执行。
     * @return { Function } 目标函数fn的代理函数， 只有执行该函数才能起到延时效果
     * @example
     * ```javascript
     *
     * function test(){
     *     console.log(1);
     * }
     *
     * var testDefer = KS.utils.defer( test, 1000, true );
     *
     * //output: (两次调用仅有一次输出) 1
     * testDefer();
     * testDefer();
     * ```
     */
    defer: function(fn, delay, exclusion) {
        var timerID;
        return function() {
            if (exclusion) {
                clearTimeout(timerID);
            }
            timerID = setTimeout(fn, delay);
        };
    },
    /**
     * 删除字符串str的首尾空格
     * @method trim
     * @param { String } str 需要删除首尾空格的字符串
     * @return { String } 删除了首尾的空格后的字符串
     * @example
     * ```javascript
     *
     * var str = " KS ";
     *
     * //output: 9
     * console.log( str.length );
     *
     * //output: 7
     * console.log( KS.utils.trim( " KS " ).length );
     *
     * //output: 9
     * console.log( str.length );
     *
     *  ```
     */
    trim: function(str) {
        return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
    },

    /**
     * 克隆对象
     * @method clone
     * @param { Object } source 源对象
     * @return { Object } source的一个副本
     */

    /**
     * 深度克隆对象，将source的属性克隆到target对象， 会覆盖target重名的属性。
     * @method clone
     * @param { Object } source 源对象
     * @param { Object } target 目标对象
     * @return { Object } 附加了source对象所有属性的target对象
     */
    clone: function(source, target) {
        var tmp;
        target = target || {};
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                tmp = source[i];
                if (typeof tmp == 'object') {
                    target[i] = utils.isArray(tmp) ? [] : {};
                    utils.clone(source[i], target[i])
                } else {
                    target[i] = tmp;
                }
            }
        }
        return target;
    },
    isCrossDomainUrl: function(url) {
        var a = document.createElement('a');
        a.href = url;
        if (browser.ie) {
            a.href = a.href;
        }
        return !(a.protocol == location.protocol && a.hostname == location.hostname &&
            (a.port == location.port || (a.port == '80' && location.port == '') || (a.port == '' && location.port == '80')));
    },
    // 将一个对象转换为元素为 [key, value] 形式的数组
    // _.pairs({one: 1, two: 2, three: 3});
    // => [["one", 1], ["two", 2], ["three", 3]]
    pairs: function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    },
    // attrs 参数为一个对象
    // 判断 object 对象中是否有 attrs 中的所有 key-value 键值对
    // 返回布尔值
    isMatch: function(object, attrs) {
        // 提取 attrs 对象的所有 keys
        var keys = _.keys(attrs),
            length = keys.length;

        // 如果 object 为空
        // 根据 attrs 的键值对数量返回布尔值
        if (object == null) return !length;

        // 遍历 attrs 对象键值对
        for (var i = 0; i < length; i++) {
            var key = keys[i];

            // 如果 obj 对象没有 attrs 对象的某个 key
            // 或者对于某个 key，它们的 value 值不同
            // 则证明 object 并不拥有 attrs 的所有键值对
            // 则返回 false
            if (attrs[key] !== object[key] || !(key in object)) return false;
        }

        return true;
    },
    // 如果是数组（类数组），返回长度（length 属性）
    // 如果是对象，返回键值对数量
    size: function(obj) {
        if (obj == null) return 0;
        return utils.isArrayLike(obj) ? obj.length : utils.keys(obj).length;
    },
    // 伪数组 -> 数组
    // 对象 -> 提取 value 值组成数组
    // 返回数组
    toArray: function(obj) {
        if (!obj) return [];

        // 如果是数组，则返回副本数组
        // 也可用 obj.concat() 
        if (utils.isArray(obj)) return Array.prototype.slice.call(obj);

        // 如果是类数组，则重新构造新的数组
        if (utils.isArrayLike(obj)) return Array.prototype.slice.call(obj);

        // 如果是对象，则返回 values 集合
        return utils.values(obj);
    },
    //闭包保存length，防止反复访问数组的length属性
    getLength: function(key) {
        return function(obj) {
            return obj == null ? void 0 : obj[key];
        };
    }(length),
    // 将嵌套的数组展开
    // 如果参数 (shallow === true)，则仅展开一层
    // _.flatten([1, [2], [3, [[4]]]]);
    // => [1, 2, 3, 4];
    // ====== //
    // _.flatten([1, [2], [3, [[4]]]], true);
    // => [1, 2, 3, [[4]]];
    flatten: function(array, shallow) {

        // 递归调用数组，将数组展开
        // 即 [1, 2, [3, 4]] => [1, 2, 3, 4]
        // flatten(array, shallow, false)
        // flatten(arguments, true, true, 1)
        // flatten(arguments, true, true)
        // flatten(arguments, false, false, 1)
        // ===== //
        // input => Array 或者 arguments
        // shallow => 是否只展开一层
        // strict === true，通常和 shallow === true 配合使用
        // 表示只展开一层，但是不保存非数组元素（即无法展开的基础类型）
        // flatten([[1, 2], 3, 4], true, true) => [1, 2]
        // flatten([[1, 2], 3, 4], false, true) = > []
        // startIndex => 从 input 的第几项开始展开
        // ===== //
        // 如果 strict 参数为 true，那么 shallow 也为 true
        // 也就是展开一层，同时把非数组过滤
        // [[1, 2], [3, 4], 5, 6] => [1, 2, 3, 4]
        var flatten = function(input, shallow, strict, startIndex) {
            // output 数组保存结果
            // 即 flatten 方法返回数据
            // idx 为 output 的累计数组下标
            var output = [],
                idx = 0;

            // 根据 startIndex 变量确定需要展开的起始位置
            for (var i = startIndex || 0, length = utils.getLength(input); i < length; i++) {
                var value = input[i];
                // 数组 或者 arguments
                // 注意 isArrayLike 还包括 {length: 10} 这样的，过滤掉
                if (utils.isArrayLike(value) && (utils.isArray(value) || utils.isArguments(value))) {
                    // flatten current level of array or arguments object
                    // (!shallow === true) => (shallow === false)
                    // 则表示需深度展开
                    // 继续递归展开
                    if (!shallow)
                    // flatten 方法返回数组
                    // 将上面定义的 value 重新赋值
                        value = flatten(value, shallow, strict);

                    // 递归展开到最后一层（没有嵌套的数组了）
                    // 或者 (shallow === true) => 只展开一层
                    // value 值肯定是一个数组
                    var j = 0,
                        len = value.length;

                    // 这一步貌似没有必要
                    // 毕竟 JavaScript 的数组会自动扩充
                    // 但是这样写，感觉比较好，对于元素的 push 过程有个比较清晰的认识
                    output.length += len;

                    // 将 value 数组的元素添加到 output 数组中
                    while (j < len) {
                        output[idx++] = value[j++];
                    }
                } else if (!strict) {
                    // 如果是深度展开，即 shallow 参数为 false
                    // 那么当最后 value 不是数组，是基本类型时
                    // 肯定会走到这个 else-if 判断中
                    // 而如果此时 strict 为 true，则不能跳到这个分支内部
                    // 所以 shallow === false 如果和 strict === true 搭配
                    // 调用 flatten 方法得到的结果永远是空数组 []
                    output[idx++] = value;
                }
            }

            return output;
        };

        // array => 需要展开的数组
        // shallow => 是否只展开一层
        // false 为 flatten 方法 strict 变量
        return flatten(array, shallow, false);
    },
    // 将数组转化为对象
    object: function(list, values) {
        var result = {};
        for (var i = 0, length = utils.getLength(list); i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    },
    // 指定一系列方法（methodNames）中的 this 指向（object）
    // bindAll(object, *methodNames)
    bindAll: function(obj) {
        var i, length = arguments.length,
            key;

        // 如果只传入了一个参数（obj），没有传入 methodNames，则报错
        if (length <= 1)
            throw new Error('bindAll必须传入方法名');

        // 遍历 methodNames
        for (i = 1; i < length; i++) {
            key = arguments[i];
            // 逐个绑定
            //obj[key] = Function.prototype.bind.call(obj[key],obj);
            obj[key] = obj[key].bind(obj);
        }
        return obj;
    },
    //「记忆化」，存储中间运算结果，提高效率
    // 参数 hasher 是个 function，用来计算 key
    // 如果传入了 hasher，则用 hasher 来计算 key
    // 否则用 key 参数直接当 key（即 memoize 方法传入的第一个参数）
    // _.memoize(function, [hashFunction])
    // 适用于需要大量重复求值的场景
    // 比如递归求解菲波那切数
    memoize: function(func, hasher) {
        var memoize = function(key) {
            // 储存变量，方便使用
            var cache = memoize.cache;

            // 求 key
            // 如果传入了 hasher，则用 hasher 函数来计算 key
            // 否则用 参数 key（即 memoize 方法传入的第一个参数）当 key
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);

            // 如果这个 key 还没被 hash 过（还没求过值）
            if (!utils.has(cache, address))
                cache[address] = func.apply(this, arguments);

            // 返回
            return cache[address];
        };

        // cache 对象被当做 key-value 键值对缓存中间运算结果
        memoize.cache = {};

        // 返回一个函数（经典闭包）
        return memoize;
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
utils.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date', 'Arguments', 'Error'], function(v) {
    KS.utils['is' + v] = function(obj) {
        return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
    }
});