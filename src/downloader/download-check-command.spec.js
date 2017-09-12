const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const DownloadCheckCommand = require('./download-check-command');

describe('DownloadCheckCommand', () => {
	let command;
	let item;
	let downloadService;
	let downloadCheckCommandFactory;
	let nextDownloadCheckCommand;

	beforeEach(() => {
		downloadService = {
			getState: sinon.stub().resolves('some state')
		};
		nextDownloadCheckCommand = {};
		downloadCheckCommandFactory = {
			create: sinon.stub().returns(nextDownloadCheckCommand)
		};
		command = new DownloadCheckCommand(item, 'torrent-id', downloadService, downloadCheckCommandFactory);
	});

	describe('#execute', () => {
		it('checks state of the torrent with download service', () => {
			return command.execute().then(() => {
				expect(downloadService.getState).to.have.been.calledWith('torrent-id');
			});
		});

		it('returns another download check command if the state is "downloading"', () => {
			downloadService.getState.resolves('downloading');
			return command.execute().then(nextCommand => {
				expect(nextCommand).to.equal(nextDownloadCheckCommand);
				expect(downloadCheckCommandFactory.create).to.have.been.calledWith(item, 'torrent-id');
			});
		});
	});
});
