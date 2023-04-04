const { fetchTopics, fetchArticlesById, fetchAllArticles, fetchCommentsById, insertComments, insertVotes } = require("../models/app.model")

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
            res.status(200).send({ comments: comments })
        })
        .catch(next)
}

exports.addComments = (req, res, next) => {
    insertComments(req.body, req.params)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch(next)
}

exports.updateVotes = (req, res, next) => {
    const articleId = req.params.article_id
    const voteIncrease = req.body.inc_votes
    fetchArticlesById(articleId).then((result) => {
        if (result) {
            return insertVotes(result, voteIncrease)
        }
    }).then((result) => {
        res.status(200).send({ article: result })
    }).catch((err) => {
        next(err)
    })

}