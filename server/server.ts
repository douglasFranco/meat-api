import restify from 'restify'
import mongoose from 'mongoose'
import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch.parser';

export class Server {

  application: restify.Server

  initializyDb() {    
    (<any>mongoose).Promise = global.Promise
    return mongoose.connect(environment.db.url, { useMongoClient: true})
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {

        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        })

        this.application.use(restify.plugins.queryParser())
        this.application.use(restify.plugins.bodyParser())
        this.application.use(mergePatchBodyParser)

        this.application.listen(environment.server.port, () => {
          resolve(this.application)
        })

        for (let router of routers) {
          router.applyRoutes(this.application)
        }

      } catch (error) {
        reject(error)
      }
    })
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializyDb().then(() => this.initRoutes(routers).then(() => this))
  }
}