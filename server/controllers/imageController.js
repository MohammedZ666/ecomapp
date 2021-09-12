const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const get_image = async (req, res) => {
    const db = mongoose.connection.db
    try {
        var photoID = new ObjectID(req.params.id)
    } catch (err) {
        return res.status(400).json({ message: "Invalid PhotoID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
    }

    let bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'photos'
    });


    let downloadStream = bucket.openDownloadStream(photoID);
    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('error', () => {
        res.sendStatus(404);

    });

    downloadStream.on('end', () => {
        res.end();
    });

}

module.exports = {
    get_image
}