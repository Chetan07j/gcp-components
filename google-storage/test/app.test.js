/**
 * Unit test for read-bucket-object.js functions.
 * It stubs storage methods and executes tests
 *
 * @author Chetan Patil
 * @version 1.0.0
 */
const { assert } = require('chai');
const { Storage } = require('@google-cloud/storage');
const sinon = require('sinon');
const { Readable } = require('stream');

const {
  readFile,
} = require('../');

describe('read-bucket-object tests:', () => {
  beforeEach(() => {
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should read file from bucket successfully', async () => {
    const bucketName = "my-bucket";
    const fileName = "my-file.json";
    const output = { name: 'Chetan', country: 'India' };

    const onStub = sinon.stub();
    const onDataStub = onStub.withArgs('data').yields(JSON.stringify(output)).returnsThis();
    const onEndStub = onStub.withArgs("end").yields();

    const stubs = {
      file: sinon.stub().returnsThis(),
      createReadStream: sinon.stub().returns({ on: onStub }),
    };

    const bucketStub = sinon.stub(Storage.prototype, 'bucket').callsFake(() => stubs);

    await readFile();

    sinon.assert.calledWith(bucketStub, bucketName);
    sinon.assert.calledWith(stubs.file, fileName);
    sinon.assert.calledOnce(stubs.createReadStream);
    sinon.assert.calledWith(onDataStub, "data", sinon.match.func);
    sinon.assert.calledWith(onEndStub, "end", sinon.match.func);
  });
});
