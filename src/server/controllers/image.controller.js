var mongoose = require('mongoose');
var formidable = require('formidable');
var fs = require('fs');
var shortId = require('shortid');
var path = require('path');

module.exports = {

    upload: function ( req, res ) {

        var form = new formidable.IncomingForm();

        var tempDir = __dirname + '../../../../dist/media/tmp/';
        var finalDir = __dirname + '../../../../dist/media/';

        form.uploadDir = tempDir;

        form.parse(req, function ( err, fields, files ) {
            if (err) {
                res.error(err);
            }
        });

        form.on('end', function ( fields, files ) {

            var file = this.openedFiles[0];

            //TODO: check to see that file is safe... and an image

            var extension = path.extname(file.name);

            var id = shortId.generate();

            var newPath = path.join(finalDir, id + extension);

            fs.rename(file.path, newPath, function ( err ) {
                if (err) {
                    //TODO: we may want to try and delete the file at this point...
                    res.error(err);
                } else {
                    res.success({
                        id: id,
                        path: newPath
                    });
                }
            });
        });
    }

};