import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-auth.less!';
import template from './page-auth.stache!';
import User from 'bitcentive/models/user';

export const ViewModel = DefineMap.extend({
  subpage: {}, // bound to the subpage in the AppState.
  session: '*',
  email: 'string',
  password: 'string',
  setSubpage(tabName) {
    this.subpage = tabName;
  },
  isOAuthRoute: {
    get(){
      return this.subpage === 'success' || this.subpage === 'failure';
    }
  }
});

export default Component.extend({
  tag: 'page-auth',
  ViewModel,
  template
});
