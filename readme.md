# Utils

Util methods to work with DOM.

**Warning**
All methods has ```console.warn``` if passed selector is ```null``` or ```undefined```. Doesn't work in minified file _utils.min.js_

## Usage
**HTML**
```html
<button> Click me </button>
<button> I'm awesome </button>
```

**JS**
```js
let btns = S.find('button')
S.addClass(btns, 'active')

// Or
S.addClass('button', 'active')
```

**HTML Result**
```html
<button class="active"> Click me </button>
<button class="active"> I'm awesome </button>
```

## Methods

#### Find
Returns array of selected elements
```js
S.each(selector, target)
```
```js
let btns = S.find('button')
console.log(btns) // [button, button ... ]

// Find button inside parent
S.find('#parent', 'button')
```

#### First
Returns First founded clean DOM element without array.
```js
S.first(selector, [childSelector, callback])
```
```js
let firstButton = S.first('button') // Search in <body>
console.log(btns) // <button>...</button>

// or
let firstButton = S.first('header', button) // Search in <header>
console.log(btns) // <button>...</button>
```

#### Each (Chainable)
Loops through founded elements and run callback. Inside callback **_this_** will be the the link to each element
```js
S.each(selector, callback)
```
```js
let btns = S.find('button')
S.each(btns, doSomething)

// Or
S.each('button', doSomething)

function doSomething(){
    console.log( this ) // <button>...</button>
}
```

#### Add / Remove / Toggle class (Chainable)
Add class or array of classes to all founded elements
```js
S.addClass(selector, string|array)
```
```js
// Single class
let btns = S.find('button')
S.addClass(btns, 'active')
S.removeClass(btns, 'active')
S.toggleClass(btns, 'active')

// Array of classes
S.addClass(btns, ['active', 'small'])
S.removeClass(btns, ['active', 'small'])
S.toggleClass(btns, ['active', 'small'])
```

#### Has class
Returns **true** or **false**. Works only with **FIRST founded**  element.
```js
S.hasClass(selector)
```
```js
let btnIsActive = S.hasClass('button', 'active')
console.log(btnIsActive) // true or false
```

#### On (Chainable)
Adds event listener on selector. 
```js
S.on(selector, method, [target,] callback, [options])
```
```js
S.on('button', 'click', function(){
    S.toggleClass(this, 'active')  // this - reference to native DOM element
}, false)

// Delegate event
S.on('body', 'click', 'button', function(){
    S.toggleClass(this, 'active')  // this - reference to native DOM element
}, false)
```

**Attention:** If device is iPhone or iPad, click event will automaticaly change to touchstart on body, html, document
```js
// Click event will change to touchevent automaticaly on iOS
S.on('body', 'click', function(){
    S.toggleClass(this, 'active')
})
```

#### Trigger (Chainable)
Dispatches event (native or custom)
```js
S.trigger(selector, event, [object])
```
```js
// Listen for event 'btnClicked'
document.addEventListener('btnClicked', function () {
    console.log( 'clicked' );
})

S.on('.btn', 'click', function () {
    // Trigger event 'btnClicked'
    S.trigger(document, 'btnClicked', {
        detail: {
            active: true
        }
    })
})
```

#### Delegate click to body
Delegate clicks to body. Using any amount of delegates will create only one event on body
```js
S.bodyOnClick(selector, callback)
// Selector - must be string
```
```js
S.bodyOnClick('.c1', clickHandler1)
S.bodyOnClick('#c2', clickHandler2)
S.bodyOnClick('[data-c3]', clickHandler3)

function clickHandler1() { console.log('You clicked on Class: ', this) }
function clickHandler2() { console.log('You clicked on ID: ', this) }
function clickHandler3() { console.log('You clicked on DataAttribute: ', this) }
```

#### HTML (Chainable)
Change html inside selector. Data can be text or HTML-like text with tags
```js
S.html(selector, data)
```
```js
S.html(this, 'I am awesome')
S.html(this, '<h1>I am awesome</h1>')
```

#### Append / Prepend (Chainable)
Appends / prepends data inside selector. Data can be text or HTML-like text with tags
```js
S.append(selector, data)
```
```js
S.append(this, 'I am awesome')
S.prepend(this, '<h1>I am awesome</h1>')
```

#### Remove
Removes **all** selected elements from DOM
```js
S.remove(selector)
```
```js
S.remove('button')
```

#### Next / Prev
Returns **First** elements after / before selector. Works with first founded selector. If nothing found - returns null
```js
S.next(selector) // <element>...</element>
S.prev(selector)
```
```js
S.on('button', 'click', function () {
    console.log( S.next(this) ); // <element>...</element>
})
```

#### Next All / Prev All
Returns array of **all** elements after / before selector. Works with first founded selector. If nothing found - returns null
```js
S.nextAll(selector) // [element, element, element, ...]
S.prevAll(selector)
```
```js
S.on('button', 'click', function () {
    console.log( S.nextAll(this) ); // [element, element, element, ...]
})
```

#### Index
Returns index of element in parent. Second argument **must** be string. If second argument is passed, returns element index matched passed argument.
```js
S.index(selector, [string])
```
```js
S.index('button') // 0, 1, 2...
```

#### Siblings
Returns siblings of selector in parent. Second argument **must** be string. If second argument is passed, returns array of elements matched passed argument.
```js
S.siblings(selector, [string])
```
```js
S.siblings('button') // [button, button, ...]
```

#### Is
Returns true or false
```js
S.is(selector, nodeType|string)
```
```js
S.is('button', '[data-index="0"]') // true or false
```

#### Closest
Returns closest target|parent element of selector
```js
S.closest(selector, target)
```
```js
S.closest('button', '.parent') // <div class="parent">...</div>
```

#### Attr
Gets or Sets attribute to selector
```js
S.attr(selector, attribute, [data])
```
```js
// Set attribute
S.attr('button', 'data-count', '0')

// Get attribute
S.attr('button', 'data-count') // '0'
```

#### Prop
Gets or Sets property to selector
```js
S.attr(selector, prop, [value])
```
```js
// Set property
S.prop('input', 'checked', true)

// Get property
S.prop('input', 'checked') // true
```

#### Val
Gets or Sets value of input/textarea
```js
S.attr(selector, data)
```
```js
// Set value
S.val('input', 'I am awesome')

// Get value
S.val('input', 'checked') // 'I am awesome'
```

#### Slide Open / Close / Toggle
Triggers slide animation
```js
S.slideOpen(selector, duration)
```
```js
let isOpen = false;

S.on('button', 'click', function(){
    if (isOpen) {
        S.slideClose('.container', .2)
    } else {
        S.slideOpen('.container')
    }
    
    isOpen = !isOpen
})

// Or
S.on('button', 'click', function(){
    S.slideToggle('.container', .4)
})
```

#### Make Global
Sets function to global window.App object
```js
S.makeGlobal(fnName, fn)
```
```js
// IIFE
(function(){
    let startCoding = function(){
        console.log('I am awesome!')
    }

    S.makeGlobal('startCoding', startCoding)
}())

window.App.startCoding() // I am awesome!
```