import fixture from "can-fixture";
import ContributionMonth from 'bitcentive/models/contribution-month';
import OSProject from 'bitcentive/models/os-project';
import ClientProject from 'bitcentive/models/client-project';

var osProject = new OSProject({
    _id: "somethingCrazey",
    name: "CanJS"
});

var clientProject = new ClientProject({
    _id: "asl;dfal;sfj ;lakwj",
    name: "HualHound"
});

var monthlyContributionStore = fixture.store([{
    _id: "aslkfalsjklas",
    date: 124234211310000,
    monthlyOSProjects: [{
        significance: 80,
        commissioned: true,
        osProjectId: osProject._id,
        osProject: osProject
    }],
    monthlyClientProjects: [{
        monthlyClientProjectsOsProjects: [{
            osProjectId: osProject._id,
            osProject: osProject
        }],
        hours: 100,
        clientProjectId: clientProject._id,
        clientProject: clientProject
    }]
}], ContributionMonth.algebra);

fixture({
    'GET /api/contriubtion_months': monthlyContributionStore.getListData,
    'GET /api/contriubtion_months{_id}': monthlyContributionStore.getData,
    'POST /api/contriubtion_months': monthlyContributionStore.createData,
    'PUT /api/contriubtion_months/{_id}': monthlyContributionStore.updateData,
    'DELETE /api/contriubtion_months/{_id}': monthlyContributionStore.destroyData
});

window.fixture = fixture;
