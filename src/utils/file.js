import fs from "fs";

export default {
	fileExists(path) {
		return fs.existsSync(path);
	},
	readFromFile(path, encoding = "utf8") {
		return fs.readFileSync(path, encoding);
	},
	writeToFile(path, content) {
		fs.writeFileSync(path, content);
	},
	removeFile(path) {
		fs.unlinkSync(path);
	},
	getFilesInDirectory(path) {
		return fs.readdirSync(path);
	},
};
