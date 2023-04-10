const res = require('express/lib/response.js');
const db = require('../db/connection.js');

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
        .then((result) => {
            return result.rows;
        })
}

exports.fetchArticlesById = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
        .then((result) => {
            if (!result.rows.length) {
                return Promise.reject({ status: 404, msg: "Article not found" })
            }
            return result.rows[0]
        })
}

exports.fetchAllArticles = () => {

    let selectQueryStr =
        `SELECT articles.title,
        articles.author,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url, 
        COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id `

    const sortBy = 'ORDER BY articles.created_at DESC'

    if (sortBy) {
        selectQueryStr += `${sortBy}`
    }
    return db
        .query(selectQueryStr)
        .then((result) => {
            return result.rows;
        })
}

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

