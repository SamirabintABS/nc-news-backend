const { fetchTopics } = require("../models/app.model")

exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({ topics })
    })
}