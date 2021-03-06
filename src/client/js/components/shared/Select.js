var React = require('react');
var Value = require('./MultiSelectValue');
var Input = require('./AutosizedInput');
var classNames = require('../../util/classNames');

var requestId = 0;

var Select = React.createClass({

    propTypes: {
        value: React.PropTypes.any,             // initial field value
        valueLink: React.PropTypes.shape({      // LMR ADDITION: enables valueLink plugin functionality
            value: React.PropTypes.any,
            requestChange: React.PropTypes.func
        }),
        multi: React.PropTypes.bool,            // multi-value input
        options: React.PropTypes.array,         // array of options
        delimiter: React.PropTypes.string,      // delimiter to use to join multiple values
        asyncOptions: React.PropTypes.func,     // function to call to get options
        autoload: React.PropTypes.bool,         // whether to auto-load the default async options set
        placeholder: React.PropTypes.string,    // field placeholder, displayed when there's no value
        noResultsText: React.PropTypes.string,  // placeholder displayed when there are no matching search results
        name: React.PropTypes.string,           // field name, for hidden <input /> tag
        onChange: React.PropTypes.func,         // onChange handler: function(newValue) {}
        className: React.PropTypes.string,      // className for the outer element
        filterOption: React.PropTypes.func,     // method to filter a single option: function(option, filterString)
        filterOptions: React.PropTypes.func,    // method to filter the options array: function([options],
                                                // filterString, [values])
        matchPos: React.PropTypes.string,       // (any|start) match the start or entire string when filtering
        matchProp: React.PropTypes.string,      // (any|label|value) which option property to filter on

        renderItem: React.PropTypes.func,       // LMR ADDITION:
        renderValue: React.PropTypes.func       // LMR ADDITION:
    },

    getDefaultProps: function () {
        return {
            value: undefined,
            options: [],
            delimiter: ',',
            asyncOptions: undefined,
            autoload: true,
            placeholder: 'Select...',
            noResultsText: 'No results found',
            name: undefined,
            onChange: undefined,
            className: undefined,
            matchPos: 'any',
            matchProp: 'any',
            renderValue: val => val.label
        };
    },

    getInitialState: function () {
        return {
            /*
             * set by getStateFromValue on componentWillMount:
             * - value
             * - values
             * - filteredOptions
             * - inputValue
             * - placeholder
             * - focusedOption
             */
            options: this.props.options,
            isFocused: false,
            isOpen: false,
            isLoading: false,
        };
    },

    getValueLink: function ( props ) {
        props = props || this.props;
        return props.valueLink || {
                value: props.value,
                requestChange: props.onChange || function () {
                }
            };
    },

    componentWillMount: function () {
        this._optionsCache = {};
        this._optionsFilterString = '';
        this.setState(this.getStateFromValue(this.getValueLink().value));

        if (this.props.asyncOptions && this.props.autoload) {
            this.autoloadAsyncOptions();
        }
    },

    componentWillUnmount: function () {
        clearTimeout(this._blurTimeout);
        clearTimeout(this._focusTimeout);
    },

    componentWillReceiveProps: function ( newProps ) {
        if (newProps.value !== this.state.value) {
            this.setState(this.getStateFromValue(this.getValueLink(newProps).value, newProps.options));
        }
        if (JSON.stringify(newProps.options) !== JSON.stringify(this.props.options)) {
            this.setState({
                options: newProps.options,
                filteredOptions: this.filterOptions(newProps.options)
            });
        }
    },

    componentDidUpdate: function () {
        if (this._focusAfterUpdate) {
            clearTimeout(this._blurTimeout);
            this._focusTimeout = setTimeout(() => {
                this.refs.input.focus();
                this._focusAfterUpdate = false;
            }, 50);
        }
    },

    getStateFromValue: function ( value, options ) {

        if (!options) {
            options = this.state.options;
        }

        // reset internal filter string
        this._optionsFilterString = '';

        var values = this.initValuesArray(value, options),
            filteredOptions = this.filterOptions(options, values);

        return {
            value: values.length ? values[0] : null,
            values: values,
            inputValue: '',
            filteredOptions: filteredOptions,
            placeholder: !this.props.multi && values.length ? this.props.renderValue(values[0]) : this.props.placeholder,
            focusedOption: !this.props.multi && values.length ? values[0] : filteredOptions[0]
        };
    },

    initValuesArray: function ( values, options ) {

        if (!Array.isArray(values)) {
            if ('string' === typeof values) {
                values = values.split(this.props.delimiter);
            } else {
                values = values ? [values] : [];
            }
        }

        return values.map(( val ) => {
            // LMR NOTE: this is instead of `_.findWhere(options, { value: val })`
            return ('string' === typeof val) ? val = options.find(x => x.value === val) || {
                value: val,
                label: val
            } : val;
        });

    },

    setValue: function ( value ) {
        this._focusAfterUpdate = true;
        var newState = this.getStateFromValue(value);
        newState.isOpen = false;
        this.fireChangeEvent(newState);
        this.setState(newState);
    },

    selectValue: function ( value ) {
        this[this.props.multi ? 'addValue' : 'setValue'](value);
    },

    addValue: function ( value ) {
        this.setValue(this.state.values.concat(value));
    },

    popValue: function () {
        // LMR NOTE: this is instead of `_.initial(this.state.values)`
        var array = Array.from(this.state.values);
        array.pop();
        this.setValue(array);
    },

    removeValue: function ( value ) {
        // LMR NOTE: this is instead of `_.without(this.state.values, value)`
        var values = this.state.values,
            indexOf = values.indexOf(value);

        if (indexOf !== -1) {
            values.splice(indexOf, 1);
        }

        this.setValue(values);
    },

    clearValue: function ( event ) {
        // if the event was triggered by a mousedown and not the primary
        // button, ignore it.
        if (event && event.type == 'mousedown' && event.button !== 0) {
            return;
        }
        this.setValue(null);
    },

    resetValue: function () {
        this.setValue(this.state.value);
    },

    fireChangeEvent: function ( newState ) {
        if (newState.value !== this.state.value) {
            this.getValueLink().requestChange(newState.value, newState.values);
            //this.props.onChange(newState.value, newState.values);
        }
    },

    handleMouseDown: function ( event ) {
        // if the event was triggered by a mousedown and not the primary
        // button, ignore it.
        if (event.type == 'mousedown' && event.button !== 0) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        if (this.state.isFocused) {
            this.setState({
                isOpen: true
            });
        } else {
            this._openAfterFocus = true;
            this.refs.input.focus();
        }
    },

    handleInputFocus: function () {
        this.setState({
            isFocused: true,
            isOpen: this.state.isOpen || this._openAfterFocus
        });
        this._openAfterFocus = false;
    },

    handleInputBlur: function ( event ) {
        this._blurTimeout = setTimeout(() => {
            if (this._focusAfterUpdate) {
                return;
            }
            this.setState({
                isOpen: false,
                isFocused: false
            });
        }, 50);
    },

    handleKeyDown: function ( event ) {

        switch ( event.keyCode ) {

            case 8: // backspace
                if (!this.state.inputValue) {
                    this.popValue();
                }
                return;
                break;

            case 9: // tab
                if (event.shiftKey || !this.state.isOpen || !this.state.focusedOption) {
                    return;
                }
                this.selectFocusedOption();
                break;

            case 13: // enter
                this.selectFocusedOption();
                break;

            case 27: // escape
                if (this.state.isOpen) {
                    this.resetValue();
                } else {
                    this.clearValue();
                }
                break;

            case 38: // up
                this.focusPreviousOption();
                break;

            case 40: // down
                this.focusNextOption();
                break;

            default:
                return;
        }

        event.preventDefault();

    },

    handleInputChange: function ( event ) {

        // assign an internal variable because we need to use
        // the latest value before setState() has completed.
        this._optionsFilterString = event.target.value;

        if (this.props.asyncOptions) {
            this.setState({
                isLoading: true,
                inputValue: event.target.value
            });
            this.loadAsyncOptions(event.target.value, {
                isLoading: false,
                isOpen: true
            });
        } else {
            var filteredOptions = this.filterOptions(this.state.options);
            this.setState({
                isOpen: true,
                inputValue: event.target.value,
                filteredOptions: filteredOptions,
                focusedOption: filteredOptions.indexOf(this.state.focusedOption) !== -1 ? this.state.focusedOption : filteredOptions[0]
            });
        }

    },

    autoloadAsyncOptions: function () {
        this.loadAsyncOptions('', {}, function () {
        });
    },

    loadAsyncOptions: function ( input, state ) {

        for (var i = 0; i <= input.length; i++) {
            var cacheKey = input.slice(0, i);
            if (this._optionsCache[cacheKey] && (input === cacheKey || this._optionsCache[cacheKey].complete)) {
                var options = this._optionsCache[cacheKey].options;
                this.setState(Object.assign({
                    options: options,
                    filteredOptions: this.filterOptions(options)
                }, state));
                return;
            }
        }

        var thisRequestId = this._currentRequestId = requestId++;

        this.props.asyncOptions(input, ( err, data ) => {

            this._optionsCache[input] = data;

            if (thisRequestId !== this._currentRequestId) {
                return;
            }

            this.setState(Object.assign({
                options: data.options,
                filteredOptions: this.filterOptions(data.options)
            }, state));

        });

    },

    filterOptions: function ( options, values ) {
        var filterValue = this._optionsFilterString;
        var exclude = (values || this.state.values).map(function ( i ) {
            return i.value;
        });
        if (this.props.filterOptions) {
            return this.props.filterOptions.call(this, options, filterValue, exclude);
        } else {
            var filterOption = function ( op ) {
                if (this.props.multi && exclude.indexOf(op.value) !== -1) {
                    return false;
                }
                if (this.props.filterOption) {
                    return this.props.filterOption.call(this, op, filterValue);
                }
                return !filterValue || (this.props.matchPos === 'start') ? (
                (this.props.matchProp !== 'label' && op.value.toLowerCase().substr(0, filterValue.length) === filterValue) ||
                (this.props.matchProp !== 'value' && op.label.toLowerCase().substr(0, filterValue.length) === filterValue)
                ) : (
                (this.props.matchProp !== 'label' && op.value.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) ||
                (this.props.matchProp !== 'value' && op.label.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0)
                );
            };
            return options.filter(filterOption, this);
        }
    },

    selectFocusedOption: function () {
        return this.selectValue(this.state.focusedOption);
    },

    focusOption: function ( op ) {
        this.setState({
            focusedOption: op
        });
    },

    focusNextOption: function () {
        this.focusAdjacentOption('next');
    },

    focusPreviousOption: function () {
        this.focusAdjacentOption('previous');
    },

    focusAdjacentOption: function ( dir ) {

        var ops = this.state.filteredOptions;

        if (!this.state.isOpen) {
            this.setState({
                isOpen: true,
                inputValue: '',
                focusedOption: this.state.focusedOption || ops[dir === 'next' ? 0 : ops.length - 1]
            });
            return;
        }

        if (!ops.length) {
            return;
        }

        var focusedIndex = -1;

        for (var i = 0; i < ops.length; i++) {
            if (this.state.focusedOption === ops[i]) {
                focusedIndex = i;
                break;
            }
        }

        var focusedOption = ops[0];

        if (dir === 'next' && focusedIndex > -1 && focusedIndex < ops.length - 1) {
            focusedOption = ops[focusedIndex + 1];
        } else if (dir === 'previous') {
            if (focusedIndex > 0) {
                focusedOption = ops[focusedIndex - 1];
            } else {
                focusedOption = ops[ops.length - 1];
            }
        }

        this.setState({
            focusedOption: focusedOption
        });

    },

    unfocusOption: function ( op ) {
        if (this.state.focusedOption === op) {
            this.setState({
                focusedOption: null
            });
        }
    },

    buildMenu: function () {

        var focusedValue = this.state.focusedOption ? this.state.focusedOption.value : null;

        var renderItem = this.props.renderItem || (op => op.label);

        var ops = this.state.filteredOptions.map(function ( op ) {

            var optionClass = classNames({
                'Select-option': true,
                'is-focused': focusedValue === op.value
            });

            var mouseEnter = this.focusOption.bind(this, op),
                mouseLeave = this.unfocusOption.bind(this, op),
                mouseDown = this.selectValue.bind(this, op);

            return <div key={'option-' + op.value} className={optionClass} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown}>{renderItem(op)}</div>;

        }, this);

        return ops.length ? ops : <div className="Select-noresults">{this.props.noResultsText}</div>;

    },

    render: function () {

        var selectClass = classNames('Select', this.props.className, {
            'is-multi': this.props.multi,
            'is-open': this.state.isOpen,
            'is-focused': this.state.isFocused,
            'is-loading': this.state.isLoading,
            'has-value': this.state.value
        });

        var value = [];

        if (this.props.multi) {
            this.state.values.forEach(( val ) => {
                value.push(<Value key={val.value} value={val} onRemove={this.removeValue.bind(this, val)} renderValue={this.props.renderValue} />);
            });
        }

        if (!this.state.inputValue && (!this.props.multi || !value.length)) {
            value.push(<div className="Select-placeholder" key="placeholder">{this.state.placeholder}</div>);
        }

        var loading = this.state.isLoading ? <span className="Select-loading" aria-hidden="true" /> : null;
        var clear = this.state.value ? <span className="Select-clear" aria-label="Clear value" onMouseDown={this.clearValue} dangerouslySetInnerHTML={{ __html: '&times;' }} /> : null;
        var menu = this.state.isOpen ? <div className="Select-menu">{this.buildMenu()}</div> : null;

        return (
            <div ref="wrapper" className={selectClass}>
                <input type="hidden" ref="value" name={this.props.name} value={this.state.value} />
                <div className="Select-control" ref="control" onKeyDown={this.handleKeyDown} onMouseDown={this.handleMouseDown}>
					{value}
                    <Input className="Select-input" tabIndex={this.props.tabIndex} ref="input" value={this.state.inputValue} onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} onChange={this.handleInputChange} minWidth="5" />
                    <span className="Select-arrow" />
					{loading}
					{clear}
                </div>
				{menu}
            </div>
        );

    }

});

module.exports = Select;