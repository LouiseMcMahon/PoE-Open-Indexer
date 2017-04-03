'use strict';

module.exports.invoker = function (event, context) {
	let t = + new Date();
	let i = 0;
	let check = true;
	while (check){
		// only run 60 times
		if (i === 60) {
			check = false;
			break;
		//only run once a second
		}else if (t+1000 < + new Date()){
			// t = t+1000; and not t = + new Date() as we always slightly slower than 1000ms
			t = t+1000;
			i++;
			invokeRiver();
		}
	}

	return true;

};

function invokeRiver() {
		//TODO invoke function
}
