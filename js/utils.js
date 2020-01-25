;
(function (global) {
    let iOS;
    // TODO: set warnings to all methods;
    const WARNINGS = {
        noSelector() {
            throw 'Utils: 😱😱😱 -> Are you drunk? Where is selector?'
        },
        nodeType(fn) {
            throw `Utils: ${fn} 😱😱😱 -> Can\'t find index. The selector must be nodeType`
        },
        stringOrNode(target) {
            throw `Utils: 😱😱😱 -> Target is [ ${typeof target} ]. Must be string or nodeType`
        },
        stringOnly(target) {
            throw `Utils: 😱😱😱 -> Target is [ ${typeof target} ]. Must be string`
        },
        notEnoughArguments(target) {
            throw `Utils: 😱😱😱 -> One of argument is [ ${typeof target} ]. Wrong arguments type`
        },
        mustBeString(target) {
            throw `Utils: 😱😱😱 -> One of argument is [ ${typeof target} ]. Must be string`
        },
    }

    /**
     * Delegation section
     * bodyAllMethods Array: Stores object with selector and callback { selector: '.c1', fn: f(), el: null }
     * loopFunc Function: When click on body, loop through bodyAllMethods and find clicked elm. If exist, then call fn
     */
    let bodyAllMethods = []
    document.body.addEventListener('click', loopFunc)
    function loopFunc(e) {
        let tempArray = bodyAllMethods.filter(item => {
            if (typeof item.selector !== 'string') {
                throw WARNINGS.stringOnly(item.selector)
            }
            let el = e.target.closest(item.selector)
            item.el = el
            return el
        })

        tempArray.forEach(item => {
            item.fn.call(item.el, e)
        })
    }


    class S {
        constructor() {}

        // Selector
        find(selector, childSelector) {
            let elms = [];

            if (!selector) {
                return
            }

            if (typeof selector === 'string') {
                elms = [...document.querySelectorAll(selector)]
            } else if (Array.isArray(selector)) {
                elms = selector
            } else if (selector.nodeType || selector === window) {
                elms.push(selector)
            } else {
                WARNINGS.noSelector()
            }

            if (childSelector) {
                // If we have second arguemtn and it is not a function
                let children = [];
                elms.forEach(elm => {
                    children = [...children, ...elm.querySelectorAll(childSelector)]
                })

                return children
            }

            return elms
        }

        first(selector, childSelector, fn) {
            let elm;

            if (!selector) {
                return
            }

            if (childSelector && typeof childSelector === 'string') {
                elm = this.find(selector, childSelector)[0]
            } else {
                elm = this.find(selector)[0]
            }


            if (this.isFunction(fn)) {
                fn.apply(elm, [elm])
                return this;
            }

            return elm;
        }

        each(selector, fn) {
            if (Array.isArray(selector)) {
                selector.forEach((elm, i) => {
                    // TODO: Сделать так, что бы внутрь ф-ци передавался элемент как аргумент
                    fn.apply(elm, [elm, i])
                })
            } else {
                let elms = this.find(selector);

                elms.forEach((elm, i) => {
                    fn.apply(elm, [elm, i])
                })
            }

            return this
        }
        // End: Selector

        // Classes
        addClass(selector, cls) {
            this._changeClass(selector, cls, 'add')
            return this
        }

        removeClass(selector, cls) {
            this._changeClass(selector, cls, 'remove')
            return this
        }

        toggleClass(selector, cls) {
            this._changeClass(selector, cls, 'toggle')
            return this
        }

        _changeClass(selector, cls, method) {
            let self = this;

            if (typeof cls === 'string') {
                // If cls == string
                self.each(selector, function () {
                    if (method === 'add' && !self.hasClass(this, cls)) {
                        this.classList[method](cls)
                    } else if (method === 'remove' && self.hasClass(this, cls)) {
                        this.classList[method](cls)
                    } else if (method === 'toggle') {
                        this.classList[method](cls)
                    }
                })
            } else {
                // If cls == array
                self.each(selector, function () {
                    cls.forEach(clsName => {
                        /**
                         * self - constructor (class)
                         * this - element (selector)
                         */
                        if (method === 'add' && !self.hasClass(this, clsName)) {
                            this.classList[method](clsName)
                        } else if (method === 'remove' && self.hasClass(this, clsName)) {
                            this.classList[method](clsName)
                        } else if (method === 'toggle') {
                            this.classList[method](clsName)
                        }
                    })
                })
            }
        }

        hasClass(selector, cls) {
            // Get only first elemnt, not all array
            let elm = this.find(selector)[0]
            return elm.classList.contains(cls)
        }
        // End: Classes

        // Events
        on(selector, method, targetSelector, fn, options) {

            if (typeof targetSelector === 'string') {
                // Delegate
                this.each(selector, function () {
                    this.addEventListener(method, handleEvent.bind(this, fn, targetSelector), options)
                })
            } else {
                // Not delegate
                let fn = targetSelector;
                this.each(selector, function () {
                    this.addEventListener(method, fn, options);
                })
            }

            function handleEvent(fn, elm, e) {
                let target = e.target.closest(elm)
                if (target) {
                    fn.apply(target, [target])
                }
            }

            return this
        }

        trigger(selector, method, details) {
            let event = method instanceof CustomEvent ? method : new CustomEvent(method, details)

            this.each(selector, function () {
                this.dispatchEvent(event)
            })

            return this
        }
        // End: Events

        // HTML
        html(selector, data) {
            if (data === undefined) {
                // Get
                return this.first(selector).innerHTML
            }

            // Set
            this.each(selector, function () {
                this.innerHTML = data
            })

            return this
        }

        append(selector, data) {
            let method = 'insertAdjacentHTML'

            if (data.nodeType) {
                method = 'insertAdjacentElement'
            }

            this.each(selector, function () {
                this[method]('beforeend', data)
            })

            return this
        }

        prepend(selector, data) {
            let method = 'insertAdjacentHTML'

            if (data.nodeType) {
                method = 'insertAdjacentElement'
            }

            this.each(selector, function () {
                this[method]('afterbegin', data)
            })

            return this
        }

        remove(selector) {
            this.each(selector, function () {
                this.remove()
            })
        }

        nextAll(selector) {
            if (!selector.nodeType) {
                // throw '😱😱😱 -> Can\'t find index. The selector must be nodeType'
            }

            let nextElms = [];
            let thisElm = selector;

            while (thisElm.nextElementSibling) {
                if (typeof selector === 'string' && selector.length > 0) {
                    // Is is selector and selectors length > 0
                    if (S(thisElm.nextElementSibling).is(selector)) {
                        nextElms.push(thisElm.nextElementSibling)
                    }
                } else {
                    // All elements without any selector
                    nextElms.push(thisElm.nextElementSibling)
                }
                thisElm = thisElm.nextElementSibling
            }

            return nextElms
        }

        prevAll(selector) {
            if (!selector.nodeType) {
                throw '😱😱😱 -> Can\'t find index. The selector must be nodeType'
            }

            let nextElms = [];
            let thisElm = selector;

            while (thisElm.previousElementSibling) {
                if (typeof selector === 'string' && selector.length > 0) {
                    // Is is selector and selectors length > 0
                    if (S(thisElm.previousElementSibling).is(selector)) {
                        nextElms.push(thisElm.previousElementSibling)
                    }
                } else {
                    // All elements without any selector
                    nextElms.push(thisElm.previousElementSibling)
                }
                thisElm = thisElm.previousElementSibling
            }

            return nextElms
        }

        next(selector) {
            if (!selector) {
                return
            }

            return this.first(selector).nextElementSibling
        }

        prev(selector) {
            return this.first(selector).previousElementSibling
        }

        is(selector, target) {
            if (!selector.nodeType) {
                WARNINGS.nodeType()
            }
            if (!target) {
                WARNINGS.notEnoughArguments(target)
            }

            if (typeof target === 'string') {
                return selector.matches(target)
            } else if (target.nodeType) {
                return selector === target
            } else {
                WARNINGS.notEnoughArguments(target)
            }
        }

        index(selector, filters) {
            if (!selector.nodeType) {
                WARNINGS.nodeType()
            }


            if (filters) {
                if (typeof filters !== 'string') {
                    WARNINGS.mustBeString(filters)
                }

                let self = this

                return [].slice.call(selector.parentNode.children).filter(elm => {


                    return self.is(elm, filters)
                }).indexOf(selector)
            }

            return [].slice.call(selector.parentNode.children).indexOf(selector)
        }

        siblings(selector, filters) {
            if (!selector.nodeType) {
                WARNINGS.nodeType()
            }

            if (filters) {
                if (typeof filters !== 'string') {
                    WARNINGS.mustBeString(filters)
                }

                let self = this;
                return [...this.prevAll(selector), ...this.nextAll(selector)].filter(elm => {
                    return self.is(elm, filters)
                })
            }

            return [...this.prevAll(selector), ...this.nextAll(selector)]
        }

        closest(selector, target) {
            if (!selector || !selector.nodeType) {
                return
                // WARNINGS.nodeType()
            }
            return selector.closest(target)
        }

        attr(selector, attr, data) {
            if (data !== undefined) {
                // Set
                this.each(selector, function () {
                    if (this.hasAttribute(attr) && this.getAttribute(attr) === data) return

                    if (data === null || data === false) {
                        this.removeAttribute(attr)
                    } else {
                        this.setAttribute(attr, data)
                    }
                })

            } else {
                // Get
                let elms = this.find(selector);
                let attrsArr = []

                elms.forEach(elm => {
                    attrsArr.push(elm.getAttribute(attr))
                })

                if (attrsArr.length === 1) {
                    return attrsArr[0]
                } else {
                    return attrsArr
                }

            }

            return this
        }

        prop(selector, props, value) {
            if (typeof value === 'boolean') {
                // Set
                this.each(selector, function () {
                    this[props] = value
                })

                return this;

            } else {
                // Get
                let elms = this.find(selector)
                let arrOfValue = []
                for (const elm of elms) {
                    arrOfValue.push(elm[props])
                }

                if (arrOfValue.length === 1) {
                    return arrOfValue[0]
                }

                return arrOfValue
            }

        }

        val(selector, data) {
            if (data != undefined) {
                // Set
                this.each(selector, function () {
                    this.value = data;
                })
            } else {
                // Get
                let elms = this.find(selector);
                let valArr = []

                for (const elm of elms) {
                    valArr.push(elm.value)
                }

                if (valArr.length === 1) {
                    return valArr[0]
                } else {
                    return valArr
                }
            }


            return this
        }
        // End: HTML

        // Animations
        // TODO: Document this Animation section
        animate({
            easing = 'easeInOutQuint',
            duration = 500,
            draw = function () {},
            onComplete = function () {},
        }) {
            let start = performance.now()
            let easingFunctions = {
                // no easing, no acceleration
                linear: function (t) {
                    return t
                },
                // accelerating from zero velocity
                easeInQuad: function (t) {
                    return t * t
                },
                // decelerating to zero velocity
                easeOutQuad: function (t) {
                    return t * (2 - t)
                },
                // acceleration until halfway, then deceleration
                easeInOutQuad: function (t) {
                    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
                },
                // accelerating from zero velocity 
                easeInCubic: function (t) {
                    return t * t * t
                },
                // decelerating to zero velocity 
                easeOutCubic: function (t) {
                    return (--t) * t * t + 1
                },
                // acceleration until halfway, then deceleration 
                easeInOutCubic: function (t) {
                    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
                },
                // accelerating from zero velocity 
                easeInQuart: function (t) {
                    return t * t * t * t
                },
                // decelerating to zero velocity 
                easeOutQuart: function (t) {
                    return 1 - (--t) * t * t * t
                },
                // acceleration until halfway, then deceleration
                easeInOutQuart: function (t) {
                    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
                },
                // accelerating from zero velocity
                easeInQuint: function (t) {
                    return t * t * t * t * t
                },
                // decelerating to zero velocity
                easeOutQuint: function (t) {
                    return 1 + (--t) * t * t * t * t
                },
                // acceleration until halfway, then deceleration 
                easeInOutQuint: function (t) {
                    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
                },
                // Exponential acceleration and deceleration
                easeInOutExpo: function (t) {

                    if (t === 0 || t === 1) {
                        return t;
                    }

                    const scaledTime = t * 2;
                    const scaledTime1 = scaledTime - 1;

                    if (scaledTime < 1) {
                        return 0.5 * Math.pow(2, 10 * (scaledTime1));
                    }

                    return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2);

                },

                // Slow start and end, two bounces sandwich a fast motion
                easeInOutElastic: function (t, magnitude = .5) {

                    const p = 1 - magnitude;

                    if (t === 0 || t === 1) {
                        return t;
                    }

                    const scaledTime = t * 2;
                    const scaledTime1 = scaledTime - 1;

                    const s = p / (2 * Math.PI) * Math.asin(1);

                    if (scaledTime < 1) {
                        return -0.5 * (
                            Math.pow(2, 10 * scaledTime1) *
                            Math.sin((scaledTime1 - s) * (2 * Math.PI) / p)
                        );
                    }

                    return (
                        Math.pow(2, -10 * scaledTime1) *
                        Math.sin((scaledTime1 - s) * (2 * Math.PI) / p) * 0.5
                    ) + 1;

                }

            }

            requestAnimationFrame(function move(time) {
                let timePassed = time - start
                let fraction = timePassed / duration
                var progress = easingFunctions[easing](fraction)

                if (progress < 0) progress = 0
                if (progress > 1) progress = 1

                draw(progress)

                if (timePassed < duration) {
                    requestAnimationFrame(move)
                } else {
                    onComplete()
                }
            })
        }

        slideClose(el, options = {}) {
            if (el.isAnimating) {
                return
            }

            el.isAnimating = true

            this.animate({
                elm: el,
                duration: options.duration,
                easing: options.easing,
                draw: function (progress) {
                    el.style.maxHeight = `${ el.scrollHeight - (progress * el.scrollHeight).toFixed(2)}px`
                },
                onComplete: () => {
                    this.attr(el, 'style', null)
                    el.isAnimating = false
                }
            })
        }

        slideOpen(el, options = {}) {
            if (el.isAnimating) {
                return
            }

            el.isAnimating = true

            el.style.display = 'block'
            el.style.maxHeight = 0

            this.animate({
                elm: el,
                duration: options.duration,
                easing: options.easing,
                draw: function (progress) {
                    el.style.maxHeight = `${progress * el.scrollHeight}px`
                },
                onComplete: function () {
                    el.style.maxHeight = ''
                    el.isAnimating = false
                }
            })
        }

        slideToggle(el, options) {
            if (el.style.display === 'block') {
                this.slideClose(el, options)
            } else {
                this.slideOpen(el, options)
            }
        }

        slideToggleCss(el) {
            if (el.isOpen === undefined) {
                let displayCss = window.getComputedStyle(el).display
                el.isOpen = displayCss === 'none' ? false : true
            }

            if (el.isOpen) {
                this.slideCloseCss(el)
            } else {
                this.slideOpenCss(el)
            }

            el.isOpen = !el.isOpen
        }

        slideCloseCss(el) {
            el.removeEventListener('transitionend', this.clearStylesHandler)
            el.removeEventListener('transitionend', this.clearMaxHeightHandler)

            el.classList.remove('slide-open')
            el.style.display = 'block'
            el.style.maxHeight = `${el.scrollHeight}px`
            let css = window.getComputedStyle(el).maxHeight
            el.style.maxHeight = '0px'
            el.addEventListener('transitionend', this.clearStylesHandler, {
                once: true
            })
        }

        slideOpenCss(el) {
            el.removeEventListener('transitionend', this.clearStylesHandler)
            el.removeEventListener('transitionend', this.clearMaxHeightHandler)

            el.classList.add('slide-open')
            el.style.display = 'block'
            el.style.maxHeight = '0px'
            el.style.maxHeight = `${el.scrollHeight}px`
            el.addEventListener('transitionend', this.clearMaxHeightHandler, {
                once: true
            })
        }

        clearStylesHandler(e) {
            // "this" will be DOM element where clearStylesHandler event is triggered
            this.style.maxHeight = ''
            this.style.display = 'none'
        }

        clearMaxHeightHandler(e) {
            // "this" will be DOM element where clearStylesHandler event is triggered
            this.style.maxHeight = ''
        }

        // End: Animations

        // Helpers
        isFunction(functionToCheck) {
            return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
        }

        makeGlobal(fnName, fn) {
            // Create window.App if NOT exist
            if (!window.App) {
                window.App = {}
            }

            // Return if function already exist in window.App
            if (window.App[fnName]) return;

            // Attach function to window.App
            window.App[fnName] = fn
        }

        scrollTo(container, options) {
            if (container) {
                if (container !== window && !container.nodeType) {
                    throw WARNINGS.nodeType('scrollTo')
                }
            }

            let def = {
                behavior: 'smooth',
                offsetY: 0,
                offsetX: 0,
                top: 0,
                left: 0,
                centeringX: false
            }

            let params = Object.assign({}, def, options)

            // If params.top != number (can be DOM element)
            if (typeof params.top !== 'number') {
                params.top = this.getOffsetTop(params.top) - params.offsetY
            }

            // If params.left != number (can be DOM element)
            if (typeof params.left !== 'number') {
                params.left = this.getOffsetLeft(params.left, container, params.centeringX) - params.offsetX
            }

            container.scroll(params);
        }

        getOffsetTop(elm) {
            let bodyRect = document.body.getBoundingClientRect(),
                elemRect = elm.getBoundingClientRect(),
                offsetTop = elemRect.top - bodyRect.top;

            return offsetTop
        }

        getOffsetLeft(elm, container, centeringX) {
            if (centeringX) {
                var offsetLeft = (elm.offsetLeft - container.offsetLeft) - (container.offsetWidth / 2) + (elm.offsetWidth / 2)
            } else {
                var offsetLeft = (elm.offsetLeft - container.offsetLeft)
            }

            return offsetLeft
        }
        // End: helpers    

        // Delegation
        bodyOnClick(selector, fn) {
            bodyAllMethods.push({
                selector: selector,
                fn: fn,
                el: null,
            })
        }
        // End: Delegation
    }

    let init = function () {
        return new S()
    }

    window.SSS = window.S = init();

}(window))