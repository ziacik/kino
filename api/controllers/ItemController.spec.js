// require('should');
// require('should-sinon');
// const sinon = require('sinon');
// const controller = require('./ItemController');
//
// describe('ItemController', () => {
// 	let items;
// 	let res;
//
// 	function queryReq(query) {
// 		let req = {
// 			params: {}
// 		};
//
// 		if (query !== undefined) {
// 			req.params.query = query;
// 		}
//
// 		return req;
// 	}
//
// 	beforeEach(() => {
// 		items = [{
// 			some: 'item'
// 		}];
//
// 		res = {
// 			badRequest: sinon.spy(),
// 			json: sinon.spy()
// 		};
//
// 		global.DiscoveryService = {
// 			discover: sinon.stub().returns(Promise.resolve(items))
// 		};
// 	});
//
// 	describe('#discover', () => {
// 		it('returns bad request when query not provided', () => {
// 			controller.discover(queryReq(), res);
// 			DiscoveryService.discover.should.not.be.called();
// 			res.badRequest.should.be.called();
// 		});
//
// 		it('returns bad request for empty query', () => {
// 			controller.discover(queryReq(''), res);
// 			DiscoveryService.discover.should.not.be.called();
// 			res.badRequest.should.be.called();
// 		});
//
// 		it('calls a DiscoveryService and sends the results', () => {
// 			return controller.discover(queryReq('some query'), res).then(() => {
// 				DiscoveryService.discover.should.be.calledWith('some query');
// 				res.json.should.be.calledWith(items);
// 			});
// 		});
// 	});
// });
