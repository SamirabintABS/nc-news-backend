
exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid ID' });
    } else if (err.code === '23503') {
        res.status(404).send({ msg: 'Username invalid' });
    } else if (err.code === '23502') {
        res.status(400).send({ msg: 'Comments requires a body and author' });
    } else {
        next(err)
    }
}
exports.handleCustomErrors = (err, req, rest, next) => {
    const { status, msg } = err;
    if (status && msg) {
        rest.status(status).send({ msg })
    } else next(err)
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};
