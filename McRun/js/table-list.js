
function postRenderListExistingFiles() {
	console.log ( "Post - List Tables - List of uploade files" );

	// var actionUrlTmpl = "/api/v2/user-edit?id=%{id%}&__method__=POST&_ran_=%{ran%}&act=%{act%}&%{data%}";

	function ActionFunc ( idCol, fullRow, fullTableData, rowNum, colNum, colName ) {
		return qt ( [ '',
			'       <td>\n',
			'         <button type="button" class="btn btn-primary bind-click-row" data-click="submitRunXLS" data-id="%{id%}" data-pos="%{_rowNum_%}">Run</button>\n',
			'       </td>\n',
		].join(""), fullRow );
	}

	var y_hdrCfg = {
		ColNames: 	[ { Name:"Description"}, 		{ Name:"Created" }, 		{ Name:"Action" } 	],
	};

	var y_rowCfg = {
		cols: [
				{ Name: "Description", rowTmpl: "%{orig_file_name%}: %{note%}" },
				{ Name: "Created", rowTmpl: "%{created%}" },
				{ Name: "id", fx: ActionFunc },
			// Name - column nmae
			// fx - fuctnion that if set will have data past to it - more powerful - but code - for maping instead of using templates.
			// defaultValue - a default if no column value is supplied.
			// defaultIfEmpty - a default if "" is the value supplied
			// rowTmpl - a QT tempaltes - this allows for wrapping a column with HTML using a template
			// rowColTmpl - a hash by column name of QT tempaltes - this allows for wrapping a column/row number with stuff.
		]
	};

	$.ajax({
		type: 'GET',
		url: "/api/v2/list-uploaded-documents-xls",
		data: { "_ran_": ( Math.random() * 10000000 ) % 10000000 },
		success: function (data) {
			console.log ( "success AJAX", data );
			if ( data.status == "success" ) {
				// Paint TO: <div class="ListOfUploadedFiles" id="TableListOfUploadedFiles"></div>
				renderTableTo ( "#TableListOfUploadedFiles", data.data, y_hdrCfg, y_rowCfg );
				// xyzzy - may need to bind to ".bind-click" again at this point?
				// xyzzy - may need to curry a function (closure) w/ "id"
				$("#body").on('click','.bind-click-row',function(){
					var fx = $(this).data("click");
					var id = $(this).data("id");
					var pos = $(this).data("pos");
					var _this = this;
					// console.log ( "fx", fx, "id", id, "_rowNum_", pos );
					callFunc( fx, _this, id, data.data, pos );
				}); 
			} else {
				renderError ( "Error", data.msg );
				render5SecClearMessage ( );
			}
		},
		error: function(resp) {
			$("#output").text( "Error!"+JSON.stringify(resp) );
			var msg = resp.statusText;
			renderError ( "xyzzy-title:table-list.js:51", msg );
			render5SecClearMessage ( );
		}
	});

}

/*
data.data[0] = 
	{
		"file_name": "./www/files/19d8b82179321a0972d0f9536a012f0467e749a56302f7e114dbb9ba808e286e.jpg",
		"id": "a0e468e1-417b-4354-6ee5-9e6c4e75c7cf",
		"note": "User Note - document is",
		"orig_file_name": "200942513428762.jpg",
		"url_file_name": "/files/19d8b82179321a0972d0f9536a012f0467e749a56302f7e114dbb9ba808e286e.jpg",
		"user_id": "b8b5a898-0fce-449d-6194-c37a55ef5e68",
		"created": "2020-01-14T09:29:07.16144+0000"
	},
*/
function submitRunXLS(arg) {
	var id = arg[2];
	var data = arg[3];
	var pos = arg[4];
	console.log ( "submitRunXLS", id, arg, data, pos );

	// Get the Rendered (.html) vesion of the form and then post it into the page.
	// renderFormTo ( "#TableListOfUploadedFiles", data.data, y_hdrCfg, y_rowCfg );
	$.ajax({
		type: 'GET',
		url: "/api/v2/render-poi-form",
		data: {
			"_ran_": ( Math.random() * 10000000 ) % 10000000,
			"id": id,
		},
		success: function (data) {
			// console.log ( "success AJAX", data );
			renderPoiForm();
			$("#put-form-at-this-point").html ( data );
			$("#put-id").val(id);
		},
		error: function(resp) {
			$("#output").text( "Error!"+JSON.stringify(resp) );
			var msg = resp.statusText;
			renderError ( "xyzzy-title:table-list.js:107", msg );
			render5SecClearMessage ( );
		}
	});
}


/*
data looks like:
		{
            "OUT_BIPremium": "132.08",
            "OUT_CollPremium": "218.52",
            "OUT_CompPremium": "72.94",
            "OUT_MedPaymentsPremium": "49.42",
            "OUT_PDPremium": "125.77",
            "OUT_PersonalInjuryPremium": "115.75",
            "OUT_TotalPremium": "865.46",
            "OUT_UnderinsuredPremium": "75.49",
            "OUT_UninsuredPremium": "75.49"
        }
p_rowCfg is:
	{
		"Rows": [
			{ "Name": "OUT_CompPremium"
			, "Title": "Computed Premium"
			},
		]
	}
*/

