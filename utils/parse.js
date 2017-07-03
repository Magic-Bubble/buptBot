var builder = require('botbuilder');

function filter (args) {
	var tmpEntities = builder.EntityRecognizer.findAllEntities(args.intent.entities, "学校列表");
	tmpEntities = tmpEntities.concat(builder.EntityRecognizer.findAllEntities(args.intent.entities, "院系机构列表"));
	tmpEntities = tmpEntities.concat(builder.EntityRecognizer.findAllEntities(args.intent.entities, "专业列表"));
	tmpEntities = tmpEntities.concat(builder.EntityRecognizer.findAllEntities(args.intent.entities, "常识列表"));
	tmpEntities = tmpEntities.concat(builder.EntityRecognizer.findAllEntities(args.intent.entities, "关系列表"));
	tmpEntities.sort(function (a, b) {
		return parseInt(a.startIndex) == parseInt(b.startIndex) ? 
			parseInt(b.endIndex) - parseInt(a.endIndex) : parseInt(a.startIndex) - parseInt(b.startIndex)
		});
	var tmp = [];
	var curEnd = 0;
	for (var i=0; i<tmpEntities.length; i++) {
		var end = parseInt(tmpEntities[i].endIndex);
		if (end > curEnd) {
			tmp.push(tmpEntities[i]);
			curEnd = end;
		}
	}
	return tmp;
}

function getByType (list, type, all=false) {
	if (!all) {
		var tmp = "";
		for (var i=0; i<list.length; i++) {
			if (list[i].type == type) {
				tmp = list[i].resolution.values[0];
				break;
			}
		}
		// var tmpEntity = builder.EntityRecognizer.findEntity(args.intent.entities, type);
		// if (tmpEntity) tmp = tmpEntity.resolution.values[0];
	} else {
		var tmp = [];
		// var tmpEntities = builder.EntityRecognizer.findAllEntities(args.intent.entities, type);
		for (var i=0; i<list.length; i++) {
			if (list[i].type == type) tmp.push(list[i].resolution.values[0]);
		}
	}
	return tmp;
}

function getSchool (list) {
	return getByType(list, "学校列表");
}

function getDepartment (list) {
	return getByType(list, "院系机构列表");
}

function getMajor (list) {
	return getByType(list, "专业列表");
}

function getCommon (list) {
	return getByType(list, "常识列表");
}

function getRelationships (list) {
	return getByType(list, "关系列表", true);
}

module.exports = {
	"filter": filter,
	"getSchool": getSchool,
	"getDepartment": getDepartment,
	"getMajor": getMajor,
	"getCommon": getCommon,
	"getRelationships": getRelationships
}
