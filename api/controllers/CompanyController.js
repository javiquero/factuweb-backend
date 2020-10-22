let companyController = {
	async getInfo(req, res) {
		let resp = await Db.findOne("SELECT * FROM F_EMP;");
		return res.json(resp);
	}
}

if (!sails.controllers) sails.controllers = {};
sails.controllers.company = companyController;
module.exports = companyController
