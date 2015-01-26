var Flux = require('react-flux');

var ProgressStore = Flux.createStore({

    trackProgressFor: function ( constant ) {
        this.state.set(constnt, true);

        this.addActionHandler(constant, {
            getInitialState: function () {
                return {
                    isInProgress: false
                };
            },
            before: function () {
                this.setState({ isInProgress: true });
            },
            after: function () {
                this.setState({ isInProgress: false });
            }
        });
    },

    isTrackingProgress: function ( constant ) {
        return !!this.get(constant);
    },

    isInProgress: function ( constant ) {
        if (!this.isTrackingProgress(constant)) {
            this.trackProgressFor(constant);
        }
        return this.getActionState(constant, 'isInProgress');
    }
});

module.exports = ProgressStore;