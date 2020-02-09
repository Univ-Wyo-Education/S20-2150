
// Copyright (C) Philip Schlump, 2012.

// Render of Tables into .html

function qt(tmpl, ns, fx) {
	if ( typeof fx == "undefined" ) { fx = {} };
	var p1 = tmpl.replace(/%{([A-Za-z0-9_|.,]*)%}/g, function(j, t) {
			var pl;
			var s = "";
			var a = t.split("|");
			for ( var i = 0; i < a.length; i++ ) {
				// console.log ( "ts1: a["+i+"] =["+a[i]+"]" );
				pl = a[i].split(",");
				// console.log ( "ts1: pl[0] =["+pl[0]+"]"+"  typeof for this =="+typeof fx[pl[0]] );
				if ( typeof fx [ pl[0] ] === "function" ) {
					var fx2 = fx[ pl[0] ];
					s = fx2(s,ns,pl);									// Now call each function as a pass thru-filter
				} else if ( typeof ns [ pl[0] ] === "string" || typeof ns [ pl[0] ] === "number" ) {
					s = ns[ pl[0] ];
				} else {
					s = "";
				}
			}
			return s;
		});
	return p1;
};


// 2 parts to a render - the header config, the per-row config.
// You pass in the data, a array of data hashes .

// toId 	- #id - where table is to be renderd to.
// data 	-
// hdrCfg 	-
// rowCfg 	-

function renderTableTo ( toId, data, hdrCfg, p_rowCfg ) {
	var out = [];

	out.push ( '<table class="table ', hdrCfg.TableClass, '">\n' );

	// -------------------- header ------------------------------------------------------------------
	out.push ( ' <thead>\n' );
	out.push ( '   <tr>\n' );
	for ( var ii = 0, mx = hdrCfg.ColNames.length; ii < mx; ii++ ) {
		out.push ( "       <th>", hdrCfg.ColNames[ii].Name, "</th>\n" );
	}
	out.push ( '   </tr>\n' );
	out.push ( ' </thead>\n' );

	// -------------------- body ------------------------------------------------------------------
	out.push ( ' <tbody>\n' );
	// xyzzy -- TODO -- xyzzy
	for ( var ii = 0, mx = data.length; ii < mx; ii++ ) {
		out.push ( '   <tr>\n' );
		var row = data[ii];
		row["_rowNum_"] = ii;
		for ( var jj = 0, my = p_rowCfg.cols.length; jj < my ; jj++ ) {
			var rowCfg = p_rowCfg.cols[jj];
			var colName = rowCfg.Name;
			var fx1 = rowCfg.fx;
			var colData = row[colName];
			if ( ! colData ) {
				colData = "";
				if ( rowCfg.defaltValue ) {
					colData = rowCfg.defaltValue;
				}
			} else if ( rowCfg.defaultIfEmpty && colData == "" ) {
				colData = rowCfg.defaltIfEmpty;
			}
			// add template - by Col Pos, by Row/Col pos override.
			if ( rowCfg.rowTmpl ) {
				// console.log ( "Calling qt with", rowCfg.rowTmpl, row);
				colData = qt(rowCfg.rowTmpl, row);
			} 
			if ( rowCfg.rowColTmpl && rowCfg.rowColTmpl[jj] ) {
				// xyzzy - this needs work.
				colData = qt(rowCfg.rowColTmpl[jj], row);
			}
			// xyzzy - TODO add in col-position _1st, _last, _odd, _even
			// xyzzy - TODO - check for func, template etc...
			if ( typeof fx1 === "function" ) {
				out.push ( fx1 ( colData, row, data, ii, jj, colName ) );
			} else {
				out.push ( '       <td>', colData , '</td>\n' );
			}

		} 
		out.push ( '   </tr>\n' );
	}
	out.push ( ' </tbody>\n' );

	out.push ( '</table>\n' );

	var sOut = out.join("");
	// console.log ( sOut );

	$(toId).html ( sOut );
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
function renderHoriz1TableTo ( toId, data, hdrCfg, p_rowCfg ) {
	var out = [];

	out.push ( '<table class="table ', hdrCfg.TableClass, '">\n' );

	// -------------------- header ------------------------------------------------------------------
	out.push ( ' <thead>\n' );
	out.push ( '   <tr>\n' );
	for ( var ii = 0, mx = hdrCfg.ColNames.length; ii < mx; ii++ ) {
		out.push ( "       <th>", hdrCfg.ColNames[ii].Name, "</th>\n" );
	}
	out.push ( '   </tr>\n' );
	out.push ( ' </thead>\n' );

	// -------------------- body ------------------------------------------------------------------
	out.push ( ' <tbody>\n' );
	// xyzzy -- TODO -- xyzzy
	for ( var ii = 0, mx = p_rowCfg.rows.length; ii < mx; ii++ ) {
		var rowCfg = p_rowCfg.rows[ii];
		var colName = rowCfg.Name;
		out.push ( '   <tr>\n' );
		out.push ( '     <th>', rowCfg.Title, "</th>" );
		var colData = data[colName];
		var row = {};
		row[colName] = colData;
		row["_name_"] = colName;
		row["_colNum_"] = ii;

		var fx1 = rowCfg.fx;
		if ( ! colData ) {
			colData = "";
			if ( rowCfg.defaltValue ) {
				colData = rowCfg.defaltValue;
			}
		} else if ( rowCfg.defaultIfEmpty && colData == "" ) {
			colData = rowCfg.defaltIfEmpty;
		}
		// add template - by Col Pos, by Row/Col pos override.
		if ( rowCfg.rowTmpl ) {
			// console.log ( "Calling qt with", rowCfg.rowTmpl, row);
			colData = qt(rowCfg.rowTmpl, row);
		} 
		// xyzzy - TODO add in col-position _1st, _last, _odd, _even
		// xyzzy - TODO - check for func, template etc...
		if ( typeof fx1 === "function" ) {
			out.push ( fx1 ( colData, row, data, ii, -1, colName ) );
		} else {
			out.push ( '       <td>', colData , '</td>\n' );
		}

		out.push ( '   </tr>\n' );
	} 

	out.push ( ' </tbody>\n' );

	out.push ( '</table>\n' );

	var sOut = out.join("");
	// console.log ( sOut );

	$(toId).html ( sOut );
}

