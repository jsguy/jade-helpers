//	Add helpers to jade
//	From: https://groups.google.com/forum/#!topic/jadejs/ufsL-wd4E8w
//	Basic functions for decorating values
//
//	Note: 	This should not ever return HTML, but rather 
//			just generate formatted values. You can optionally
//			allow passing in a template, if necessary
//
//
exports.helpers = {
	//  Nicely format a number as money, including germanic style - original from: http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
	//  eg: console.log(formatMoney(123456789.12345, ',', '.'));
	//	args: currency, value, decimal, seperator, template
	formatMoney: function(args) {
		args.template = args.template? args.template: "[sign][currency][value]";
		args.sign = args.value < 0 ? "-" : "",
		args.decimal = args.decimal == undefined ? "." : args.decimal;
		args.seperator = args.seperator == undefined ? "," : args.seperator;

		var number = parseInt(args.value = Math.abs(+args.value || 0).toFixed(2), 10) + "",
			splitThousand = (splitThousand = number.length) > 3 ? splitThousand % 3 : 0,
			result;

		result = (splitThousand ? number.substr(0, splitThousand) + args.seperator : "") + number.substr(splitThousand).replace(/(\d{3})(?=\d)/g, "$1" + args.seperator) + (2 ? args.decimal + Math.abs(args.value - number).toFixed(2).slice(2) : "");
		return args.template
			.split('[sign]').join(args.sign)
			.split('[currency]').join(args.currency)
			.split('[value]').join(result);
	}
};

//	Express integration for locals
exports.addHelpers = function(locals) {
	var i;
	for(i in exports.helpers) { if(exports.helpers.hasOwnProperty(i)) {
		locals[i] = exports.helpers[i];
	}}
};