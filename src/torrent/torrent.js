class Torrent {
	constructor(data) {
		Object.assign(this, data);
	}

	toString() {
		return this.name;
	}
}

module.exports = Torrent;
