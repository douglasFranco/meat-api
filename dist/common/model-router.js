"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const mongoose_1 = __importDefault(require("mongoose"));
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.validateId = (req, resp, next) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError('Document not found'));
            }
            else {
                next();
            }
        };
        this.findAll = (req, resp, next) => {
            this.model.find().then(this.renderAll(resp, next)).catch(next);
        };
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id).then(this.render(resp, next)).catch(next);
        };
        this.save = (req, resp, next) => {
            let document = new this.model(req.body);
            document.save().then(this.render(resp, next)).catch(next);
        };
        this.replace = (req, resp, next) => {
            const options = { overwrite: true };
            this.model.update({ _id: req.params.id }, req.body, options).exec().then(result => {
                if (result.n) {
                    return this.model.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Document not found');
                }
            }).then(this.render(resp, next)).catch(next);
        };
        this.update = (req, resp, next) => {
            const options = { new: true };
            this.model.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next)).catch(next);
        };
        this.delete = (req, resp, next) => {
            this.model.remove({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Document not found');
                }
                return next();
            }).catch(next);
        };
    }
}
exports.ModelRouter = ModelRouter;
