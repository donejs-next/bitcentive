import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';

export const OsProject = DefineMap.extend({
  seal: false
}, {
  '_id': '*'
});

OsProject.List = DefineList.extend({
  '*': OsProject
});

export const os-projectConnection = superMap({
  url: '/api/os_projects',
  idProp: '_id',
  Map: OsProject,
  List: OsProject.List,
  name: 'os-project'
});

tag('os-project-model', os-projectConnection);

export default OsProject;
