var merge = require('deepmerge');

var MergeMixin = {
    mergeState: function ( ...props ) {

        // NOTE: this WILL work in ES6, but the JSX harmony compiler is choking on it still
        //this.state = merge(this.state, ...props);

        props.unshift(this.state);
        this.state = merge.apply(null, args);

        this.forceUpdate();
    }
};

module.exports = MergeMixin;