function submitRunForm() {
	console.log ( "Just got called:submitRunForm" );

	var raw_json = false;
	var o_hdrCfg = {
		ColNames: 	[ { Name:"Description"}, 		{ Name:"Value" } 	]
	};
	var o_rowCfg = {
		rows: [
			// , fx: function ( ... ) { }
			// , defaultValue: "..."
			// , defaltIfEmpty: false
			// , rowTmpl: "..."
			{ "Name": "OUT_CompPremium" ,			"Title": "Computed Premium"				},
            { "Name": "OUT_BIPremium",				"Title": "BIP Premium"					},
            { "Name": "OUT_CollPremium",			"Title": "Collected Premium"			},
            { "Name": "OUT_MedPaymentsPremium",		"Title": "Med Payents Premium"			},
            { "Name": "OUT_PDPremium",				"Title": "PD Premium"					},
            { "Name": "OUT_PersonalInjuryPremium",	"Title": "Personal Injury Premium"		},
            { "Name": "OUT_UnderinsuredPremium",	"Title": "Underinsured  Premium"		},
            { "Name": "OUT_UninsuredPremium",		"Title": "Uninsured Premium"			},
            { "Name": "OUT_TotalPremium",			"Title": "Total Premium"				},
		]
	}; 

	// mux.Handle("/api/v2/save-data-to-file", http.HandlerFunc(HandleSaveDataToFile)).Method("GET", "POST").AuthRequired().DocTag("<h2>/api/v2/save-data-to-file").Inputs([]*ymux.MuxInput{
	var x_data = {};
	$(".poi-form-element").each(function() {
		var name = $(this).attr("name")
		var dv = $(this).val();
		// console.log ( "Adding", name, dv );
		x_data[name] = dv;
	})
	// console.log ( x_data );


	// xyzzy - should be combined into 1 server side 
	//	Inputs -- really really should be a "POST" call!
	//		form_data
	//		put_id
	//		-> file_name for form to run
	//		-> file_name for data to run it with
	//		-> /api/v1/run-poi - run the actual XLS form.
	// 	ss.go: func HandleSaveDataToFile(www http.ResponseWriter, req *http.Request) {
	//
	$.ajax({
		type: 'GET',
		url: "/api/v2/save-data-to-file",
		data: {
			"_ran_": ( Math.random() * 10000000 ) % 10000000,
			"data": JSON.stringify(x_data),			// xyzzy - form_data
		},
		success: function (data) {

			console.log ( "success AJAX - on run of form", data );
			var x_fn = data.file_name;

			// ---------------------------------------------------------------------------------------	
			$.ajax({
				type: 'GET',
				url: "/api/v2/id-to-fn-documents",
				data: {
					"_ran_": ( Math.random() * 10000000 ) % 10000000,
					"id": $("#put-id").val(),			// xyzzy - put-id - id of form to run or id of XLS to run
				},
				success: function (data) {
					console.log ( "success AJAX - on run of form", data );
					$("#output").text( "Data!"+JSON.stringify(data) );

					var x_in = data.data[0].file_name;

					// ---------------------------------------------------------------------------------------	
					$.ajax({
						type: 'GET',
						url: "/api/v1/run-poi",
						data: {
							"_ran_": ( Math.random() * 10000000 ) % 10000000,
							"in": x_in,
							"data": x_fn,
						},
						success: function (data) {
							console.log ( "success AJAX - on run of form", data );
							renderPoiOutput();
							if ( raw_json ) {
								$("#poi-output").html ( "<pre>" + JSON.stringify(data, undefined, 4) + "</pre>" );
							} else {
								renderHoriz1TableTo ( "#poi-output", data.data.outputs, o_hdrCfg, o_rowCfg ) 
							}
							$("#output").text( "Data!"+JSON.stringify(data, undefined, 4) );
						},
						error: function(resp) {
							$("#output").text( "Error!"+JSON.stringify(resp) );
							var msg = resp.statusText;
							renderError ( "xyzzy-title:table-list.js:168", msg );
							render5SecClearMessage ( );
						}
					});
					// ---------------------------------------------------------------------------------------	
			
				},
				error: function(resp) {
					$("#output").text( "Error!"+JSON.stringify(resp) );
					var msg = resp.statusText;
					renderError ( "xyzzy-title:table-list.js:179", msg );
					render5SecClearMessage ( );
				}
			});
			// ---------------------------------------------------------------------------------------	

		},
		error: function(resp) {
			$("#output").text( "Error!"+JSON.stringify(resp) );
			var msg = resp.statusText;
			renderError ( "xyzzy-title:table-list.js:188", msg );
			render5SecClearMessage ( );
		}
	});


}

