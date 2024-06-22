import  redis from'redis';
import util from'util';
import dotenv from"dotenv";
dotenv.config();

class RedisService {
  constructor() {
     
    const { REDIS_HOST,REDIS_PORT,REDIS_PASSWORD } = process.env;
    
    this.client = redis.createClient({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password:"",
    });
    // this.client.connect();
    this.client.connect()
    this.connected = false;

    this.client.on('connect', () => {
      this.connected = true;
    });

    this.client.on('end', () => {
      this.connected = false;
    });

    this.setAsync = util.promisify(this.client.set).bind(this.client);
    // this.hsetAsync = util.promisify(this.client.hset).bind(this.client);
  }

  checkConnection(callback) {
    if (!this.connected) {
      const error = new Error('Redis client is closed');
      return callback(error);
    } else {
      console.log('Connected');
      // return callback(null);
    }
  }

    async getValue(key) {
      try { 
        const result = await this.client.get(key);
        if(!result) return false;
        // console.log('typeof result===',typeof result);
        
          return JSON.parse(result);
        //}
        return result;
        // console.log(result,"ffffsss")
        
      } catch (error) {
        throw error; // You can handle the error in your application logic
      }
    }





     setValue11(key, value, expirationInSeconds) {
        console.log(key, value, expirationInSeconds,"key, value, expirationInSeconds");
      return new Promise((resolve, reject) => {
        try {
          this.client.set(key, value, 'EX', expirationInSeconds, (setError) => {
            if (setError) {
              reject(setError);
            } else {
              resolve();
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    async setValue(key, value, expirationInSeconds) {
        try {
          console.log('Attempting to set value in Redis...');
          this.checkConnection((error) => {
            if (error) {
              console.error('Redis client is closed:', error);
              throw error;
            } else {
              // Set the value with expiration
              this.client.set(key, value, 'EX', expirationInSeconds, (setError) => {
                if (setError) {
                  console.error('Error setting value in Redis:', setError);
                  throw setError;
                } else {
                  console.log('Value set successfully in Redis');
                }
              });
            }
          });
          // await this.checkConnection();
          // Use the promisified set method
          // console.log(key, value, expirationInSeconds,"FFFFSSSS")
          // await this.setAsync(key, value, 'EX', expirationInSeconds);
            // this.client.set(key, value, 'EX', expirationInSeconds)
          // resolve();
        } catch (error) {
          console.error('Error in setValue:', error);
    throw error;
        }
      // });
    }

    async setValueHash(key, field, value) {
      try {
        // await this.hsetAsync(key, field, value);
        console.log('HSET successful');
      } catch (error) {
        console.error('Error during HSET:', error);
      }
    }

  quit(callback) {
    if (this.connected) {
      this.client.quit((err) => {
        if (err) {
          return callback(err);
        } else {
          return callback(null);
        }
      });
    } else {
      return callback(null);
    }
  }
}
// const objRedis= new RedisService()
// export default objRedis;
export default RedisService;