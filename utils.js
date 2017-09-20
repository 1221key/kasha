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
     *   // output: borderTop
     * console.log( KS.utils.cssStyleToDomStyle( str ) );
     *
     * ```
     **/
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
     * @param { DomDocument } doc 需要加载资源文件的文档对象
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
            for (var i = 0, ci; ci = tmpList[i++];) {
                if (ci.doc === doc && ci.url == (obj.src || obj.href)) {
                    return ci;
                }
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
            element.onload = function() { //动态加载的标签加载完毕后触发此事件
                item = getItem(doc, obj);
                if (item.funs.length > 0) {
                    item.ready = 1;
                    for (var fi; fi = item.funs.pop();) {
                        fi();
                    }
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
     * @param { String } value rgb格式的颜色值
     * @return { String }
     * @example
     * rgb(255,255,255)  => "#ffffff"
     */
    fixColor: function(value) {
        if (/rgba?/.test(value)) {
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
            //如果doReady执行过一次，后面再次调用该方法时直接执行
            doc.isReady && doReady(doc);
            doc.addEventListener("DOMContentLoaded", function() {
                //doc.removeEventListener("DOMContentLoaded", arguments.callee, false);
                doReady(doc);
            }, false);
            win.addEventListener('load', function() {
                doReady(doc)
            }, false);
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
    isPlainObject: function(obj) {
        if (!KS.utils.isObject(obj)) {
            return false;
        }

        if (obj.constructor &&
            !({}).hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }
        //如果函数执行到这里还没有return ,可以确定参数obj 是一个通过{}或者new Object构造的纯粹的对象
        return true;
    },
    isEmptyObject: function(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
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
        //前面两个子表达式是为了提高性能而已
        return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
    },
    isWindow: function(obj) { //用Object.prototype.toString.call(obj)也是可以的，在ie9以及以上都是ok的，但这样性能更好
        return obj != null && obj === obj.window;
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
    // utils.keys({one: 1, two: 2, three: 3});
    // => ["one", "two", "three"]
    // ===== //
    // 返回一个对象的 keys 组成的数组
    // 仅返回 own enumerable properties 组成的数组
    keys: function(obj) {
        // 容错
        // 如果传入的参数不是对象，则返回空数组
        if (!KS.utils.isObject(obj)) return [];

        // 如果浏览器支持 ES5 Object.keys() 方法
        // 则优先使用该方法
        if (Object.keys) return Object.keys(obj);

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
    // utils.values({one: 1, two: 2, three: 3});
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
    // var throttled = utils.throttle(updatePosition, 100);
    // $(window).scroll(throttled);
    // 调用方式（注意看 A 和 B console.log 打印的位置）：
    // utils.throttle(function, wait, [options])
    // sample 1: utils.throttle(function(){}, 1000)
    // print: A, B, B, B ...
    // sample 2: utils.throttle(function(){}, 1000, {leading: false})
    // print: B, B, B, B ...
    // sample 3: utils.throttle(function(){}, 1000, {trailing: false})
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
        // utils.throttle 方法返回的函数
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
    // sample 1: utils.debounce(function(){}, 1000)
    // 连续事件结束后的 1000ms 后触发
    // sample 1: utils.debounce(function(){}, 1000, true)
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
    // utils.pairs({one: 1, two: 2, three: 3});
    // => [["one", 1], ["two", 2], ["three", 3]]
    pairs: function(obj) {
        var keys = utils.keys(obj);
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
        var keys = utils.keys(attrs),
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
    // utils.flatten([1, [2], [3, [[4]]]]);
    // => [1, 2, 3, 4];
    // ====== //
    // utils.flatten([1, [2], [3, [[4]]]], true);
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
    // utils.memoize(function, [hashFunction])
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
    //获取数组中最大或者最小值,该方法适合一维或者多维数组求最大最小值的情况
    maxAndMin: function(arr) {
        return {
            max: Math.max.apply(null, arr.join(',').split(',')),
            min: Math.min.apply(null, arr.join(',').split(','))
        }
    },
    //生成指定长度的随机字母数字字符串
    getRandomStr: function(len) {
        var str = "";
        for (; str.length < len; str += Math.random().toString(36).substring(2));
        return str.substring(0, len);
    },
    // 延迟触发某方法
    // utils.delay(function, wait, *arguments)
    //  如果传入了 arguments 参数，则会被当作 func 的参数在触发时调用
    // 其实是封装了「延迟触发某方法」，使其复用
    delay: function(func, wait) {
        // 获取 *arguments
        // 是 func 函数所需要的参数
        var args = slice.call(arguments, 2);
        return setTimeout(function() {
            // 将参数赋予 func 函数
            return func.apply(null, args);
        }, wait);
    },
    // 第 times 触发执行 func（事实上之后的每次触发还是会执行 func）
    // 有什么用呢？
    // 如果有 N 个异步事件，所有异步执行完后执行该回调，即 func 方法（联想 eventproxy）
    // utils.after 会返回一个函数
    // 当这个函数第 times 被执行的时候
    // 触发 func 方法
    /**render在所有异步都保存成功后才执行
     * var renderNotes = utils.after(notes.length, render);
        utils.each(notes, function(note) {
            note.asyncSave({success: renderNotes});
        });
     */
    after: function(times, func) {
        return function() {
            // 函数被触发了 times 了，则执行 func 函数
            // 事实上 times 次后如果函数继续被执行，也会触发 func
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    },
    // 函数至多被调用 times - 1 次（(but not including) the Nth call）
    // func 函数会触发 time - 1 次（Creates a version of the function that can be called no more than count times）
    // func 函数有个返回值，前 time - 1 次触发的返回值都是将参数代入重新计算的
    // 第 times 开始的返回值为第 times - 1 次时的返回值（不重新计算）
    // The result of the last function call is memoized and returned when count has been reached.
    /* 创建一个函数,调用不超过count 次。 当count已经达到时，最后一个函数调用的结果 是被记住并返回 。
          var monthlyMeeting = utils.before(3, askForRaise);
         monthlyMeeting();
         monthlyMeeting();
         monthlyMeeting();
         //所以monthlyMeeting第二次调用的和以后调用的结果一样
    */
    before: function(times, func) {
        var memo;
        return function() {
            if (--times > 0) {
                // 缓存函数执行结果
                memo = func.apply(this, arguments);
            }

            // func 引用置为空，其实不置为空也用不到 func 了
            if (times <= 1)
                func = null;

            // 前 times - 1 次触发，memo 都是分别计算返回
            // 第 times 次开始，memo 值同 times - 1 次时的 memo
            return memo;
        };
    },
    // 传入一个对象
    // 遍历该对象的键值对（包括 own properties 以及 原型链上的）
    // 如果某个 value 的类型是方法（function），则将该 key 存入数组
    // 将该数组排序后返回,就是返回对象的方法名
    methods: function(obj) {
        // 返回的数组
        var names = [];
        for (var key in obj) {
            // 如果某个 key 对应的 value 值类型是函数
            // 则将这个 key 值存入数组
            if (utils.isFunction(obj[key])) names.push(key);
        }
        // 返回排序后的数组
        return names.sort();
    },
    //返回函数集 functions 组合后的复合函数, 也就是一个函数执行完之后把返回的结果再作为参数赋给下一个函数来执行. 以此类推. 在数学里, 把函数 f(), g(), 和 h() 组合起来可以得到复合函数 f(g(h()))。
    /**
     * var greet    = function(name){ return "hi: " + name; };
        var exclaim  = function(statement){ return statement.toUpperCase() + "!"; };
        var welcome = utils.compose(greet, exclaim);
        welcome('moe');
        => 'hi: MOE!'
     */
    compose: function() {
        var args = arguments;
        var start = args.length - 1;
        return function() {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) result = args[i].call(this, result);
            return result;
        };
    },
    // 判断两个对象是否一样
    // new Boolean(true)，true 被认为 equal
    // [1, 2, 3], [1, 2, 3] 被认为 equal
    // 0 和 -0 被认为 unequal
    // NaN 和 NaN 被认为 equal
    /*   var a = Object.create(null);
         a.x = 1;
        var b = {x:1}; a,b被认为是equal
     */
    isEqual: function(a, b) {


        // isEqual方法的内部递归比较
        // 该内部方法会被递归调用
        var eq = function(a, b, aStack, bStack) {
            //分析：为啥有两个stack，原因就判断那种自嵌套结构。由于是递归，得想办法把上一层对象传进来。不然怎么会知道是否自嵌套结构呢。
            // a === b 时
            // 需要注意 `0 === -0` 这个 special case
            // 0 和 -0 被认为不相同（unequal）
            // 至于原因可以参考上面的链接
            if (a === b) return a !== 0 || 1 / a === 1 / b;

            // null == undefined ==> true
            // 如果 a 和 b 有一个为 null（或者 undefined）
            // 判断 a === b
            if (a == null || b == null) return a === b;

            // 比较 `[[Class]]` names.
            var className = Object.prototype.toString.call(a);

            // 如果 a 和 b 类型不相同，则返回 false
            if (className !== Object.prototype.toString.call(b)) return false;

            switch (className) {
                // Strings, numbers, regular expressions, dates, booleans可以直接根据其 value 值来比较是否相等
                case '[object RegExp]':
                    //  /ab/+""==="/ab/"
                case '[object String]':
                    //"5" !=== new String(5) 但值相等，都是字符串“5”
                    // 转为 String 类型进行比较
                    return '' + a === '' + b;

                    // RegExp 和 String 可以看做一类
                    // 如果 obj 为 RegExp 或者 String 类型
                    // 那么 '' + obj 会将 obj 强制转为 String
                    // 根据 '' + a === '' + b 即可判断 a 和 b 是否相等

                case '[object Number]':

                    // Object(NaN) is equivalent to NaN
                    // 如果 +a !== +a
                    // 那么 a 就是 NaN
                    // 判断 b 是否也是 NaN 即可
                    if (+a !== +a) return +b !== +b;

                    // An `egal` comparison is performed for other numeric values.
                    // 排除了 NaN 干扰
                    // 还要考虑 0 的干扰
                    // 用 +a 将 Number() 形式转为基本类型
                    // 即 +Number(1) ==> 1
                    // 0 需要特判
                    // 如果 a 为 0，判断 1 / +a === 1 / b
                    // 否则判断 +a === +b
                    return +a === 0 ? 1 / +a === 1 / b : +a === +b;

                    // 如果 a 为 Number 类型
                    // 要注意 NaN 这个 special number
                    // NaN 和 NaN 被认为 equal
                    // ================

                case '[object Date]':
                case '[object Boolean]':
                    return +a === +b;

                    // Date 和 Boolean 可以看做一类
                    // 如果 obj 为 Date 或者 Boolean
                    // 那么 +obj 会将 obj 转为 Number 类型
                    // 然后比较即可
                    // +new Date() 是当前时间距离 1970 年 1 月 1 日 0 点的毫秒数
                    // +true => 1
                    // +new Boolean(false) => 0
            }


            // 判断 a 是否是数组
            var areArrays = className === '[object Array]';

            // 如果 a 不是数组类型
            if (!areArrays) {
                // 如果 a 不是 object 或者 b 不是 object
                // 则返回 false
                if (typeof a != 'object' || typeof b != 'object') return false;

                // 通过上个步骤的 if 过滤
                // !!保证到此的 a 和 b 均为对象!!
                // Object instance Object ==> true
                /**
                 * 这个if主要针对对象的判断，进入此if的前提是a和b，都已经是对象了。逻辑是这样的，if里面返回的是false，即判断哪种情况下认为二者不等。
                 * 如果二者的constructor不等，一般认为对象不可能值相等。但有种情况例外，来自不同的iframe的Object实例，因为其构造器Object是属于不同window的函数Object，自然不等，但是有可能值相等。
                 * 所以要排除掉这种情况，utils.isFunction(aCtor) && aCtor instanceof aCtor 表示“一个函数是自己的实例”，如果该函数是Object，自然为true，因此前面取非表示排除了。
                 * 而后面'constructor' in a && 'constructor' in b，表示要求ab对象都有构造器属性。关于为啥有这一条。都有构造器，那没啥好说的。我们可以假设一下a没有，b有，
                 * 那么aCtor是undefined，则if是不进的，也就是说这种情况下也有可能认为ab相等，另外，来自不同iframe的对象实例，要使用firefox浏览器测试。chrome会报错。
                 */
                var aCtor = a.constructor,
                    bCtor = b.constructor;
                if (aCtor !== bCtor && !(utils.isFunction(aCtor) && aCtor instanceof aCtor &&
                        utils.isFunction(bCtor) && bCtor instanceof bCtor) &&
                    ('constructor' in a && 'constructor' in b)) {
                    return false;
                }
            }



            // 第一次调用 eq() 函数，没有传入 aStack 和 bStack 参数
            // 之后递归调用都会传入这两个参数
            aStack = aStack || [];
            bStack = bStack || [];

            var length = aStack.length;

            while (length--) {
                /**自嵌套结构判断,如下面的a
                 *var a = {name : '11'};
                 *a.o = a;
                 *var c = a.o;
                 *alert(c.name);
                 */
                //如果a有嵌套现象，就看看b是否也有，注意a有,就返回了
                if (aStack[length] === a) return bStack[length] === b;
            }

            //如果上面while中没有进if，这里把a和b放到栈里
            aStack.push(a);
            bStack.push(b);

            // 递归比较对象和数组
            // 将嵌套的对象和数组展开
            // 如果 a 是数组
            // 因为嵌套，所以需要展开深度比较
            if (areArrays) {
                // 根据 length 判断是否应该继续递归对比
                length = a.length;
                // 如果 a 和 b length 属性大小不同，返回false
                if (length !== b.length) return false;

                // //递归比较每个属性值是否相等
                while (length--) {
                    // 递归
                    if (!eq(a[length], b[length], aStack, bStack)) return false;
                }
            } else {
                // 如果 a 不是数组，这里的话即是对象
                // 进入这个判断分支

                // Deep compare objects.
                // 两个对象的深度比较
                var keys = utils.keys(a),
                    key;
                length = keys.length;

                // Ensure that both objects contain the same number of properties before comparing deep equality.
                // a 和 b 对象的键数量不同
                // 那还比较毛？
                if (utils.keys(b).length !== length) return false;

                while (length--) {
                    // Deep compare each member
                    // 递归比较
                    key = keys[length];
                    if (!(utils.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
                }
            }

            // 与 aStack.push(a) 对应
            // 此时 aStack 栈顶元素正是 a
            // 而代码走到此步
            // a 和 b isEqual 确认
            // 所以 a，b 两个元素可以出栈
            //移除栈里最新的元素。说明这层是相等的
            aStack.pop();
            bStack.pop();

            // 深度搜索递归比较完毕
            // 放心地 return true
            return true;
        };

        return eq(a, b);
    },
    ajax: function(url, opts) {

        var xhr = new XMLHttpRequest();
        /**
         * 将json参数转化成适合ajax提交的参数列表
         * @param json
         */
        function json2str(json) {
            var strArr = [];
            for (var i in json) {
                //忽略默认的几个参数
                if (i == "method" || i == "timeout" || i == "async" || i == "dataType" || i == "callback") continue;
                //忽略控制
                if (json[i] == undefined || json[i] == null) continue;
                //传递过来的对象和函数不在提交之列
                if (!((typeof json[i]).toLowerCase() == "function" || (typeof json[i]).toLowerCase() == "object")) {
                    strArr.push(encodeURIComponent(i) + "=" + encodeURIComponent(json[i]));
                } else if (utils.isArray(json[i])) {
                    //支持传数组内容
                    for (var j = 0; j < json[i].length; j++) {
                        strArr.push(encodeURIComponent(i) + "[]=" + encodeURIComponent(json[i][j]));
                    }
                }
            }
            return strArr.join("&");
        }

        function doAjax(url, ajaxOptions) {
            //var xhr = creatAjaxRequest(),
            //是否超时
            timeIsOut = false,
                //默认参数
                defaultAjaxOptions = {
                    method: "POST",
                    timeout: 5000,
                    async: true,
                    data: {}, //需要传递对象的话只能覆盖
                    onsuccess: function() {},
                    onerror: function() {}
                };

            if (typeof url === "object") {
                ajaxOptions = url;
                url = ajaxOptions.url;
            }
            if (!xhr || !url) return;
            var ajaxOpts = ajaxOptions ? utils.extend(defaultAjaxOptions, ajaxOptions) : defaultAjaxOptions;

            var submitStr = json2str(ajaxOpts); // { name:"Jim",city:"Beijing" } --> "name=Jim&city=Beijing"
            //如果用户直接通过data参数传递json对象过来，则也要将此json对象转化为字符串
            if (!utils.isEmptyObject(ajaxOpts.data)) {
                submitStr += (submitStr ? "&" : "") + json2str(ajaxOpts.data);
            }
            //超时检测
            var timerID = setTimeout(function() {
                if (xhr.readyState != 4) {
                    timeIsOut = true;
                    xhr.abort();
                    clearTimeout(timerID);
                }
            }, ajaxOpts.timeout);

            var method = ajaxOpts.method.toUpperCase();
            var str = url + (url.indexOf("?") == -1 ? "?" : "&") + (method == "POST" ? "" : submitStr + "&noCache=" + +new Date);
            xhr.open(method, str, ajaxOpts.async);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (!timeIsOut && xhr.status == 200) {
                        ajaxOpts.onsuccess(xhr);
                    } else {
                        ajaxOpts.onerror(xhr);
                    }
                }
            };
            if (method == "POST") {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(submitStr);
            } else {
                xhr.send(null);
            }
        }
        return doAjax(url, opts);
        /**
         * 根据给定的参数项，向指定的url发起一个ajax请求。 ajax请求完成后，会根据请求结果调用相应回调： 如果请求
         * 成功， 则调用onsuccess回调， 失败则调用 onerror 回调
         * @method request
         * @param { URLString } url ajax请求的url地址
         * @param { Object } ajaxOptions ajax请求选项的键值对，支持的选项如下：
         * @example
         * ```javascript
         * //向sayhello.php发起一个异步的Ajax GET请求, 请求超时时间为10s， 请求完成后执行相应的回调。
         * utils.ajax( 'sayhello.php', {
         *
         *     //请求方法。可选值： 'GET', 'POST'，默认值是'POST'
         *     method: 'GET',
         *
         *     //超时时间。 默认为5000， 单位是ms
         *     timeout: 10000,
         *
         *     //是否是异步请求。 true为异步请求， false为同步请求
         *     async: true,
         *
         *     //请求携带的数据。如果请求为GET请求， data会经过stringify后附加到请求url之后。
         *     data: {
         *         name: 'ueditor'
         *     },
         *
         *     //请求成功后的回调， 该回调接受当前的XMLHttpRequest对象作为参数。
         *     onsuccess: function ( xhr ) {
         *         console.log( xhr.responseText );
         *     },
         *
         *     //请求失败或者超时后的回调。
         *     onerror: function ( xhr ) {
         *          alert( 'Ajax请求失败' );
         *     }
         *
         * } );
         * ```
         */

        /**
         * 根据给定的参数项发起一个ajax请求， 参数项里必须包含一个url地址。 ajax请求完成后，会根据请求结果调用相应回调： 如果请求
         * 成功， 则调用onsuccess回调， 失败则调用 onerror 回调。
         * @method request
         * @warning 如果在参数项里未提供一个key为“url”的地址值，则该请求将直接退出。
         * @param { Object } ajaxOptions ajax请求选项的键值对，支持的选项如下：
         * @example
         * ```javascript
         *
         * //向sayhello.php发起一个异步的Ajax POST请求, 请求超时时间为5s， 请求完成后不执行任何回调。
         * utils.ajax( 'sayhello.php', {
         *
         *     //请求的地址， 该项是必须的。
         *     url: 'sayhello.php'
         *
         * } );
         * ```
         */
    }(url, opts),
    randomAToZ: function(num) { //随机生成5个字母
        var result = [];
        var num = num || 6;

        function getRanNum() {
            result = [];
            for (var i = 0; i < num; i++) {
                var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
                //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里,a的ASCII码是97
                result.push(String.fromCharCode(97 + ranNum));
            }
            return result.join("")
        }
        return getRanNum()
    }
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