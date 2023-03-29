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