var React = require('react');

var ValueLinkMixin = require('../../mixins/ValueLinkMixin');

var Radio = React.createClass({

    propTypes: {
        value: React.PropTypes.any,
        label: React.PropTypes.any,
        checked: React.PropTypes.bool,
        name: React.PropTypes.string,
        onChange: React.PropTypes.func
    },

    render: function () {
        return (
            <label>
                <input
                    type="radio"
                    name={this.props.name}
                    value={this.props.value}
                    checked={!!this.props.checked}
                    onChange={this.props.onChange}
                />
                {this.props.label}
            </label>
        );
    }
});

var RadioGroup = React.createClass({

    mixins: [
        ValueLinkMixin(React.PropTypes.any)
    ],

    propTypes: {
        values: React.PropTypes.array,
        name: React.PropTypes.string.isRequired
    },

    handleChange: function ( value ) {
        this.getValueLink().requestChange(value);
    },

    optionToRadio: function ( op, index, array ) {
        return (
            <Radio
                key={op.value}
                value={op.value}
                label={op.label}
                name={this.props.name}
                checked={this.getValueLink().value === op.value}
                onChange={this.handleChange.bind(this, op.value)}
            />
        );
    },

    childToRadio: function ( child, index, array ) {
        return (
            <Radio
                {...child.props}
                key={child.props.value}
                name={this.props.name}
                checked={this.getValueLink().value === child.props.value}
                onChange={this.handleChange.bind(this, child.props.value)}
            />
        );
    },

    render: function () {
        var children = this.props.values
            ? this.props.values.map(this.optionToRadio, this)
            : React.Children.map(this.props.children, this.childToRadio, this);

        return (
            <div>
                {children}
            </div>
        );
    }
});

var YES_NO_VALUES = [
    { value: true, label: "Yes" },
    { value: false, label: "No" }
];

var YesNo = React.createClass({
    render: function () {
        return (
            <RadioGroup {...this.props} values={YES_NO_VALUES} />
        );
    }
});

module.exports = {
    Radio: Radio,
    RadioGroup: RadioGroup,
    YesNo: YesNo
};