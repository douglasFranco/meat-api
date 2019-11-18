"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restify_1 = __importDefault(require("restify"));
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("../common/environment");
const merge_patch_parser_1 = require("./merge-patch.parser");
class Server {
    initializyDb() {
        mongoose_1.default.Promise = global.Promise;
        return mongoose_1.default.connect(environment_1.environment.db.url, { useMongoClient: true });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify_1.default.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                this.application.use(restify_1.default.plugins.queryParser());
                this.application.use(restify_1.default.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
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
