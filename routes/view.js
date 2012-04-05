module.exports = function(req, res) {
	res.render('view', { id: req.params.id, title: "Viewing ride "+req.params.id});
};
