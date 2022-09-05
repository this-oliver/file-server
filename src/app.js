import express from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Storage from "./utils/storage.js";

// get dirname of the current file
const __dirname = dirname(fileURLToPath(import.meta.url));
// get path to assets folder in root of project
const assetsPath = path.join(__dirname, "../assets/");

// for handling file uploads
const upload = multer();

function setupRouter() {
	const router = express.Router();

	function handleErrors(error, res) {
		return res
			.status(error.status || 500)
			.send(error.message || error || "Internal server error");
	}

	router.get("/", function (req, res) {
		return res.status(200).send("Welcome to Oliver's storage!");
	});

	// serve static assets
	router.use("/assets", express.static(assetsPath));

	// post a file to the server
	router.post("/assets", upload.array("files"), function (req, res) {
		try {
			// throw error if no files were uploaded
			if (!req.files || !req.files.length) {
				throw new Error("No files were uploaded");
			}

			// save files
			const assets = Storage.saveMultipleFiles(
				req.files,
				req.body.namespace
			).map((asset) => {
				// get server url
				const serverUrl = req.protocol + "://" + req.get("host");
				// define asset url
				const url = `${serverUrl}/assets/${asset.name}`;
				// append asset name to server url
				asset.setUrl(url);
				// remove content field from asset
				delete asset.content;
				// remove path field from asset
				delete asset.path;

				return asset;
			});

			return res.status(201).send(assets);
		} catch (error) {
			return handleErrors(error, res);
		}
	});

	// delete a file from the server
	router.delete("/assets/:name", function (req, res) {
		try {
			const deleted = Storage.removeFile(req.params.name);
			return res.status(203).send(deleted);
		} catch (error) {
			return handleErrors(error, res);
		}
	});

	router.post("/tags/:name", upload.array("files"), function (req, res) {
		try {
			const files = Storage.saveMultipleFiles(req.files, req.params.name);
			return res.status(201).send(files);
		} catch (error) {
			return handleErrors(error, res);
		}
	});

	// get all files with a specific tag from the server
	router.get("/tags/:name", function (req, res) {
		try {
			const asset = Storage.getFilesByTag(req.params.name);
			return res.status(200).send(asset);
		} catch (error) {
			return handleErrors(error, res);
		}
	});

	// delete all files with a specific tag from the server
	router.delete("/tags/:name", function (req, res) {
		try {
			const deleted = Storage.removeFilesByTag(req.params.name);
			return res.status(203).send(deleted);
		} catch (error) {
			return handleErrors(error, res);
		}
	});

	router.get("/meta", function (req, res) {
		try {
			const fileNames = Storage.getStorageMeta();
			const count = fileNames.length;
			return res.status(200).send({ count, fileNames });
		} catch (error) {
			return handleErrors(error, res);
		}
	});

	return router;
}

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(setupRouter());

export default app;
