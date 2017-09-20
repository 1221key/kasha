var KS = {};
/**
 * 事件包
 * 支持离线事件，即先发布后订阅，支持命名空间
 * @file
 * @module KS.event
 * @since 1.0.0
 */

/**
 *  先发布后订阅(不使用命名空间，则使用默认命名空间namespaceCache["default"])
 *		event.trigger( 'click', 1 );
 *		event.listen( 'click', function( a ){
 *			console.log( a ); // 输出： 1
 *		})
 *	使用命名空间 
 *	event.nameSpace( 'namespace1' ).listen( 'click', function( a ){
 *		console.log( a ); // 输出： 1
 *	});
 *	event.nameSpace( 'namespace1' ).trigger( 'click', 1 );
 *	event.nameSpace( 'namespace2' ).listen( 'click', function( a ){
 *		console.log( a ); // 输出： 2
 *	});
 *	event.nameSpace( 'namespace2' ).trigger( 'click', 2 );
 * 
 */
var event = KS.event = (function() {
    var global = this,
        Event,
        _default = 'default';
    Event = function() {
        var _listen,
            _trigger,
            _remove,
            _slice = Array.prototype.slice,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {}, //命名空间缓存列表
            _create,
            find,
            each = function(ary, fn) {
                var ret;
                for (var i = 0, l = ary.length; i < l; i++) {
                    var n = ary[i];
                    ret = fn.call(n, i, n);
                }
                return ret;
            };
        _listen = function(key, fn, cache) { //订阅
            if (!cache[key]) { //
                cache[key] = [];
            }
            cache[key].push(fn);
        };
        _remove = function(key, cache, fn) {
            if (cache[key]) { //移除特定事件名下的特定回调函数
                if (fn) {
                    for (var i = cache[key].length; i >= 0; i--) {
                        if (cache[key] === fn) {
                            cache[key].splice(i, 1);
                        }
                    }
                } else {
                    cache[key].length = 0; //清空事件回调函数队列，也即移除特定事件名下的所有回调函数
                }
            }
        };
        _trigger = function() { //发布事件，这里触发的是已经订阅的
            var cache = _shift.call(arguments), //事件名
                key = _shift.call(arguments), //事件回调函数
                args = arguments,
                _self = this,
                ret,
                stack = cache[key]; //存放同一事件名下的回调函数的数组
            if (!stack || !stack.length) {
                return;
            }
            return each(stack, function() { //遍历特定事件名下的所有回调函数并执行
                return this.apply(_self, args);
            });
        };
        _create = function(namespace) { //创建命名空间
            var namespace = namespace || _default;
            var cache = {},
                offlineStack = [], // 离线事件
                ret = {
                    listen: function(key, fn, last) {
                        _listen(key, fn, cache); //订阅事件
                        if (offlineStack === null) {
                            return;
                        }
                        if (last === 'last') { //表示如果是最新事件则不用处理，默认缓存事件
                        } else { //执行离线事件
                            each(offlineStack, function() {
                                this();
                            });
                        }
                        offlineStack = null;
                    },
                    one: function(key, fn, last) {
                        _remove(key, cache);
                        this.listen(key, fn, last);
                    },
                    remove: function(key, fn) {
                        _remove(key, cache, fn);
                    },
                    trigger: function() { //发布事件
                        var fn,
                            args,
                            _self = this; //这个this在调用时将指向namespaceCache[namespace]，详见_create方法的return语句
                        _unshift.call(arguments, cache);
                        args = arguments;
                        fn = function() { //绑定this对象，并传参
                            return _trigger.apply(_self, args);
                        };
                        if (offlineStack) { //若果offlineStack不为null，则表明该事件没有订阅，因此需要push到缓存列表中
                            return offlineStack.push(fn);
                        }
                        return fn();
                    }
                };
            return namespace ?
                (namespaceCache[namespace] ? namespaceCache[namespace] : //返回原有的命名空间对象
                    namespaceCache[namespace] = ret) : //在命名空间缓存列表中创建对应的命名空间
                ret;
        };
        return {
            //如果不调用nameSpace，或者给nameSpace方法传入""，则命名空间为默认namespaceCache["default"]
            nameSpace: _create,
            /**
             * @param {string} key 
             * @param {function} fn
             * @param {string} last 是否是最新，当为last时，不触发缓存的事件回调
             */
            one: function(key, fn, last) {
                var event = this.nameSpace();
                event.one(key, fn, last);
            },
            remove: function(key, fn) {
                var event = this.nameSpace();
                event.remove(key, fn);
            },
            listen: function(key, fn, last) {
                var event = this.nameSpace();
                event.listen(key, fn, last);
            },
            trigger: function() {
                var event = this.nameSpace();
                event.trigger.apply(this, arguments);
            }
        };
    }();
    return Event;
})();