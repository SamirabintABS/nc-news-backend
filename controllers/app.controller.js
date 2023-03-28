const { fetchTopics, fetchArticles } = require("../models/app.model")

exports.getTopics = (req, res, next) => {
    fetchTopics()
        .then((topics) => res.status(200).send({ topics }))
        .catch(next);
}

exports.getArticlesById = (req, res, next) => {
    const articleId = req.params;
    const articleIdValue = articleId.article_id;

    fetchArticles(articleIdValue)
        .then((article) => {
            res.status(200).send({ article: article })
        })
        .catch((err) => {
            next(err);
        })
}

exports.get