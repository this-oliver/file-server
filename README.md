# Basic Static Server

A basic server to host your static assets (a.k.a files, pictures, pdfs)

## Installation

```bash
# clone repo
git clone https://github.com/this-oliver/file-server

# install dependencies
npm install

# create an 'assets' folder for storing files (ignored by git)
mkdir assets
```

## Usage

```bash
# start server (localhost:4000 by default)
npm start

# alternatively, you can specify a port
PORT=3000 npm start
```

## How it works

The app is built on top of `express` and accepts a handful of requests. Moreover, the server has an `/assets` directory in the root of the project where all files that are uploaded and requested reside.

## How to use

| Resource | Method | Path             | Body     | Response  | Status |
| -------- | ------ | ---------------- | -------- | --------- | ------ |
| Asset    | POST   | `/assets`        | `File[]` | `URL[]`   | 201    |
| Asset    | GET    | `/assets/:id`    | N/A      | `File`    | 200    |
| Asset    | DELETE | `/assets/:id`    | N/A      | `Boolean` | 203    |
| Tag      | POST   | `/tags/:tag/:id` | `File[]` | `URL[]`   | 201    |
| Tag      | GET    | `/tags/:tag`     | N/A      | `URL[]`   | 200    |
| Tag      | DELETE | `/tags/:tag`     | N/A      | `Boolean` | 203    |
| Metadata | GET    | `/meta`          | N/A      | `Object`  | 200    |
