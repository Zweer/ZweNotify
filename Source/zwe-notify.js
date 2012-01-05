/*
---

name: ZweNotify

authors:
  - Niccolò Olivieri (flicofloc@gmail.com)
...
*/

var ZweNotify = new Class({
    Implements: [Options, Events, Chain],

    options: {
        name: 'zwenotify',
        inject: null,

        position: 'bottomRight',        // Possible values: 'bottomRight', 'bottomLeft', 'topRight', 'topLeft'

        show: {
            duration: 500,
            transition: Fx.Transitions.Back.easeOut
        },

        close: {
            duration: 500,
            transition: Fx.Transitions.Sine.easeOut
        },

        localization: {
            close: 'Close'
        }
    },

    container: null,
    positions: {
        topLeft: { top: 0, bottom: 'auto', left: 0, right: 'auto' },
        topRight: { top: 0, bottom: 'auto', left: 'auto', right: 0 },
        bottomLeft: { top: 'auto', bottom: 0, left: 0, right: 'auto' },
        bottomRight: { top: 'auto', bottom: 0, left: 'auto', right: 0 }
    },
    elements: [],

    initialize: function(options) {
        this.setOptions(options);
        this.options.inject = this.options.inject || document.body;
        this.options.position = typeOf(this.options.position) == 'string' ? this.positions[this.options.position] : this.options.position;

        this._createContainer();
    },

    _createContainer: function() {
        this.container = new Element('div', { 'class': this.options.name + '-container' + ' ' + ZweNotify.PlaceHolder }).inject(this.options.inject).store('ZweNotify', this);
        this.container.setStyles(this.options.position).setStyle('position', 'fixed');
    }.protect(),

    alert: function(message, options) {
        if(typeOf(message) == 'string')
            message = { message: message, title: null, image: null };

        var current = this._createElement(message, options),
            closeEvent = function(event) {
                event.preventDefault();
                this._close(current);
            }.bind(this);

        current.addEvent('rightClick', closeEvent);
        current.getElement('a').addEvent('click', closeEvent);

        current.inject(this.container);

        this.elements.push(current);

        this._show(message, options);
    },

    _createElement: function(message, options) {
        var move, container = new Element('div', { 'class': this.options.name + '-notification', id: String.uniqueID() }).adopt(move = new Element('div', { 'class': this.options.name + '-move' }).adopt(
            new Element('a', { 'class': this.options.name + '-close' }).adopt(new Element('span', { text: this.options.localization.close })),
            new Element('div', { 'class': this.options.name + '-message', html: message.message })
        ));
        if(message.title)
            move.adopt(new Element('h3', { 'class': this.options.name + '-title', text: message.title }));
        if(message.image)
            move.grab(new Element('img', { 'class': this.options.name + 'image', alt: 'image', src: message.image }), 'top');

        return container;
    }.protect(),

    _show: function(message, options) {

    }.protect(),

    _close: function(element) {
        this.elements.erase(element);
        element.destroy();
    }
});

ZweNotify.PlaceHolder = String.uniqueID();