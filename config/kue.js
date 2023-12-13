const kue = require('kue');
const Redis = require('ioredis');

// Create a Kue queue using the Redis client
const queue = kue.createQueue({
    redis: {
        createClientFactory: function () {
            return new Redis({
                password: 'qceiXlUvWxFzlR2SoVTmvjWfkUHlpDyd',
                host: 'redis-18164.c325.us-east-1-4.ec2.cloud.redislabs.com',
                port: 18164,
            });
        }
    }
});

module.exports = queue;
