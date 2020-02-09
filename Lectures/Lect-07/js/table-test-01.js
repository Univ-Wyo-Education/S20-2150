
var x_data = [
	{
		"Name": "Bob",
		"Value": 23,
		"id": "123-id-abc"
	},
	{
		"Name": "Jane",
		"Value": 28,
		"id": "123-id-def"
	},
];

var actionUrlTmpl = "/api/v2/user-edit?id=%{id%}&__method__=POST&_ran_=%{ran%}&act=%{act%}&%{data%}"
function ActionFunc ( idCol, fullRow, fullTableData, rowNum, colNum, colName ) {
	return qt ( [ '',
		'       <td>\n',
		'         <button type="button" class="btn btn-primary bind-click" data-click="submitUpdate" data-id="%{id%}">Update</button>\n',
		'         <button type="button" class="btn btn-primary bind-click" data-click="submitDelete" data-id="%{id%}">Delete</button>\n',
		'       </td>\n',
	].join(""), fullRow );
}

var x_hdrCfg = {
	ColNames: 	[ { Name:"Name"}, 		{ Name:"Value" }, 		{ Name:"Action" } 	],
};

var x_rowCfg = {
	cols: [
			{ Name: "Name" },
			{ Name: "Value", rowTmpl: "$%{Value%}" },
			{ Name: "id", fx: ActionFunc },
// Name - column nmae
// fx - fuctnion that if set will have data past to it - more powerful - but code - for maping instead of using templates.
// defaultValue - a default if no column value is supplied.
// defaultIfEmpty - a default if "" is the value supplied
// rowTmpl - a QT tempaltes - this allows for wrapping a column with HTML using a template
// rowColTmpl - a hash by column name of QT tempaltes - this allows for wrapping a column/row number with stuff.
	]
};

renderTableTo ( "#output", x_data, x_hdrCfg, x_rowCfg );

