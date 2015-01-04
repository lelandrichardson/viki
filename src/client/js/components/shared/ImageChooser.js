var React = require('react');

// Components
var Image = require('./Image');
var ImageUpload = require('./ImageUpload');

var ImageChooser = React.createClass({

    propTypes: {
        value: React.PropTypes.object,
        onChange: React.PropTypes.func,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.object,
            requestChange: React.PropTypes.func.isRequired
        }),
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            width: 240,
            height: 180
        };
    },

    getValueLink: function () {
        return this.props.valueLink || {
                value: this.props.value,
                requestChange: this.props.onChange
            };
    },

    onChange: function ( image ) {
        this.getValueLink().requestChange(image);
    },

    render: function () {

        var image = this.getValueLink().value;

        var imageDetails = image && (
                <div>
                    <div>
                        <b>File:</b> {image.id + image.ext}
                    </div>
                    <div>
                        <b>Size:</b> {[image.width, "px x ", image.height, "px"].join("")}
                    </div>
                </div>
            );

        var preview = image ? (
            <Image image={image} width={this.props.width} height={this.props.height} crop={true} />
        ) : (
            <div style={{
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                width: this.props.width,
                height: this.props.height
            }} />
        );

        return (
            <div className="mb">
                <div className="media mr10">
                    {preview}
                </div>
                <div className="body">
                    <ImageUpload onChange={this.getValueLink().requestChange} />
                    {imageDetails}
                </div>
            </div>
        );
    }
});

module.exports = ImageChooser;