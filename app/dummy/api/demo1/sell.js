exports.bind = (name, server, db) => {
    server.get(name + '/:token/:name', function(req, res) {
        // stdout info
        console.log("-- [" + req.method + "] " + req.url);
        console.log("-- Custome service.");
        // 1. Retrieve url params.
        console.log(req.params);
        console.log(req.params.token);
        console.log(req.params.name);
        // 2. Do action at params exist.
        // 3 Returen action result
        res.send(db.get('demo1').get('sell'));
    });
}
