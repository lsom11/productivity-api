/* eslint-disable no-unused-expressions */

const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const wrappedVerifyToken = mochaPlugin.getWrapper(
  'verify-token',
  '/handlers/verifyToken.js',
  'token'
);
const wrappedGetOne = mochaPlugin.getWrapper(
  'dailyQuestionsGetOne',
  '/handlers/dailyQuestions.js',
  'getOne'
);

const wrappedGetAll = mochaPlugin.getWrapper(
  'dailyQuestionsGetAll',
  '/handlers/dailyQuestions.js',
  'getAll'
);

const wrappedDelete = mochaPlugin.getWrapper(
  'dailyQuestionsDelete',
  '/handlers/dailyQuestions.js',
  'delete'
);
const wrappedUpdate = mochaPlugin.getWrapper(
  'dailyQuestionsUpdate',
  '/handlers/dailyQuestions.js',
  'update'
);

const wrappedCreate = mochaPlugin.getWrapper(
  'dailyQuestionsCreate',
  '/handlers/users.js',
  'create'
);

describe('Daily Questions API', () => {
  it('getAll should return an empty list by default', () =>
    wrappedGetAll.run({}).then(response => {
      expect(response).to.not.be.empty;
      expect(response.statusCode).to.equal(200);

      const list = JSON.parse(response.body);
      expect(list).to.be.an.instanceOf(Array);
      expect(list).to.deep.equal([]);
    }));

  it('getOne should return 404 if not found', () =>
    wrappedGetOne
      .run({ pathParameters: { id: '00000f1afa7663142200d252' } })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.equal('');
      }));

  it('updateUser should return 404 if not found', () =>
    wrappedUpdate
      .run({ pathParameters: { id: '00000f1afa7663142200d252' } })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.equal('');
      }));

  it('removeUser should return 404 if not found', () =>
    wrappedDelete
      .run({ pathParameters: { id: '00000f1afa7663142200d252' } })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.equal('');
      }));

  it('addUser should accept and store a new user', () => {
    const payload = {
      name: 'John',
      lastName: 'Smith',
      email: 'user@email.com',
    };
    return wrappedCreate
      .run({ body: JSON.stringify(payload) })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.body).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const result = JSON.parse(response.body);
        expect(result._id).to.have.length.gt(0);

        return wrappedGetOne.run({ pathParameters: { id: result._id } });
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const remoteUser = JSON.parse(response.body);
        expect(remoteUser).to.be.an.instanceOf(Object);
        expect(remoteUser._id).to.have.length.gt(0);
        expect(remoteUser.name).to.equal(payload.name);
        expect(remoteUser.lastName).to.equal(payload.lastName);
        expect(remoteUser.email).to.equal(payload.email);

        return wrappedGetAll.run({});
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const list = JSON.parse(response.body);
        expect(list).to.be.an.instanceOf(Array);
        expect(list).to.have.lengthOf(1);
      });
  });

  it('updateUser should update existing users', () => {
    const payload = {
      name: 'Jane',
      lastName: 'Smithee',
      email: 'user2@email.com',
    };
    let userId;
    return wrappedGetAll
      .run({})
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const list = JSON.parse(response.body);
        expect(list).to.be.an.instanceOf(Array);
        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.not.be.empty;
        expect(list[0]._id).to.not.be.empty;

        userId = list[0]._id;

        return wrappedUpdate.run({
          pathParameters: { id: userId },
          body: JSON.stringify(payload),
        });
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.body).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const result = JSON.parse(response.body);
        expect(result._id).to.have.length.gt(0);

        return wrappedGetOne.run({ pathParameters: { id: result._id } });
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const remoteUser = JSON.parse(response.body);
        expect(remoteUser).to.be.an.instanceOf(Object);
        expect(remoteUser._id).to.have.length.gt(0);
        expect(remoteUser.name).to.equal(payload.name);
        expect(remoteUser.lastName).to.equal(payload.lastName);
        expect(remoteUser.email).to.equal(payload.email);
      });
  });

  it('deleteQuestion should remove existing users', () => {
    let userId;
    return wrappedGetAll
      .run({})
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const list = JSON.parse(response.body);
        expect(list).to.be.an.instanceOf(Array);
        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.not.be.empty;
        expect(list[0]._id).to.not.be.empty;

        userId = list[0]._id;

        return wrappedDelete.run({ pathParameters: { id: userId } });
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.body).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const result = JSON.parse(response.body);
        expect(result._id).to.have.length.gt(0);

        return wrappedGetAll.run({});
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const list = JSON.parse(response.body);
        expect(list).to.be.an.instanceOf(Array);
        expect(list).to.deep.equal([]);
      });
  });
});
