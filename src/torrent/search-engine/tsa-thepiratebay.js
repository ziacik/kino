const ThePirateBay = require('torrent-search-api/lib/providers/thepiratebay');

class ThePirateBayExtended extends ThePirateBay {
	_getScrapeDatas() {
		const datas = super._getScrapeDatas();
		datas.itemSelectors[0].subcategory = 'td:nth-child(1)@text | match:"\\((.+?)\\)"';
		return datas;
	}
}

module.exports = ThePirateBayExtended;
