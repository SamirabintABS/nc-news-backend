const { fetchTopics, fetchArticlesById, fetchArticles, fetchCommentsById, insertComments, insertVotes, fetchCommentsByCommentId, fetchAllUsers } = require("../models/app.model")

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

exports.getArticles = (req, res, next) => {
    const { sort_by, order, topic } = req.query;

    fetchTopics(topic)
        .then((result) => {
            if (result.length === 0) {
                return Promise.reject({ status: 404, msg: "Invalid topic" });
            }
            return fetchArticles(sort_by, order, topic);
        })
        .then((articles, result) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

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
    const { inc_votes } = req.body;

    if (isNaN(inc_votes)) {
        return next({ status: 400, msg: 'Votes are numbers only!' });
    }
    fetchArticlesById(articleId).then((result) => {
        if (result) {
            return insertVotes(result, inc_votes)
        }

    }).then((result) => {
        res.status(200).send({ article: result })
    }).catch((err) => {
        next(err)
    })
}

exports.deleteComments = (req, res, next) => {
    const { comment_id } = req.params;
    fetchCommentsByCommentId(comment_id)
        .then((result) => {
            res.status(204).send({ comments: result })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
        .then((users) => {
            res.status(200).send({ users })
        })
        .catch(next)
}