const fs = require("fs");
const path = require("path");
const db = require("./api/db");

const walkSync = dir =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...walkSync(name)] : [...files, name];
  }, []);

const main = async dir => {
  await db.connect(
    `mongodb://${process.env.DBHOST || "127.0.0.1"}`,
    process.env.DBNAME || "patents"
  );

  const files = walkSync(dir);

  for (const file of files) {
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    const doc_id = basename.split("-")[0].trim();

    if (ext === ".txt") {
      await db.patents.updateOne(
        { doc_id: doc_id },
        {
          $set: {
            doc_id: doc_id,
            title: basename,
            text: fs.readFileSync(file, { encoding: "UTF-16LE" })
          }
        },
        { upsert: true }
      );
    }
    if (ext === ".png") {
      await db.patents.updateOne(
        { doc_id: doc_id },
        {
          $set: {
            doc_id: doc_id
          },
          $addToSet: {
            images: basename + ext
          }
        },
        { upsert: true }
      );
    }
  }
};

main("./Sample Data")
  .then(() => {
    console.log("Done..");
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
