import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './contribution-month.less';
import template from './contribution-month.stache';
import ContributionMonth from 'bitcentive/models/contribution-month';

export const ViewModel = DefineMap.extend({
  // Passed props
  contributionMonthId: "string",

  // derived props
  contributionMonthPromise: {
    get: function(){
      if(this.contributionMonthId) {
        return ContributionMonth.get(
            this.contributionMonthId
          );
      }
    }
  },
  contributionMonth: {
    get: function(initialValue, resolve){
      if(this.contributionMonthPromise) {
        this.contributionMonthPromise.then(resolve, (err) => {
          console.error("Error loading contribution month: ", err);
        });
      }
    }
  }
});

export default Component.extend({
  tag: 'bit-contribution-month',
  ViewModel: ViewModel,
  template
});
