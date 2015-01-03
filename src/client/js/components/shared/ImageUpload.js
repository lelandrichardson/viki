var React = require('react');
var $http = require('../../util/$http');

var ImageUpload = React.createClass({

    propTypes: {
        onChange: React.PropTypes.func
    },

    getInitialState: function () {
        return {
            busy: false
        };
    },

    handleSubmit: function ( e ) {

        var data = new FormData();

        data.append("file", this.refs.file.getDOMNode().files[0]);

        this.setState({ busy: true });

        $http.post("/upload", data, {
            stringify: false,
            contentType: false
        }).then(this._uploadSuccess, this._uploadFail);
    },

    _uploadSuccess: function ( image ) {
        this.setState({ busy: false });
        this.setImage(image);
    },

    _uploadFail: function ( error ) {
        this.setState({ busy: false });
    },

    handleFileChange: function ( e ) {
        if (e.target.value) {
            this.handleSubmit();
        }
    },

    handleClick: function ( e ) {
        //TODO: this probably won't work for IE. Need to make browser compatible...
        this.refs.file.getDOMNode().click();
    },

    setImage: function ( image ) {
        if (this.props.onChange) {
            this.props.onChange(image);
        }
    },

    render: function () {
        return (
            <div>
                <input className="hide" ref="file" name="file" type="file" accept="image/*" onChange={this.handleFileChange}/>
                <button ref="button" type="button" onClick={this.handleClick}>{this.state.busy ? "Uploading..." : "Upload"}</button>
            </div>
        );
    }

});

module.exports = ImageUpload;