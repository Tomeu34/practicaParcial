const mongoose = require("mongoose")

const StorageSchema = new mongoose.Schema(
    {
        url: String,
        filename:{
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("storages", StorageSchema);