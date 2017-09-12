const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const DownloadCheckCommand = require('./download-check-command');

describe('DownloadCheckCommand', () => {
	let command;
	let item;
	let itemState;
	let downloadService;

	beforeEach(() => {
		itemState = {
			item: 'item-id',
			torrentId: 'torrent-id'
		};
		downloadService = {
			getState: sinon.stub().resolves('some state')
		};
		command = new DownloadCheckCommand(downloadService);
	});

	describe('#create', () => {
		it('creates a new command with the same data', () => {
			let another = command.create(item, itemState);
			expect(another).not.to.equal(command);
			expect(another.downloadService).to.equal(downloadService);
			expect(another.item).to.equal(item);
			expect(another.itemState).to.equal(itemState);
			expect(another.delay).to.equal(10000);
		});
	});

	describe('#execute', () => {
		it('checks state of the torrent with download service and returns it', () => {
			command.item = item;
			command.itemState = itemState;
			return command.execute().then(result => {
				expect(downloadService.getState).to.have.been.calledWith(itemState);
				expect(result).to.equal('some state');
			});
		});
	});
});
