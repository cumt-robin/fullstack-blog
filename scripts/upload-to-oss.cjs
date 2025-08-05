/* eslint-disable no-console */
require("dotenv").config({ path: [".ossenv"] });
const path = require("path");
const fse = require("fs-extra");
const { ossClient } = require("./oss-client.cjs");

async function getAllFiles(dirPath, relativePath = "", arrayOfFiles = []) {
    const files = await fse.readdir(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fse.stat(filePath);

        if (stats.isDirectory()) {
            const newRelativePath = path.join(relativePath, file);
            arrayOfFiles = await getAllFiles(filePath, newRelativePath, arrayOfFiles);
        } else {
            const relativeFilePath = path.join(relativePath, file);
            arrayOfFiles.push(relativeFilePath);
        }
    }

    return arrayOfFiles;
}

// 上传 dist 目录中的所有文件
async function uploadDistFiles(distDir) {
    try {
        const files = await getAllFiles(distDir);
        const otherFiles = files.filter((file) => file !== "index.html");
        await Promise.all(
            otherFiles.map((file) => {
                const filePath = file.replace(/\\/g, "/");
                return ossClient.put(filePath, path.join(distDir, file));
            }),
        );
        console.log("Other files uploaded successfully!");
        await ossClient.put("index.html", path.join(distDir, "index.html"), {
            headers: { "Cache-Control": "private, no-store, no-cache, must-revalidate, proxy-revalidate" },
        });
        console.log("All files uploaded successfully!");
    } catch (err) {
        console.error("Error uploading files:", err);
    }
}

uploadDistFiles(path.join(__dirname, "../app/vite-vue3/dist"));
