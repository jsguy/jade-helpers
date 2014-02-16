//	Add helpers to jade
//	From: https://groups.google.com/forum/#!topic/jadejs/ufsL-wd4E8w
//	Basic functions for decorating values
//
//	Note: 	This should not ever return HTML, but rather 
//			just generate formatted values. You can optionally
//			allow passing in a template if necessary.
//
//	Note2: 	Try to not create dependancies, as it would be nice if 
//			we could expose these on the front end as well
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
	},
	/*
			augment.js

			This function will add (deeply) any standard objects and arrays.
			It augments (modifies) o1 with o2.
			This is meant for configuration only, and will likely have undesirable 
			results with more complex objects, or if you try to mash an object with an array.
	*/
	augment: function(o1, o2) {
			var i, oldArrays = {};
			//	We use only the objects own properties
			for (i in o2) {if(o2.hasOwnProperty(i)) {
				if (o2[i] && o2[i].constructor && o2[i].constructor === Object) {
					//	Deal with objects (recurse)
					o1[i] = o1[i] || {};
					arguments.callee(o1[i], o2[i]);
				} else if( Object.prototype.toString.call( o1[i] ) === '[object Array]' ) {
					//	Deal with Array
					if(o2[i] && Object.prototype.toString.call(o2[i]) === '[object Array]') {
						o1[i] = o1[i].concat(o2[i]);
					}
				} else {
					o1[i] = o2[i];
				}
			}}

			return o1;
	},

	//	Grabs just the attributes from a field
	fieldAttr: function(field, defaults) {
		var attr = {}, i;
		defaults = defaults || {};
		//	Set attributes
		for(i in field) { if(field.hasOwnProperty(i)) {
			if(i !== "meta" && i !== "options") {
				attr[i] = field[i];
			}
		}}
		//	Add in any defults
		for(i in defaults) { if(!field.hasOwnProperty(i)) {
			if(i !== "meta" && i !== "options") {
				attr[i] = defaults[i];
			}
		}}
		return attr;
	},
	fieldMeta: function(field) {
		return field.meta || {};
	},
	fieldOptions: function(field) {
		return field.options || [];
	},
	//	returns: { attr:{}, meta:{}, options: [] }
	getFieldObject: function(type, field, attribs) {
		var attr = this.augment(field, attribs);

		attr.id = field.id || field.name;
		attr.type = field.type || type;

		return {
			attr: this.fieldAttr(field, attr),
			meta: this.fieldMeta(field),
			options: this.fieldOptions(field)
		};
	}
};

//	Express integration for locals
exports.addHelpers = function(locals) {
	var i;
	locals.helper = {};
	for(i in exports.helpers) { if(exports.helpers.hasOwnProperty(i)) {
		locals.helper[i] = exports.helpers[i];
	}}
};