var React = require('react');

var Image = React.createClass({

    propTypes: {
        image: React.PropTypes.object,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        crop: React.PropTypes.bool
    },

    src: function () {
        var image = this.props.image || {
                id: this.props.imageId,
                width: this.props.width,
                height: this.props.height
            };

        return ["/media/", image.id, image.ext].join("");
    },

    render: function () {
        var width = this.props.width || this.props.image.width;
        var height = this.props.height || this.props.image.height;
        return (
            <img {...this.props} src={this.src()} width={width} height={height} />
        );
    }
});

module.exports = Image;