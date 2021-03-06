function goTop(){	
	$('html, body').animate({scrollTop: 240}, 300);
}

var CATEGORY_HIERARCHY = function() {
	var ret = {};
	for (var i in category) {
		var type = category[i].split('-')[0];
		if (!ret[type]) {
			ret[type] = [];
		}
		ret[type].push(category[i]);
	}
	return ret;
}();

// for table use
function thead(score, isShoppingCart) {
	var ret = '<div class="tr truenav">';
	ret += '<div class="td score">分数</div>\
	<div class="td name">名称</div>\
	<div class="td category">类别</div>\
	<div class="td">编号</div>\
	<div class="td">心级</div>\
	<div class="td rate">简约</div>\
	<div class="td rate">华丽</div>\
	<div class="td rate">活泼</div>\
	<div class="td rate">优雅</div>\
	<div class="td rate">可爱</div>\
	<div class="td rate">成熟</div>\
	<div class="td rate">清纯</div>\
	<div class="td rate">性感</div>\
	<div class="td rate">清凉</div>\
	<div class="td rate">保暖</div>\
	<div class="td tag">属性</div>\
	<div class="td source">来源</div>';
	if (!isShoppingCart) {
		ret += '</div>\
		<div class="tr nav" onclick="goTop()">\
		<div class="td score">分数</div>\
		<div class="td name">名称</div>\
		<div class="td category">类别</div>\
		<div class="td">编号</div>\
		<div class="td">心级</div>\
		<div class="td rate">简约</div>\
		<div class="td rate">华丽</div>\
		<div class="td rate">活泼</div>\
		<div class="td rate">优雅</div>\
		<div class="td rate">可爱</div>\
		<div class="td rate">成熟</div>\
		<div class="td rate">清纯</div>\
		<div class="td rate">性感</div>\
		<div class="td rate">清凉</div>\
		<div class="td rate">保暖</div>\
		<div class="td tag">属性</div>\
		<div class="td source">来源</div>';
	}
	return ret + '</div>\n';
}

function tr(tds) {
	return '<div class="tr' + tds + '</div>\n';
}

function td(data, cls, tltp) {
	return '<div class="td' + cls + '"' + tltp + '>' + data + '</div>';
}

function addShoppingCart(type, id) {
	shoppingCart.put(clothesSet[type][id]);
	refreshShoppingCart();
}

function removeShoppingCart(type) {
	shoppingCart.remove(type);
	refreshShoppingCart();
}

function clearShoppingCart() {
	shoppingCart.clear();
	refreshShoppingCart();
}

function toggleInventory(type, id) {
	var checked = !clothesSet[type][id].own;
	clothesSet[type][id].own = checked;
	$('#clickable-' + type + id).parent('.tr').toggleClass('own');
	saveAndUpdate();
}

function clickableTd(piece) {
	var ret = '';
	var name = piece.name;
	var type = piece.type.mainType;
	var id = piece.id;
	var own = piece.own;
	var deps = piece.getDeps('');
	var cls = 'td name';
	var tooltip = '';
	var end = '';
	end += own ? ' own' : '';
	if (deps && deps.length > 0) {
		tooltip = ' class="tooltip" data-content="' + deps + '" onClick="toggleTooltip.call(this)"';
		if (deps.indexOf('&#8709;') > 0) {
			cls += ' deps';
		}
	}
	ret += end + '">';
	ret += td('<a onClick="addShoppingCart(\'' + piece.type.mainType + '\',\'' + piece.id + '\')">' + piece.tmpScore + '</a>', ' score', '');
	ret += '<div id="clickable-' + type + id + '" class="' + cls + '"><a class="item" ' + 'onClick="toggleInventory(\'' + type + '\',\'' + id + '\')">' + name + '</a><span' + tooltip + '> </span></div>';
	return ret;
}

function toggleTooltip() {
	$('.show').not(this).removeClass('show');
	$(this).toggleClass('show');
}

