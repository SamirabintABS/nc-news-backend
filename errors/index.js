
exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid ID' });
    } else next(err)
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