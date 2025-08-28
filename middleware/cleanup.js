const fs = require("fs");
const path = require("path");

function cleanup() {
    const tempFolder = path.join(__dirname, "../public/static"); // adjust relative path

    function clean() {
        fs.readdir(tempFolder, (err, files) => {
            if (err) return console.error("Failed to read temp folder:", err);

            files.forEach(file => {
                if (file.includes("_temp")) {
                    const filePath = path.join(tempFolder, file);
                    fs.stat(filePath, (err, stats) => {
                        if (err) return console.error("Failed to get file stats:", err);

                        const now = Date.now();
                        const mtime = new Date(stats.mtime).getTime();
                        if (now - mtime > 2 * 60 * 1000) {
                            fs.unlink(filePath, err => {
                                if (err) console.error("Failed to delete temp file:", err);
                                else console.log("Deleted old temp file:", file);
                            });
                        }
                    });
                }
            });
        });
    }

    // Run every minute
    setInterval(clean, 60 * 1000);
}

module.exports = cleanup;