function row(piece, isShoppingCart) {
	var ret = '';
	if (isShoppingCart) {
		ret += '">';
		if (piece.id) {
			ret += td('<a onClick=\'removeShoppingCart("' + piece.type.type + '")\'>' + piece.tmpScore + '</a>', ' score', '');
		}
		ret += td(piece.name, ' nameChosen', '');
	} else {
		ret += clickableTd(piece);
	}
	var csv = piece.toCsv();
	if ( render(csv[0]) == '上装' ) {
		ret += td('上衣', ' category', '');
	} else {
		ret += td(render(csv[0]), ' category', '');
	}
	ret += td(render(csv[1]), ' id', '');
	ret += td(render(csv[2]), ' star', '');
	ret += td(render(csv[3]), renderCls(csv[3]), ' data-tooltip="简"');
	ret += td(render(csv[4]), renderCls(csv[4]), ' data-tooltip="华"');
	ret += td(render(csv[5]), renderCls(csv[5]), ' data-tooltip="活"');
	ret += td(render(csv[6]), renderCls(csv[6]), ' data-tooltip="雅"');
	ret += td(render(csv[7]), renderCls(csv[7]), ' data-tooltip="爱"');
	ret += td(render(csv[8]), renderCls(csv[8]), ' data-tooltip="熟"');
	ret += td(render(csv[9]), renderCls(csv[9]), ' data-tooltip="纯"');
	ret += td(render(csv[10]), renderCls(csv[10]), ' data-tooltip="感"');
	ret += td(render(csv[11]), renderCls(csv[11]), ' data-tooltip="凉"');
	ret += td(render(csv[12]), renderCls(csv[12]), ' data-tooltip="暖"');
	ret += td(render(csv[13]), ' tag', '');
	ret += td(render(csv[14]), ' source', '');
	return tr(ret);
}

function rowTtlScr(piece, isShoppingCart) {
	var ret = '';
	ret += ' totalScore">';
	ret += td(piece.tmpScore, ' score', '');
	ret += td(piece.name, ' name', '');
	ret += td('', ' void', '');
	ret += td('', ' void', '');
	ret += td('', ' void', '');
	var csv = piece.toCsv();
	ret += td(render(csv[3]), renderCls(csv[3]), ' data-tooltip="简"');
	ret += td(render(csv[4]), renderCls(csv[4]), ' data-tooltip="华"');
	ret += td(render(csv[5]), renderCls(csv[5]), ' data-tooltip="活"');
	ret += td(render(csv[6]), renderCls(csv[6]), ' data-tooltip="雅"');
	ret += td(render(csv[7]), renderCls(csv[7]), ' data-tooltip="爱"');
	ret += td(render(csv[8]), renderCls(csv[8]), ' data-tooltip="熟"');
	ret += td(render(csv[9]), renderCls(csv[9]), ' data-tooltip="纯"');
	ret += td(render(csv[10]), renderCls(csv[10]), ' data-tooltip="感"');
	ret += td(render(csv[11]), renderCls(csv[11]), ' data-tooltip="凉"');
	ret += td(render(csv[12]), renderCls(csv[12]), ' data-tooltip="暖"');
	ret += td('', ' void', '');
	ret += td('<a onclick="clearShoppingCart()">清 空</a>', ' clearCart', '');
	return tr(ret);
}

function render(piece) {
	if (piece.charAt(0) == '-') {
		return piece.substring(1);
	}
	return piece;
}

function renderCls(piece) {
	if (piece.length == '0') {
		return ' void';
	} else if (piece.charAt(0) == '-') {
		return ' negative';
	} else if (piece == 'SS' || piece == 'S' || piece == 'A' || piece == 'B' || piece == 'C') {
		return ' rating ' + piece;
	} else {
		return '';
	}
}

function list(rows, isShoppingCart) {
	ret = '';
	for (var i in rows) {
		ret += row(rows[i], isShoppingCart);
	}
	if (isShoppingCart) {
//		ret += row(shoppingCart.totalScore, isShoppingCart);
		ret += rowTtlScr(shoppingCart.totalScore, isShoppingCart);
	}
	return ret;
}

