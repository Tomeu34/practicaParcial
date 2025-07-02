const models = {
    usersModel: require('./nosql/users'),
    clientsModel: require('./nosql/client'),
    projectsModel: require('./nosql/projects'),
    deliveryNoteModel: require('./nosql/deliveryNote'),
}

module.exports = models