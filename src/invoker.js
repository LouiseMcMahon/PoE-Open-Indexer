/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
'use strict';
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

module.exports.invoker = function (event, context, callback) {
	let t = + new Date();
	let waiting = false;
	let waitTime = 1000;
	let nextId = null;
	while (true){
		if (context.getRemainingTimeInMillis() < waitTime){
			console.log('no time left', context.getRemainingTimeInMillis());
			break;
		}else if(waiting){
			continue;
		}else if (t + waitTime < + new Date()){
			console.log('inovking river');
			// t = t + waitTime and not t = + new Date() as we are always slightly slower than 1000ms
			t = t + waitTime;
			waiting = true;
			invokeRiver(nextId, function (err, data) {
				waiting = false;
				if (err) {
					console.log(err);
				}

				console.log('river response', data);
				if (data && data.nextId){
					nextId = data.nextId;
				}

			});
		}
	}

	return callback(null,true);

};

function invokeRiver(nextId, callback) {
	const json = {nextId : nextId};
	const params = {
		FunctionName: process.env.RiverARN,
		InvocationType: 'RequestResponse',
		LogType: 'None',
		ClientContext: new Buffer(JSON.stringify({})).toString('base64'),
		Payload: JSON.stringify(json)
	};

	try {
		lambda.invoke(params, function (err, data) {
			if(err){
				console.log('err', err);
				return callback(err,null);
			}
			console.log('data', data);
			return callback(null,{nextId : JSON.parse(data.Payload).nextId});
		});
	} catch (err) {
		console.log(err);
		callback(err, null);
	}

}
