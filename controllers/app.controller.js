const { fetchTopics, fetchArticlesById, fetchAllArticles } = require("../models/app.model")

exports.getTopics = (req, res, next) => {
    fetchTopics()
        .then((topics) => res.status(200).send({ topics }))
        .catch(next);
}

exports.getArticlesById = (req, res, next) => {
    const articleId = req.params;
    const articleIdValue = articleId.article_id;

    fetchArticlesById(articleIdValue)
        .then((article) => {
            res.status(200).send({ article: article })
        })
        .catch((err) => {
            next(err);
        })
}

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles()
        .then((articles) => {
            res.status(200).send(articles)
        })
        .catch(next)
}