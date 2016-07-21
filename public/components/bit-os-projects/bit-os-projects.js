import Component from 'can-component';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import './bit-os-projects.less';
import template from './bit-os-projects.stache';
import OSProject from '../../models/os-project';
import ContributionMonth from '../../models/contribution-month';

export const ViewModel = DefineMap.extend({
    // Passed properties
    contributionMonth: {
        Value: ContributionMonth
    },

    // Stateful properties
    activePromise: "*",
    adding: {
        type: 'boolean',
        value: false
    },
    newOSProjectName: 'string',
    selectedOSProjectId: {
        type: 'string',
        value: '__new__'
    },

    allOSProjects: {
        value: function() {
            return OSProject.getList();
        }
    },
    // Derived properties
    creatingNewOSProject: {
        get: function() {
            return this.selectedOSProjectId === "__new__";
        }
    },

    // Methods
    toggleAddNewMonthlyOSProject: function() {
        this.newOSProjectName = '';
        this.adding = !this.adding;
    },
    addNewMonthlyOSProject: function(ev) {

        if (ev) {
            ev.preventDefault();
        }
        if (this.selectedOSProjectId === '__new__') {
            let newOSProject = new OSProject({
                name: this.newOSProjectName
            });

            this.activePromise = newOSProject.save().then((osProject) => {
                debugger;
                this.toggleAddNewMonthlyOSProject();
                return this.contributionMonth.addNewMonthlyOSProject(osProject);
            });


        } else {
            this.activePromise = this.allOSProjects.then((projects) => {
                projects.each((proj) => {
                    if (this.selectedOSProjectId === proj._id) {
                        this.contributionMonth.addNewMonthlyOSProject(proj);
                        this.toggleAddNewMonthlyOSProject();
                    }
                });
            });

        }

        return this.activePromise;
    },
    updateComissionedForMonthlyOSProject: function(monthlyOSProject, commissioned) {
        monthlyOSProject.commissioned = commissioned;

        this.activePromise = this.contributionMonth.save();
    },
    totalForMonthlyOSProject: function(monthlyOSProject) {
        return 0;
    }
});

export default Component.extend({
    tag: 'bit-os-projects',
    ViewModel: ViewModel,
    template: template
});
