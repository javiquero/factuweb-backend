module.exports.models = {
    "migrate": "drop",
    "archiveModelIdentity": false,
    "attributes": {
        "createdAt": {
            "type": "number",
            "autoCreatedAt": true,
            "autoMigrations": {
                "unique": false,
                "autoIncrement": false,
                "columnType": "_numbertimestamp"
            }
        },
        "updatedAt": {
            "type": "number",
            "autoUpdatedAt": true,
            "autoMigrations": {
                "unique": false,
                "autoIncrement": false,
                "columnType": "_numbertimestamp"
            }
        },
        "id": {
            "type": "number",
            "autoMigrations": {
                "autoIncrement": true,
                "unique": true,
                "columnType": "_numberkey"
            }
        }
    },
    "dataEncryptionKeys": {
        "default": "Xg+vSjYEut7uhPkeYXz1SVEQO9Tj6g3jNv0jddlt8bo="
    },
    "cascadeOnDestroy": true,
    "datastore": "default",
    "primaryKey": "id"
}
