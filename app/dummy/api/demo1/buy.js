exports.bind = (name, server, db) => {
    server.get(name, function(req, res) {
        // stdout info
        console.log("-- [" + req.method + "] " + req.url);
        console.log("-- Custome service.");
        // 1. Retrieve url params.
        console.log(req.query);
        // 2. Do action at params exist.
        // 3 Returen action result
        res.jsonp(db.get('demo1').get('buy'));
    });
}
