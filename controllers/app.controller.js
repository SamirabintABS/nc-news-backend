const { fetchTopics, fetchArticlesById, fetchAllArticles, fetchCommentsById } = require("../models/app.model")

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

exports.getCommentsById = (req, res, next) => {
    const articleId = req.params;
    const articleIdValue = articleId.article_id;
    fetchCommentsById(articleIdValue)
        .then((comments) => {
            res.status(200).send(comments)
        })
        .catch(next)
}