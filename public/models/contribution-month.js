import ClientProject from "./client-project";
import OSProject from "./os-project";
import Contributor from "./contributor";

import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superMap from "can-connect/can/super-map/";

import "../lib/prefilter";
import moment from "moment";

var contributionMonthAlgebra = new set.Algebra(
  set.comparators.id("_id"),
  set.comparators.sort("$sort", function(set, cm1, cm2){
    return moment(cm1.date).toDate() - moment(cm2.date).toDate();
  })
);

var makeOSProject = function(props){
  if(props instanceof OSProject) {
    return props;
  } else {
    return OSProject.connection.hydrateInstance(props);
  }
};
var makeClientProject = function(props){
  if(props instanceof ClientProject) {
    return props;
  } else {
    return ClientProject.connection.hydrateInstance(props);
  }
};

var MonthlyOSProject = DefineMap.extend("MonthlyOSProject",{
  osProjectId: "string",
  significance: "number",
  commissioned: "boolean",
  osProject: { type: makeOSProject }
});

MonthlyOSProject.List = DefineList.extend({
  "*": MonthlyOSProject,
  monthlyOSProjectIdMap: {
    get: function() {
      var map = {};
      this.forEach((monthlyOSProject) => {
        map[monthlyOSProject.osProjectId] = monthlyOSProject;
      });
      return map;
    }
  },
  has: function(osProject){
    return osProject._id in this.monthlyOSProjectIdMap;
  },
  getSignificance: function(osProjectId) {
    var osProject = this.monthlyOSProjectIdMap[osProjectId];
    return osProject ? osProject.significance : 0;
  }
});

var MonthlyClientProjectsOsProject = DefineMap.extend("MonthlyClientProjectOsProject",{
    osProjectId: "123123sdfasdf",
    osProject: {type: makeOSProject }
});

MonthlyClientProjectsOsProject.List = DefineList.extend({
  "*": MonthlyClientProjectsOsProject,
  osProjectIdMap: {
    get: function(){
      var map = {};
      this.forEach(function(monthlyClientProjectOSProject, index){
        map[monthlyClientProjectOSProject.osProjectId] = index;
      });
      return map;
    }
  },
  has: function(monthlyOsProject){
    return monthlyOsProject.osProjectId in this.osProjectIdMap;
  },
  addRemoveProjects: function(monthlyOSProject){
    var index = this.osProjectIdMap[monthlyOSProject.osProjectId];

    if(index != undefined) {
      console.log(index);
      this.splice(index, 1);
    } else {
      this.push(monthlyOSProject);
    }
  }
});

var MonthlyClientProject = DefineMap.extend("MonthlyClientProject",{
  clientProjectId: "string",
  clientProject: {type: makeClientProject},
  hours: "number",
  monthlyClientProjectsOsProjects: MonthlyClientProjectsOsProject.List,
});

MonthlyClientProject.List = DefineList.extend({
  "*": MonthlyClientProject,
  monthlyProjectIdMap: {
    get: function() {
      var map = {};
      this.forEach(function(monthlyClientProject, index) {
        map[monthlyClientProject.clientProjectId] = index;
      });
      return map;
    }
  },
  has: function(clientProject) {
    return clientProject.clientProjectId in this.monthlyProjectIdMap;
  },
  addRemoveProjects: function(monthlyClientProject){
    var index =  this.monthlyProjectIdMap[monthlyClientProject.clientProjectId];
    if(index != null) {
      this.splice(index, 1);
    } else {
      this.push(monthlyClientProject);
    }
  }
});


var ContributionMonth = DefineMap.extend("ContributionMonth",{
  _id: "string",
  date: "date",
  monthlyOSProjects: MonthlyOSProject.List,
  monthlyClientProjects: MonthlyClientProject.List,
  calculations: {
    get: function() {
      var calculations = {};

      this.monthlyClientProjects.forEach((monthlyClientProject) => {
        calculations[monthlyClientProject.clientProjectId] = {
          significance: 0
        };
        monthlyClientProject.monthlyClientProjectsOsProjects.forEach((monthlyOSProject) => {
          calculations[monthlyClientProject.clientProjectId].significance =+ this.monthlyOSProjects.getSignificance(monthlyOSProject.osProjectId);

        });
      });

      return calculations;
    }
  },
  addNewMonthlyOSProject: function(newProject) {
    let monthlyOSProject = new MonthlyOSProject({
      significance: 0,
      commissioned: false,
      osProjectId: newProject._id,
      osProject: newProject
    });
    this.monthlyOSProjects.push(monthlyOSProject);
    this.save();
  }
});


ContributionMonth.connection = superMap({
  idProp: "_id",
  Map: ContributionMonth,
  List: ContributionMonth.List,
  url: "/api/contribution_months",
  name: "contributionMonth",
  algebra: contributionMonthAlgebra,
});
ContributionMonth.algebra = contributionMonthAlgebra;

export default ContributionMonth;
