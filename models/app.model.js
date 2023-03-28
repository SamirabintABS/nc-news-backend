const db = require('../db/connection.js');

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
        .then((result) => {
            return result.rows;
        })
}

exports.fetchArticles = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
        .then((result) => {
            if (!result.rows.length) {
                return Promise.reject({ status: 404, msg: "Article not found" })
            }
            return result.rows[0]
        })
}