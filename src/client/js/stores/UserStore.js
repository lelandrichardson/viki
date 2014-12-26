var Flux = require('react-flux');
var AuthConstants = require('../actions/AuthActions').Constants;

var UserStore = Flux.createStore({

    getInitialState: function() {
        return {};
    }
    
},[

    // top nav add item button has been clicked
    // [AuthConstants.LOGIN_SUCCESS, function(payload){
    //     var user = payload[0];
    //     var items = this.get('items');
    //     items.push(item);

    //     this.setState({
    //         session: {
    //             isLoggedIn: true,
    //             user: user
    //         }
    //     });
    // }]

]);

module.exports = UserStore;