function drawTable(data, div, isShoppingCart) {
	if ($('#' + div + ' .table').length == 0) {
		$('#' + div).html('<div class="table"><div class="thead"></div><div class="tbody"></div></div>');
	}
	$('#' + div + ' .table .thead').html(thead(true, isShoppingCart));
	$('#' + div + ' .table .tbody').html(list(data, isShoppingCart));
}

var criteria = {};
function onChangeCriteria() {
	criteria = {};
	for (var i in FEATURES) {
		var f = FEATURES[i];
		var weight = parseFloat($('#' + f + "Weight").val());
		if (!weight) {
			weight = 1;
		}
		var checked = $('input[name=' + f + ']:radio:checked');
		if (checked.length) {
			criteria[f] = parseInt(checked.val()) * weight;
		}
		checked.parent('label').addClass('checked');
	}
	tagToBonus(criteria, 'tag1');
	tagToBonus(criteria, 'tag2');
	if (global.additionalBonus && global.additionalBonus.length > 0) {
		criteria.bonus = global.additionalBonus;
	}
	chooseAccessories(criteria);
	drawLevelInfo();
	refreshTable();
}

function tagToBonus(criteria, id) {
	var tag = $('#' + id).val();
	var bonus = null;
	if (tag.length > 0) {
		var base = $('#' + id + 'base :selected').text();
		var weight = parseFloat($('#' + id + 'weight').val());
		if ($('input[name=' + id + 'method]:radio:checked').val() == 'replace') {
			bonus = replaceScoreBonusFactory(base, weight, tag)(criteria);
		} else {
			bonus = addScoreBonusFactory(base, weight, tag)(criteria);
		}
		if (!criteria.bonus) {
			criteria.bonus = [];
		}
		criteria.bonus.push(bonus);
	}
}

function clearTag(id) {
	$('#' + id).val('');
	$('#' + id + 'base').val('SS');
	$('#' + id + 'weight').val('1');
	$('input[name=' + id + 'method]:radio').get(0).checked = true;
}

function bonusToTag(idx, info) {
	$('#tag' + idx).val(info.tag);
	if (info.replace) {
		$('input[name=tag' + idx + 'method]:radio').get(1).checked = true;
	} else {
		$('input[name=tag' + idx + 'method]:radio').get(0).checked = true;
	}
	$('#tag' + idx + 'base').val(info.base);
	$('#tag' + idx + 'weight').val(info.weight);
}

var uiFilter = {};
function onChangeUiFilter() {
	uiFilter = {};
	$('#displayFilter input:checked').each(function() {
		uiFilter[$(this).val()] = true;
	});
	if (currentCategory) {
		if (CATEGORY_HIERARCHY[currentCategory].length > 1) {
			$('input[name=category-' + currentCategory + ']:checked').each(function() {
				uiFilter[$(this).val()] = true;
			});
		} else {
			uiFilter[currentCategory] = true;
		}
	}
	refreshTable();
}

function refreshTable() {
	drawTable(filtering(criteria, uiFilter), "clothes", false);
}

function clone(obj) {
	var o;
	if (typeof obj == "object") {
		if (obj === null) {
			o = null;
		} else {
			if (obj instanceof Array) {
				o = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					o.push(clone(obj[i]));
				}
			} else {
				o = {};
				for (var j in obj) {
					o[j] = clone(obj[j]);
				}
			}
		}
	} else {
		o = obj;
	}
	return o;
}

function chooseAccessories(accfilters) {
	shoppingCart.clear();
	shoppingCart.putAll(filterTopAccessories(clone(accfilters)));
	shoppingCart.putAll(filterTopClothes(clone(accfilters)));
	refreshShoppingCart();
}

function refreshShoppingCart() {
	shoppingCart.calc(criteria);
	drawTable(shoppingCart.toList(byCategoryAndScore), "shoppingCart", true);
}

