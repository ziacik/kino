// require('should');
// require('should-sinon');
// const sinon = require('sinon');
// const proxyquire = require('proxyquire').noCallThru();
//
// describe('DiscoveryService', () => {
// 	let getSeriesByName;
// 	let service;
//
// 	function getSeriesByNameData() {
// 		return {
// 			'aliases': [],
// 			'banner': 'graphical/79349-g28.jpg',
// 			'firstAired': '2006-10-01',
// 			'id': 79349,
// 			'network': 'Showtime',
// 			'overview': 'Dexter je díky jisté události v jeho dětství psychicky narušen a touží po zabíjení. Jeho touhu po krvi se dařilo usměrňovat jeho adoptivnímu otci, který pracoval jako policista. Dexter se naučil ovládat a stal se soudním znalcem a stejně jako on, pracuje u policie i jeho nevlastní sestra. Dexter má stále své choutky a po smrti otce je pro něj všechno složitější. Přestože nechová k nikomu žádné city, své oběti si pečlivě vybírá z řad kriminálníků a sociopatů, kterým se podařilo zákon obelstít. Na scéně se zanedlouho objevuje precizní seriový vrah, který nepřímo vyzívá Dextra na psychologický souboj kočky s myší. Kdo je kočka a kdo myš ...',
// 			'seriesName': 'Dexter',
// 			'status': 'Ended'
// 		};
// 	}
//
// 	beforeEach(() => {
// 		getSeriesByName = sinon.stub().returns(Promise.resolve([getSeriesByNameData()]));
//
// 		let TvdbApi = sinon.stub();
// 		TvdbApi.prototype.getSeriesByName = getSeriesByName;
//
// 		proxyquire('./DiscoveryService.js', {
// 			'node-tvdb': TvdbApi
// 		});
//
// 		service = require('./DiscoveryService');
// 	});
//
// 	describe('#discover', () => {
// 		it('searches tvdb for shows', () => {
// 			debugger;
// 			return service.discover('some query').then(result => {
// 				getSeriesByName.should.be.calledWith('some query');
// 				result.should.equal([{
// 					type: 'show',
// 					name: 'name',
// 					overview: 'overview',
// 					banner: 'banner'
// 				}]);
// 			});
// 		});
// 	});
// });
