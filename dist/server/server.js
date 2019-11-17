"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const restify = __importStar(require("restify"));
const mongoose = require('mongoose');
const environment_1 = require("../common/environment");
class Server {
    initializyDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect('mongodb://douglasFranco:doda4763128402@clustermeat-shard-00-00-vxchz.gcp.mongodb.net:27017,clustermeat-shard-00-01-vxchz.gcp.mongodb.net:27017,clustermeat-shard-00-02-vxchz.gcp.mongodb.net:27017/meat-api?ssl=true&replicaSet=ClusterMeat-shard-0&authSource=admin&retryWrites=true&w=majority', { dbName: 'meat-api' });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializyDb().then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.Server = Server;