function drawLevelInfo() {
	var info = "";
	var $skill = $("#skillInfo");
	var $hint = $("#hintInfo");
	$skill.empty();
	$hint.empty();
	if (currentLevel) {
		var log = [];
		if (currentLevel.filter) {
			if (currentLevel.filter.tagWhitelist) {
				log.push("属性允许：" + currentLevel.filter.tagWhitelist);
			}
			if (currentLevel.filter.nameWhitelist) {
				log.push("名字含有: " + currentLevel.filter.nameWhitelist);
			}
		}
		if (currentLevel.additionalBonus) {
			for (var i in currentLevel.additionalBonus) {
				var bonus = currentLevel.additionalBonus[i];
				var match = "(";
				if (bonus.tagWhitelist) {
					match += "tag符合：" + bonus.tagWhitelist + "";
				}
				if (bonus.nameWhitelist) {
					match += "名字含有：" + bonus.nameWhitelist;
				}
				match += ")";
				log.push(match + "：" + bonus.note + " " + bonus.param);
			}
		}
		if (currentLevel.skills) {
			var $shaonv, $gongzhu, $normal, shaonvSkill, gongzhuSkill, normalSkill;
			if(currentLevel.skills[0]){
				$shaonv = $("<font>").text("少女级技能：").addClass("shaonvSkill");
				shaonvSkill = "";
				for (var i in currentLevel.skills[0]) {
					shaonvSkill += (currentLevel.skills[0][i] + "");
				}
			}
			if(currentLevel.skills[1]){
				$gongzhu = $("<font>").text("公主级技能：").addClass("gongzhuSkill");
				gongzhuSkill = "";
				for (var i in currentLevel.skills[1]) {
					gongzhuSkill += (currentLevel.skills[1][i] + "");
				}
			}
			if(currentLevel.skills[2]){
				$normal = $("<font>").text("技能：").addClass("normalSkill");
				normalSkill = "";
				for (var i in currentLevel.skills[2]) {
					normalSkill += (currentLevel.skills[2][i] + "");
				}
			}
			$skill.append($shaonv).append(shaonvSkill).append($gongzhu).append(gongzhuSkill).append($normal).append(normalSkill);
		}
		if (currentLevel.hint) {
			var $hintInfo = $("<font>").text("过关提示：").addClass("hintInfo");
			$hint.append($hintInfo).append(currentLevel.hint);
		}
		info = log.join(" ");
	}
	$("#tagInfo").text(info);
}

function byCategoryAndScore(a, b) {
	var cata = category.indexOf(a.type.type);
	var catb = category.indexOf(b.type.type);
	return (cata - catb == 0) ? b.tmpScore - a.tmpScore : cata - catb;
}

function byScore(a, b) {
	return b.tmpScore - a.tmpScore;
}

function byId(a, b) {
	return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
}

function filterTopAccessories(filters) {
	filters['own'] = true;
	var accCate = CATEGORY_HIERARCHY['饰品'];
	for (var i in accCate) {
		filters[accCate[i]] = true;
	}
	var result = {};
	for (var i in clothes) {
		if (matches(clothes[i], {}, filters)) {
			clothes[i].calc(filters);
			if (!result[clothes[i].type.type]) {
				result[clothes[i].type.type] = clothes[i];
			} else if (clothes[i].tmpScore > result[clothes[i].type.type].tmpScore) {
				result[clothes[i].type.type] = clothes[i];
			}
		}
	}
	var toSort = [];
	for (var c in result) {
		toSort.push(result[c]);
	}
	toSort.sort(byScore);
	var total = 0;
	var i;
	for (i = 0; i < toSort.length; i++) {
		realScoreBefore = accScore(total, i);
		realScore = accScore(total + toSort[i].tmpScore, i+1);
		if (realScore < realScoreBefore) {
			break;
		}
		total += toSort[i].tmpScore;
	}
	return toSort.slice(0, i);
}

