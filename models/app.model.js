const res = require('express/lib/response.js');
const db = require('../db/connection.js');
const articles = require("../db/data/test-data/articles");


exports.fetchTopics = (topic) => {
    let selectTopicQueryStr = `SELECT * FROM topics`;
    const queryParams = [];

    if (topic) {
        selectTopicQueryStr += ` WHERE slug = $1`;
        queryParams.push(topic);
    }

    return db.query(selectTopicQueryStr, queryParams).then((result) => {
        if (result.rows.length > 0) {
            const topics = result.rows;
            return topics;
        } else {
            return Promise.reject({ status: 404, msg: "Invalid request" });
        }
    });
};

exports.fetchArticlesById = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
        .then((result) => {
            if (!result.rows.length) {
                return Promise.reject({ status: 404, msg: "Article not found" })
            }
            return result.rows[0]
        })
}

exports.fetchArticles = (sort_by, order, topic) => {
    if (
        sort_by &&
        sort_by !== "article_id" &&
        sort_by !== "title" &&
        sort_by !== "author" &&
        sort_by !== "comment_count" &&
        sort_by !== "topic" &&
        sort_by !== "created_at" &&
        sort_by !== "article_img_url" &&
        sort_by !== "votes" &&
        sort_by !== "body"
    ) {
        return Promise.reject({ status: 400, msg: "Invalid Sort Query" });
    }
    if (
        order &&
        order !== "desc" &&
        order !== "asc" &&
        order !== "DESC" &&
        order !== "ASC"
    ) {
        return Promise.reject({ status: 400, msg: "Invalid Order Query" });
    }

    const queryParams = [];
    let articlesQueryStr = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id)AS INT) AS comment_count
  FROM comments
  RIGHT JOIN articles
  ON articles.article_id = comments.article_id`;

    if (topic) {
        articlesQueryStr += ` WHERE topic = '${topic}'`;
    }

    articlesQueryStr += ` GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url`;

    if (sort_by) {
        articlesQueryStr += ` ORDER BY ${sort_by} ${order || "DESC"}`;
    } else {
        articlesQueryStr += ` ORDER BY created_at ${order || "DESC"}`;
    }
    return db.query(articlesQueryStr, queryParams).then((result) => {
        return result.rows;
    });
};

exports.fetchCommentsById = (articleId) => {
    const articlesQuery = `SELECT * FROM articles WHERE article_id = $1`;
    const commentsQuery = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`

    return Promise.all([
        db.query(articlesQuery, [articleId]),
        db.query(commentsQuery, [articleId])
    ]).then(([articleResult, commentsResult]) => {
        if (articleResult.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article ID not found" })
        }
        return commentsResult.rows;
    })
}

exports.insertComments = (newComment, articleId) => {
    const psqlQueryArticle = `SELECT * FROM articles WHERE article_id = $1`;
    const postCommentQuery = `INSERT INTO comments
            (article_id, author, body)
            VALUES($1, $2, $3)
            RETURNING *;`

    const id = articleId.article_id
    const { username, body } = newComment;

    return db
        .query(psqlQueryArticle, [id])
        .then((articleResult) => {
            if (articleResult.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article ID not found" })
            }

            return db.query(postCommentQuery, [id, username, body]).then((commentResult) => {
                return commentResult.rows[0]
            })
        })
}

exports.insertVotes = (article, voteIncrease) => {
    const articleVotes = article.votes += voteIncrease
    const articleId = article.article_id
    const info = [articleId, articleVotes]
    return db.query(
        `UPDATE articles
        SET votes = $2
        WHERE article_id = $1
        RETURNING *;`, info
    ).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article ID not found" })
        } else {
            return result.rows[0]
        }
    })
}

exports.fetchCommentsByCommentId = (commentId) => {
    return db.query(
        `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;`, [commentId]
    ).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Comment not found" })
        }
        return result.rows[0]
    })
}

exports.fetchAllUsers = () => {
    let selectQueryStr =
        `SELECT * FROM users`

    return db
        .query(selectQueryStr)
        .then((result) => {
            return result.rows;
        })
}

