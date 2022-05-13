const owner = async (req, res, next) => {
    try {
        next()
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e)
    }
}

module.exports = owner