function filterTopClothes(filters) {
	filters['own'] = true;
	//var accCate = CATEGORY_HIERARCHY['饰品'];
	for (var i in CATEGORY_HIERARCHY) {
		if(i == "袜子"){
			filters[CATEGORY_HIERARCHY[i][0]] = true;
			filters[CATEGORY_HIERARCHY[i][1]] = true;
		}
		if(i != "饰品"){
			filters[CATEGORY_HIERARCHY[i]] = true;
		}
	}
	var result = {};
	for (var i in clothes) {
		if (matches(clothes[i], {}, filters)) {
			clothes[i].calc(filters);
			if (!result[clothes[i].type.type]) {
				result[clothes[i].type.type] = clothes[i];
			} else if (clothes[i].tmpScore > result[clothes[i].type.type].tmpScore) {
				result[clothes[i].type.type] = clothes[i];
			}
		}
	}
	if(result["上装"] && result["下装"] && result["连衣裙"]){
		if(result["上装"].tmpScore + result["下装"].tmpScore > result["连衣裙"].tmpScore){
			delete result["连衣裙"];
		}
		else{
			delete result["上装"];
			delete result["下装"];
		}
	}
	return result;
}

function filtering(criteria, filters) {
	var result = [], result2 = [];

	for (var i in clothes) {
		if (matches(clothes[i], criteria, filters)) {
			clothes[i].calc(criteria);
			result.push(clothes[i]);
		}
	}

	var haveCriteria = false;
	for (var prop in criteria) {
		if (criteria[prop] != 0) {
			haveCriteria = true;
		}
	}
	if (haveCriteria) {
		result.sort(byCategoryAndScore);
	} else {
		result.sort(byId);
	}

	if (filters.showtop) {
		var size = 20;
		if (result[0].type.mainType == '袜子') {
			size = 10;
		}
		if (result[0].type.mainType == '饰品') {
			size = 5;
		}
		var tsize = size;
		for (var i in result) {
			if (i > 0 && result[i].type.type != result[i - 1].type.type) {
				tsize = size;
			}
			if (tsize > 0) {
				result2.push(result[i]);
			}
			tsize--;
		}
		if (filters.sortbyscore) {
			result2.sort(byScore);
		}
		else {
			result.sort(byCategoryAndScore);
		}
		return result2;
	}

	return result;
}

function matches(c, criteria, filters) {
	return ((c.own && filters.own) || (!c.own && filters.missing)) && filters[c.type.type];
}

function loadCustomInventory() {
	var myClothes = $("#myClothes").val();
	if (myClothes.indexOf('|') > 0) {
		loadNew(myClothes);
	} else {
		load(myClothes);
	} 
	saveAndUpdate();
	refreshTable();
}

function toggleAll(c) {
	var all = $('#all-' + c)[0].checked;
	var x = $('input[name=category-' + c + ']:checkbox');
	x.each(function() {
		this.checked = all;
	});
	onChangeUiFilter();
}

function drawFilter() {
	out = '<ul class="tabs" id="categoryTab">';
	for (var c in CATEGORY_HIERARCHY) {
		out += '<li id="' + c + '"><a onClick="switchCate(\'' + c + '\')">' + c + '</a></li>';
	}
	out += "</ul>";
	for (var c in CATEGORY_HIERARCHY) {
		out += '<div id="category-' + c + '">';
		out += '<div class="subcategories">';
		if (CATEGORY_HIERARCHY[c].length > 1) {
			out += "<span class='subcategory'><input type='checkbox' id='all-" + c + "' onClick='toggleAll(\"" + c + "\")' checked>"
					+ "<label for='all-" + c + "'>全选</label></span>\n";
			// draw sub categories
			for (var i in CATEGORY_HIERARCHY[c]) {
				out += "<span class='subcategory'><input type='checkbox' name='category-" + c + "' value='" + CATEGORY_HIERARCHY[c][i]
						+ "' id='" + CATEGORY_HIERARCHY[c][i] + "' onClick='onChangeUiFilter()' checked /><label for='"
						+ CATEGORY_HIERARCHY[c][i] + "'>" + CATEGORY_HIERARCHY[c][i].substring(3) + "</label></span>\n";
			}
		} else {
			out += "<span class='nosubcategory'><input type='checkbox' disabled='true' checked>无子分类</span>\n";
					}
		out += '</div></div>';
	}
	$('#category_container').html(out);
}

