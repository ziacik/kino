/**
 * ItemController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	discover: function(req, res) {
		if (!req.params.query) {
			return res.badRequest();
		}

		return DiscoveryService.discover(req.params.query).then(items => res.json(items));
	}

};
