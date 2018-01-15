const {
	Datastore
} = require('nedb-models');

/**
	A datastore with insert / update methods extended to also return model instances.
	Could be possibly removed after resolving https://github.com/bajankristof/nedb-models/issues/1
	Except for the "returnUpdatedDocs" part.
*/
class ExtendedDatastore extends Datastore {
	insert(doc) {
		if (!this.__model) {
			return super.insert(doc);
		}

		return super.insert(doc).then(inserted => {
			if (!inserted) {
				return inserted;
			}

			return new this.__model(inserted);
		});
	}

	update(query, update, options) {
		options.returnUpdatedDocs = true;

		if (!this.__model) {
			return super.update(query, update, options);
		}

		return super.update(query, update, options).then(result => {
			const affectedDocuments = result[1];

			if (!affectedDocuments) {
				return options.multi ? [] : affectedDocuments;
			}

			if (options.multi) {
				return affectedDocuments.map(it => new this.__model(it));
			} else {
				return new this.__model(affectedDocuments);
			}
		});
	}
}

module.exports = ExtendedDatastore;
