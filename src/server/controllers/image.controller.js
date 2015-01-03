var mongoose = require('mongoose');
var formidable = require('formidable');
var fs = require('fs');
var shortId = require('shortid');
var path = require('path');
var sizeOf = require('image-size');

module.exports = {

    upload: function ( req, res ) {

        var form = new formidable.IncomingForm();

        // TODO: define the paths in a cleaner way
        var tempDir = __dirname + '../../../../dist/media/tmp/';
        var finalDir = __dirname + '../../../../dist/media/';

        form.uploadDir = tempDir;

        form.parse(req, function ( err, fields, files ) {
            if (err) {
                res.error(err);
            }
        });

        form.on('end', function ( fields, files ) {

            console.log(this.openedFiles);

            var file = this.openedFiles[0];

            if (file.size === 0) {
                // something is wrong or they didn't upload a file...
                fs.unlink(file.path);
                res.error("No File Found");
                return;
            }

            //TODO: check to see that file is safe... and an image

            var extension = path.extname(file.name);

            var id = shortId.generate();

            //TODO: we might want to insert images into a random sub folder
            var newPath = path.join(finalDir, id + extension);

            fs.rename(file.path, newPath, function ( err ) {
                if (err) {
                    fs.unlink(file.path);
                    res.error(err);
                    return;
                }

                sizeOf(newPath, function ( err, size ) {
                    res.success({
                        id: id,
                        width: size.width,
                        height: size.height,
                        ext: extension
                    });
                });
            });
        });
    }

};