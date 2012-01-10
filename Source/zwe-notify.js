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
            duration: 1000,
            transition: Fx.Transitions.Back.easeOut
        },

        close: {
            duration: 1000,
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
        this._createFx();
    },

    _createContainer: function() {
        this.container = new Element('div', { 'class': this.options.name + '-container' + ' ' + ZweNotify.PlaceHolder }).inject(this.options.inject).store('ZweNotify', this);
        this.container.setStyles(this.options.position).setStyle('position', 'fixed');
    }.protect(),

    _createFx: function() {

    }.protect(),

    alert: function(message, options) {
        options = Object.merge({}, this.options, options);
        if(typeOf(message) == 'string')
            message = { message: message, title: null, image: null };

        var current = this._createElement(message, options),
            closeEvent = function(event) {
                event.preventDefault();
                this._close(current, options);
            }.bind(this);

        current.addEvent('rightClick', closeEvent);
        current.getElement('a.' + options.name + '-close').addEvent('click', closeEvent);

        current.inject(this.container);

        this.elements.push(current);

        this._show(current, options);
    },

    _createElement: function(message, options) {
        var container, move = new Element('div', { 'class': options.name + '-move', id: String.uniqueID() }).adopt(
            container = new Element('div', {
                'class': options.name + '-notification' + ' ' + options.name + '-fx-close'
            }
        ).addEvents({
            mouseenter: function() {
                container.morph('.' + options.name + '-fx-hover');
                clearTimeout(move.retrieve('ZweNotify.CloseTimer', null));
            },
            mouseleave: function() {
                this._close(move, options);
            }.bind(this)
        }).adopt(
            new Element('a', { 'class': options.name + '-close' }).adopt(new Element('span', { text: options.localization.close })),
            new Element('div', { 'class': options.name + '-message', html: message.message })
        ));
        if(message.title)
            container.adopt(new Element('h3', { 'class': options.name + '-title', text: message.title }));
        if(message.image)
            container.grab(new Element('img', { 'class': options.name + 'image', alt: 'image', src: message.image }), 'top');

        return move;
    }.protect(),

    _show: function(current, options) {
        new Fx.Morph(current.getElement('.' + options.name + '-notification'), options.show).start('.' + options.name + '-fx-show');

        current.store('ZweNotify.CloseTimer', this._close.delay(5000, this, [current, options]));
    }.protect(),

    _close: function(current, options) {
        var container = current.getElement('.' + options.name + '-notification');
        container.removeEvents('mouseenter').removeEvents('mouseleave');
        new Fx.Morph(container, options.show).start('.' + options.name + '-fx-close').chain(function() {
            this.elements.erase(current);
            current.destroy();
        }.bind(this));
    }
});

ZweNotify.PlaceHolder = String.uniqueID();