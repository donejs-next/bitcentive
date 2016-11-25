import set from "can-set";
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';

import feathersClient from './feathers';
import superModel from '../lib/super-model';
import { _idAlgebra as userAlgebra } from './algebras';

var User = DefineMap.extend("User", {
  _id: "string",
  email: {
    type: "string"
  },
  password: {
    type: "string"
  }
});

User.List = DefineList.extend({"*": User});

User.connection = superModel({
  Map: User,
  List: User.List,
  feathersService: feathersClient.service("/api/users"),
  name: "users",
  algebra: userAlgebra
});

User.algebra = userAlgebra;

export { userAlgebra as algebra };

export default User;
