import * as restify from 'restify'
const mongoose = require('mongoose')
import { environment } from '../common/environment'
import { Router } from '../common/router'

export class Server {

  application: restify.Server

  initializyDb() {    
    (<any>mongoose).Promise = global.Promise
    return mongoose.connect(
      'mongodb://douglasFranco:doda4763128402@clustermeat-shard-00-00-vxchz.gcp.mongodb.net:27017,clustermeat-shard-00-01-vxchz.gcp.mongodb.net:27017,clustermeat-shard-00-02-vxchz.gcp.mongodb.net:27017/meat-api?ssl=true&replicaSet=ClusterMeat-shard-0&authSource=admin&retryWrites=true&w=majority',
      {dbName: 'meat-api'}
    )
    
    
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {

        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        })

        this.application.use(restify.plugins.queryParser())

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