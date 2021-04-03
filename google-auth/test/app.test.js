/**
 * Unit test for get-auth-token.js
 *
 * @author CHPAT6
 * @version 1.0.0
 */
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const chai = require('chai');

const { assert, expect } = chai;
chai.use(require('chai-as-promised'));

const { getAuthToken } = require('../');

describe('get-auth-token function tests:', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return token response for successful getAuthToken', async () => {
    const code = proxyquire('../', {
      googleapis: {
        google: {
          auth: {
            GoogleAuth: sinon.stub().callsFake(() => ({
              getClient: sinon.stub().returns({ email: 'test@example.com', key: 'sdfsfs' }),
            })),
            JWT: sinon.stub().callsFake(() => ({
              authorize: sinon.stub().returns({ id_token: 'token-id' }),
            })),
          },
        },
      },
    });

    const result = await code.getAuthToken();
    assert.deepEqual(result, 'token-id');
  });

  it('should throw error if unable to get token', async () => {
    const code = proxyquire('../', {
      googleapis: {
        google: {
          auth: {
            GoogleAuth: sinon.stub().callsFake(() => ({
              getClient: sinon.stub().returns({ email: 'test@example.com', key: 'sdfsfs' }),
            })),
            JWT: sinon.stub().throws('dummy error'),
          },
        },
      },
    });

    await expect(code.getAuthToken()).to.be.rejectedWith('Error occured in fetching jwt auth token: dummy error');
  });
});