var currentCategory;
function switchCate(c) {
	currentCategory = c;
	$("ul.tabs li").removeClass("active");
	$("#category_container div").removeClass("active");
	$("#" + c).addClass("active");
	$("#category-" + c).addClass("active");
	onChangeUiFilter();
}

function changeFilter() {
	$("#theme")[0].options[1].selected = true;
	currentLevel = null;
	onChangeCriteria();
}

function changeTheme() {
	currentLevel = null;
	global.additionalBonus = null;
	var theme = $('#theme').val();
	if (theme == 'default') {
		$('#styleFilter input:radio').prop('checked', false).parent('.checked').removeClass('checked');
		$('#styleFilter input:text').val('1');
		clearTag('tag1');
		clearTag('tag2');
		onChangeCriteria();
		clearShoppingCart();
	} else {
		if (allThemes[theme]) {
			setFilters(allThemes[theme]);
		}
		$('#styleFilter .checked').removeClass('checked');
		onChangeCriteria();
	}
}

var currentLevel; // used for post filtering.
function setFilters(level) {
	currentLevel = level;
	global.additionalBonus = currentLevel.additionalBonus;
	var weights = level.weight;
	for (var i in FEATURES) {
		var f = FEATURES[i];
		var weight = weights[f];
		$('#' + f + 'Weight').val(Math.abs(weight));
		var radios = $('input[name=' + f + ']:radio');
		for (var j in radios) {
			var element = radios[j];
			if (parseInt(element.value) * weight > 0) {
				element.checked = true;
				break;
			}
		}
	}
	clearTag('tag1');
	clearTag('tag2');
	if (level.bonus) {
		for (var i in level.bonus) {
			bonusToTag(parseInt(i)+1, level.bonus[i]);
		}
	}
}

function drawTheme() {
	var dropdown = $('#theme')[0];
	for (var theme in allThemes) {
		var option = document.createElement('option');
		option.text = theme;
		option.value = theme;
		dropdown.add(option);
	}
}

function saveAndUpdate() {
	var mine = save();
	updateSize(mine);
}

function updateSize(mine) {
	$('#inventoryCount').text(mine.size);
	$('#myClothes').val(mine.serialize());
	var subcount = {};
	for (c in mine.mine) {
		var type = c.split('-')[0];
		if (!subcount[type]) {
			subcount[type] = 0;
		}
		subcount[type] += mine.mine[type].length;
	}
	for (c in subcount) {
		if ( c == '上装' ) {
			$('#' + c + '> a').html('上衣 <span class="count">' + subcount[c] + '</span>');
		} else {
			$('#' + c + '> a').html(c + ' <span class="count">' + subcount[c] + '</span>');
		}
	}
}

function reset() {
	$('#theme').val('default');
	changeTheme();
}

function init() {
	var mine = loadFromStorage();
	calcDependencies();
	drawFilter();
	drawTheme();
	updateSize(mine);
	switchCate(category[0]);
	$('#displayFilter input').change(function () {
		onChangeUiFilter();
	});
	$('#styleFilter input:radio').prop('checked', false);
	$('#styleFilter input:text').val('1');
	clearTag('tag1');
	clearTag('tag2');
	clearShoppingCart();
//	$('html, body').scrollTop('0');
}

$(document).ready(function() {
	$(window).scroll(function() {
		if ( $(window).scrollTop() > $('#clothes .truenav').offset().top ) {
			$('#clothes .nav').addClass('fix');
		} else {
			$('#clothes .nav').removeClass('fix');
		}
	});
	$('.btn :checkbox:checked').parent('label').addClass('checked');
	$('.btn :checkbox').click(function() {
		$(this).parent('label').toggleClass('checked');
	});
	$('.btn :radio:not(.checked)').click(function() {
		$(this).parent('label').addClass('checked');
		$(this).parent('label').siblings('.checked').removeClass('checked');
	});
	init();
});
