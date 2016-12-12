import React, {Component} from 'react';
import {BaseComponent} from 'common/baseComponent';
import {render} from 'react-dom';
import {withRouter} from 'react-router';
import {HomeActions, HomeStore} from 'models/home';

export default withRouter(class extends BaseComponent {

  static displayName = 'app-home';

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  state = {

  }

  componentWillMount() {

    // this.listen(HomeStore, 'onGetMenuSuccess', function(data, type) {
    //   console.log(type, data);
    // });

    // this.listen(HomeStore, 'onTestSuccess onGetMenuSuccess', function(data, type) {
    //   console.log(type, data);
    // });

    // this.listen(HomeStore, 'onTestSuccess', function(data, type) {
    //   console.log(type, data);
    // });

    // this.listen(HomeStore, 'onTestFailed', function(data, type) {
    //   console.log(type, data);
    // });

    // this.listen(HomeStore, 'onTestSuccess', function(data, type) {
    //   console.log(type, data);
    // }, function(data) {
    //   console.log('失败', data);
    // });

    HomeActions.getMenu();
    HomeActions.test();
  }

  componentDidMount() {
    console.log(this.props);
    //this.props.router.pushState({test:123},'/inbox');
  }
  render() {
    return (
      <div>
        <h2>Home</h2>
        <h3>This is Home page!</h3>
      </div>
    )
  }
})
